"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getUser } from "@/lib/auth-helpers";
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Search, UserCheck, Mail, Calendar, MapPin, Shield, Loader2, Trash2, Edit2, RefreshCw, AlertTriangle, Database, CheckCircle } from 'lucide-react';

interface User {
  id: string;
  email: string;
  displayName?: string;
  country?: string;
  createdAt: string | null;
  isAdmin?: boolean;
  requiresPasswordChange?: boolean;
  kycStatus?: string;
  accounts?: string[];
  hasFirestoreDoc?: boolean;
  lastSignIn?: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<'all' | 'admin' | 'users' | 'missing'>('all');
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [syncStats, setSyncStats] = useState<{
    authCount: number;
    firestoreCount: number;
    missingFirestoreDocs: number;
  } | null>(null);

  const adminNavItems = [
    { name: "Admin Dashboard", href: "/admin", icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" /></svg>) },
    { name: "Crypto Orders", href: "/admin/crypto-orders", icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" /><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" /></svg>) },
    { name: "Card Orders", href: "/admin/card-orders", icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" /></svg>) },
    { name: "Accounts", href: "/admin/accounts", icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" /></svg>) },
    { name: "Emails", href: "/admin/emails", icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>) },
    { name: "KYC Reviews", href: "/admin/kyc", icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>) },
    { name: "Payouts", href: "/admin/payouts", icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>) },
    { name: "Users", href: "/admin/users", icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg>) },
    { name: "Settings", href: "/admin/settings", icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>) },
  ];

  // Fetch users from API (uses Admin SDK - bypasses security rules)
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('[AdminUsers] Fetching users from API...');
      const response = await fetch('/api/admin/users');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('[AdminUsers] Received', data.total, 'users from API');
      console.log('[AdminUsers] Auth users:', data.authCount, 'Firestore docs:', data.firestoreCount);
      
      if (data.users) {
        setUsers(data.users);
        setSyncStats({
          authCount: data.authCount,
          firestoreCount: data.firestoreCount,
          missingFirestoreDocs: data.missingFirestoreDocs
        });
      } else {
        throw new Error('No users data in response');
      }
    } catch (err: any) {
      console.error('[AdminUsers] Error fetching users:', err);
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync missing Firestore documents
  const syncMissingDocs = async () => {
    if (!confirm('This will create Firestore documents for all Auth users that are missing them. Continue?')) {
      return;
    }
    
    setSyncing(true);
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'syncAllMissing' })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert(`Successfully created ${data.created} missing Firestore documents!`);
        // Refresh the list
        await fetchUsers();
      } else {
        throw new Error(data.error || 'Sync failed');
      }
    } catch (err: any) {
      console.error('[AdminUsers] Error syncing:', err);
      alert('Failed to sync: ' + err.message);
    } finally {
      setSyncing(false);
    }
  };

  // Create single Firestore doc
  const createFirestoreDoc = async (userId: string, email: string, displayName?: string) => {
    setUpdatingUserId(userId);
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'createFirestoreDoc',
          userId,
          email,
          displayName
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh the list
        await fetchUsers();
      } else {
        throw new Error(data.error || 'Failed to create document');
      }
    } catch (err: any) {
      console.error('[AdminUsers] Error creating doc:', err);
      alert('Failed to create Firestore doc: ' + err.message);
    } finally {
      setUpdatingUserId(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = await getUser(user.uid);
        if (!userData?.isAdmin) {
          router.push("/dashboard");
          return;
        }
        setCurrentUserEmail(user.email || "");
        // Fetch users after confirming admin status
        fetchUsers();
      } else {
        router.push("/auth");
      }
    });

    return () => unsubscribe();
  }, [router, fetchUsers]);

  const missingDocsCount = users.filter(u => u.hasFirestoreDoc === false).length;

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.country?.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (filter === 'admin') matchesFilter = user.isAdmin === true;
    else if (filter === 'users') matchesFilter = user.isAdmin !== true;
    else if (filter === 'missing') matchesFilter = user.hasFirestoreDoc === false;

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: users.length,
    admins: users.filter(u => u.isAdmin).length,
    regular: users.filter(u => !u.isAdmin).length,
    missing: missingDocsCount,
  };

  const handleToggleAdmin = async (userId: string, currentIsAdmin: boolean) => {
    if (!confirm(`Are you sure you want to ${currentIsAdmin ? 'remove admin access from' : 'grant admin access to'} this user?`)) {
      return;
    }

    setUpdatingUserId(userId);
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        isAdmin: !currentIsAdmin
      });
      // Refresh the list
      await fetchUsers();
      alert(`User ${currentIsAdmin ? 'demoted from' : 'promoted to'} admin successfully`);
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user. Please try again.');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Are you sure you want to delete the user ${userEmail}? This action cannot be undone and will remove all their data.`)) {
      return;
    }

    const confirmDelete = prompt(`Type "${userEmail}" to confirm deletion:`);
    if (confirmDelete !== userEmail) {
      alert('Deletion cancelled - email did not match');
      return;
    }

    setUpdatingUserId(userId);
    try {
      await deleteDoc(doc(db, 'users', userId));
      // Refresh the list
      await fetchUsers();
      alert('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-exodus-blue via-exodus-blue to-exodus-dark flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-white animate-spin mx-auto mb-4" />
          <p className="text-white">Loading users from Firebase Auth & Firestore...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout navItems={adminNavItems} userEmail={currentUserEmail} isAdmin={true}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Users Management</h1>
            <p className="text-gray-300">Manage all registered users and their permissions</p>
          </div>
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Sync Warning Banner */}
        {missingDocsCount > 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-yellow-400 font-semibold">
                  {missingDocsCount} user(s) missing Firestore documents
                </p>
                <p className="text-yellow-400/80 text-sm mt-1">
                  These users have Firebase Auth accounts but no profile data in Firestore. 
                  This can happen when users are created through Whop but the Firestore doc creation fails.
                </p>
                <button
                  onClick={syncMissingDocs}
                  disabled={syncing}
                  className="mt-3 flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  {syncing ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Database size={16} />
                  )}
                  <span>{syncing ? 'Syncing...' : 'Create Missing Firestore Docs'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
            <p className="font-semibold">Error loading users:</p>
            <p>{error}</p>
            <button 
              onClick={fetchUsers}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-lg border-2 border-blue-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm font-semibold">Total Users</h3>
              <UserCheck className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
            {syncStats && (
              <p className="text-xs text-gray-400 mt-1">
                Auth: {syncStats.authCount} | Firestore: {syncStats.firestoreCount}
              </p>
            )}
          </div>

          <div className="bg-white/10 backdrop-blur-lg border-2 border-purple-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm font-semibold">Admin Users</h3>
              <Shield className="w-8 h-8 text-purple-400" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.admins}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border-2 border-green-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm font-semibold">Regular Users</h3>
              <UserCheck className="w-8 h-8 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.regular}</p>
          </div>

          <div className={`bg-white/10 backdrop-blur-lg border-2 rounded-xl p-6 ${stats.missing > 0 ? 'border-yellow-500/30' : 'border-green-500/30'}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm font-semibold">Missing Docs</h3>
              {stats.missing > 0 ? (
                <AlertTriangle className="w-8 h-8 text-yellow-400" />
              ) : (
                <CheckCircle className="w-8 h-8 text-green-400" />
              )}
            </div>
            <p className={`text-3xl font-bold ${stats.missing > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
              {stats.missing}
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/10 backdrop-blur-lg border-2 border-exodus-light-blue rounded-2xl p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by email, name, or country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                }`}
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setFilter('admin')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'admin'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                }`}
              >
                Admins ({stats.admins})
              </button>
              <button
                onClick={() => setFilter('users')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'users'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                }`}
              >
                Users ({stats.regular})
              </button>
              {stats.missing > 0 && (
                <button
                  onClick={() => setFilter('missing')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === 'missing'
                      ? 'bg-yellow-500 text-black'
                      : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                  }`}
                >
                  Missing Docs ({stats.missing})
                </button>
              )}
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left text-gray-300 font-semibold py-3 px-2">Status</th>
                  <th className="text-left text-gray-300 font-semibold py-3 px-2">Email</th>
                  <th className="text-left text-gray-300 font-semibold py-3 px-2">Display Name</th>
                  <th className="text-left text-gray-300 font-semibold py-3 px-2">Country</th>
                  <th className="text-left text-gray-300 font-semibold py-3 px-2">Joined</th>
                  <th className="text-left text-gray-300 font-semibold py-3 px-2">Role</th>
                  <th className="text-left text-gray-300 font-semibold py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-gray-400 py-8">
                      {users.length === 0 ? 'No users found' : 'No users match your search/filter'}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className={`border-b border-white/10 hover:bg-white/5 ${!user.hasFirestoreDoc ? 'bg-yellow-500/5' : ''}`}>
                      <td className="py-4 px-2">
                        {user.hasFirestoreDoc ? (
                          <span title="Synced - Has Firestore doc">
                            <CheckCircle size={18} className="text-green-400" />
                          </span>
                        ) : (
                          <span title="Missing Firestore document">
                            <AlertTriangle size={18} className="text-yellow-400" />
                          </span>
                        )}
                      </td>
                      <td className="text-white py-4 px-2">
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-gray-400 flex-shrink-0" />
                          <span className="truncate max-w-[200px]">{user.email}</span>
                        </div>
                      </td>
                      <td className="text-white py-4 px-2">{user.displayName || 'N/A'}</td>
                      <td className="text-white py-4 px-2">
                        <div className="flex items-center gap-1">
                          {user.country && user.country !== 'Unknown' && <MapPin size={14} className="text-gray-400" />}
                          {user.country || 'N/A'}
                        </div>
                      </td>
                      <td className="text-gray-300 py-4 px-2">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} className="text-gray-400" />
                          {formatDate(user.createdAt)}
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        {user.isAdmin ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded text-xs font-semibold">
                            <Shield size={12} />
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded text-xs font-semibold">
                            <UserCheck size={12} />
                            User
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2">
                          {!user.hasFirestoreDoc ? (
                            <button
                              onClick={() => createFirestoreDoc(user.id, user.email, user.displayName || undefined)}
                              disabled={updatingUserId === user.id}
                              className="p-2 text-yellow-500 hover:bg-yellow-500/10 rounded transition-colors disabled:opacity-50"
                              title="Create Firestore Document"
                            >
                              {updatingUserId === user.id ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <Database size={16} />
                              )}
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => handleToggleAdmin(user.id, user.isAdmin || false)}
                                disabled={updatingUserId === user.id}
                                className={`p-2 rounded transition-colors ${
                                  user.isAdmin 
                                    ? 'text-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-400' 
                                    : 'text-purple-500 hover:bg-purple-500/10 hover:text-purple-400'
                                } disabled:opacity-50`}
                                title={user.isAdmin ? 'Demote from Admin' : 'Promote to Admin'}
                              >
                                {updatingUserId === user.id ? (
                                  <Loader2 size={16} className="animate-spin" />
                                ) : (
                                  <Edit2 size={16} />
                                )}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id, user.email)}
                                disabled={updatingUserId === user.id}
                                className="p-2 text-red-500 hover:bg-red-500/10 hover:text-red-400 rounded transition-colors disabled:opacity-50"
                                title="Delete User"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* User Count Footer */}
          <div className="mt-4 pt-4 border-t border-white/10 text-gray-400 text-sm">
            Showing {filteredUsers.length} of {users.length} total users
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
