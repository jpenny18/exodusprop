"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getUser } from "@/lib/auth-helpers";
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { Shield, Check, X, Clock, FileText, Loader2, Eye, User } from 'lucide-react';

interface KYCSubmission {
  id: string;
  userId: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  personalInfo: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  documents: {
    governmentIdUrl?: string;
    governmentIdFileName?: string;
    proofOfAddressUrl?: string;
    proofOfAddressFileName?: string;
  };
  reviewNotes?: string;
  createdAt: any;
  updatedAt: any;
}

export default function AdminKYCPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [submissions, setSubmissions] = useState<KYCSubmission[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<KYCSubmission | null>(null);

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = await getUser(user.uid);
        if (!userData?.isAdmin) {
          router.push("/dashboard");
          return;
        }
        setCurrentUserEmail(user.email || "");
      } else {
        router.push("/auth");
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const q = query(collection(db, 'kycSubmissions'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const submissionsData: KYCSubmission[] = [];
      snapshot.forEach((doc) => {
        submissionsData.push({ id: doc.id, ...doc.data() } as KYCSubmission);
      });
      setSubmissions(submissionsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusUpdate = async (submissionId: string, newStatus: 'approved' | 'rejected', notes?: string) => {
    try {
      const submissionRef = doc(db, 'kycSubmissions', submissionId);
      await updateDoc(submissionRef, {
        status: newStatus,
        reviewNotes: notes || '',
        updatedAt: new Date()
      });
      setSelectedSubmission(null);
    } catch (error) {
      console.error('Error updating KYC status:', error);
      alert('Failed to update status');
    }
  };

  const filteredSubmissions = submissions.filter(sub => filter === 'all' || sub.status === filter);

  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-exodus-blue via-exodus-blue to-exodus-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  return (
    <DashboardLayout navItems={adminNavItems} userEmail={currentUserEmail} isAdmin={true}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">KYC Reviews</h1>
          <p className="text-gray-300">Review and approve customer verification documents</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-lg border-2 border-blue-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm font-semibold">Total Submissions</h3>
              <FileText className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border-2 border-yellow-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm font-semibold">Pending Review</h3>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.pending}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border-2 border-green-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm font-semibold">Approved</h3>
              <Check className="w-8 h-8 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.approved}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border-2 border-red-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm font-semibold">Rejected</h3>
              <X className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.rejected}</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'approved' ? 'bg-green-500 text-white' : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'rejected' ? 'bg-red-500 text-white' : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
            }`}
          >
            Rejected
          </button>
        </div>

        {/* Submissions Table */}
        <div className="bg-white/10 backdrop-blur-lg border-2 border-exodus-light-blue rounded-2xl p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left text-gray-300 font-semibold py-3 px-2">Customer</th>
                  <th className="text-left text-gray-300 font-semibold py-3 px-2">Email</th>
                  <th className="text-left text-gray-300 font-semibold py-3 px-2">Country</th>
                  <th className="text-left text-gray-300 font-semibold py-3 px-2">Submitted</th>
                  <th className="text-left text-gray-300 font-semibold py-3 px-2">Status</th>
                  <th className="text-left text-gray-300 font-semibold py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-400 py-8">
                      No KYC submissions found
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((submission) => (
                    <tr key={submission.id} className="border-b border-white/10 hover:bg-white/5">
                      <td className="text-white py-4 px-2">
                        {submission.personalInfo.firstName} {submission.personalInfo.lastName}
                      </td>
                      <td className="text-gray-300 py-4 px-2">{submission.email}</td>
                      <td className="text-gray-300 py-4 px-2">{submission.personalInfo.country}</td>
                      <td className="text-gray-300 py-4 px-2">
                        {submission.createdAt ? new Date(submission.createdAt.toMillis()).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-4 px-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold border ${
                          submission.status === 'approved' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                          submission.status === 'rejected' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                          'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                        }`}>
                          {submission.status === 'approved' && <Check size={12} />}
                          {submission.status === 'rejected' && <X size={12} />}
                          {submission.status === 'pending' && <Clock size={12} />}
                          {submission.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-2">
                        <button
                          onClick={() => setSelectedSubmission(submission)}
                          className="text-blue-500 hover:text-blue-400 transition-colors flex items-center gap-1"
                        >
                          <Eye size={16} />
                          Review
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Review Modal */}
        {selectedSubmission && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">KYC Review</h2>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Name:</span>
                      <p className="text-white">{selectedSubmission.personalInfo.firstName} {selectedSubmission.personalInfo.lastName}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Email:</span>
                      <p className="text-white">{selectedSubmission.email}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Phone:</span>
                      <p className="text-white">{selectedSubmission.personalInfo.phone}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Country:</span>
                      <p className="text-white">{selectedSubmission.personalInfo.country}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-400">Address:</span>
                      <p className="text-white">
                        {selectedSubmission.personalInfo.address}, {selectedSubmission.personalInfo.city}, {selectedSubmission.personalInfo.state} {selectedSubmission.personalInfo.postalCode}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Documents</h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-400">Government ID: {selectedSubmission.documents.governmentIdFileName || 'Not uploaded'}</p>
                    <p className="text-gray-400">Proof of Address: {selectedSubmission.documents.proofOfAddressFileName || 'Not uploaded'}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleStatusUpdate(selectedSubmission.id, 'approved')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                  >
                    <Check size={16} />
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedSubmission.id, 'rejected', 'Documents do not meet requirements')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    <X size={16} />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

