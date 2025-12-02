"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getAllAccounts, updateAccountCredentials, getUser, type Account } from "@/lib/auth-helpers";

export default function AdminAccountsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [credentials, setCredentials] = useState({ login: "", password: "", server: "Exodus-Live01" });
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  const adminNavItems = [
    { name: "Admin Dashboard", href: "/admin", icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" /></svg>) },
    { name: "Users", href: "/admin/users", icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg>) },
    { name: "Accounts", href: "/admin/accounts", icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" /></svg>) },
    { name: "KYC Reviews", href: "/admin/kyc", icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>) },
    { name: "Payouts", href: "/admin/payouts", icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" /><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" /></svg>) },
    { name: "Purchases", href: "/admin/purchases", icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" /></svg>) },
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
        const fetchedAccounts = await getAllAccounts();
        setAccounts(fetchedAccounts);
        setLoading(false);
      } else {
        router.push("/auth");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleAddCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccount || !credentials.login || !credentials.password) {
      alert("Please fill in all credential fields");
      return;
    }

    try {
      await updateAccountCredentials(selectedAccount.id, credentials);
      alert("Credentials added successfully!");
      setSelectedAccount(null);
      setCredentials({ login: "", password: "", server: "Exodus-Live01" });
      // Refresh accounts
      const fetchedAccounts = await getAllAccounts();
      setAccounts(fetchedAccounts);
    } catch (error) {
      console.error("Error adding credentials:", error);
      alert("Failed to add credentials. Please try again.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "inactive":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      case "breached":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-exodus-blue via-exodus-blue to-exodus-dark flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <DashboardLayout navItems={adminNavItems} userEmail={currentUserEmail} isAdmin={true}>
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Manage Accounts</h1>
          <p className="text-gray-300">View all trading accounts and add MT5 credentials</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-lg border-2 border-exodus-light-blue/30 rounded-xl p-6">
            <h3 className="text-gray-300 text-sm font-semibold mb-2">Total Accounts</h3>
            <p className="text-3xl font-bold text-white">{accounts.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg border-2 border-green-500/30 rounded-xl p-6">
            <h3 className="text-gray-300 text-sm font-semibold mb-2">Active</h3>
            <p className="text-3xl font-bold text-white">{accounts.filter(a => a.status === 'active').length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg border-2 border-yellow-500/30 rounded-xl p-6">
            <h3 className="text-gray-300 text-sm font-semibold mb-2">Pending Setup</h3>
            <p className="text-3xl font-bold text-white">{accounts.filter(a => a.status === 'pending').length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg border-2 border-red-500/30 rounded-xl p-6">
            <h3 className="text-gray-300 text-sm font-semibold mb-2">Breached</h3>
            <p className="text-3xl font-bold text-white">{accounts.filter(a => a.status === 'breached').length}</p>
          </div>
        </div>

        {/* Accounts Table */}
        <div className="bg-white/10 backdrop-blur-lg border-2 border-exodus-light-blue rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-white mb-6">All Trading Accounts</h2>
          
          {accounts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No accounts yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left text-gray-300 font-semibold py-3 px-2">User ID</th>
                    <th className="text-left text-gray-300 font-semibold py-3 px-2">Size</th>
                    <th className="text-left text-gray-300 font-semibold py-3 px-2">Platform</th>
                    <th className="text-left text-gray-300 font-semibold py-3 px-2">Status</th>
                    <th className="text-left text-gray-300 font-semibold py-3 px-2">Balance</th>
                    <th className="text-left text-gray-300 font-semibold py-3 px-2">Profit/Loss</th>
                    <th className="text-left text-gray-300 font-semibold py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((account) => (
                    <tr key={account.id} className="border-b border-white/10 hover:bg-white/5">
                      <td className="text-gray-300 py-4 px-2 font-mono text-xs">{account.userId.substring(0, 8)}...</td>
                      <td className="text-white font-semibold py-4 px-2">{account.accountSize}</td>
                      <td className="text-white py-4 px-2">
                        <span className="px-2 py-1 bg-exodus-light-blue/20 border border-exodus-light-blue/30 rounded text-xs font-semibold">
                          {account.platform || 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${getStatusColor(account.status)}`}>
                          {account.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="text-white py-4 px-2">${account.balance.toLocaleString()}</td>
                      <td className={`py-4 px-2 font-semibold ${account.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {account.profit >= 0 ? '+' : ''}${account.profit.toLocaleString()}
                      </td>
                      <td className="py-4 px-2">
                        <button
                          onClick={() => setSelectedAccount(account)}
                          className="text-exodus-light-blue hover:text-blue-300 transition font-semibold text-sm"
                        >
                          {account.credentials ? 'View' : 'Add Credentials'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add/View Credentials Modal */}
        {selectedAccount && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedAccount(null)}
          >
            <div
              className="bg-exodus-dark border-2 border-exodus-light-blue rounded-2xl p-6 md:p-8 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedAccount.accountSize} Account</h2>
                  <p className="text-gray-400">User ID: {selectedAccount.userId}</p>
                  {selectedAccount.platform && (
                    <p className="text-gray-400">Platform: <span className="text-exodus-light-blue font-semibold">{selectedAccount.platform}</span></p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedAccount(null)}
                  className="text-gray-400 hover:text-white transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {selectedAccount.credentials ? (
                /* View Existing Credentials */
                <div className="bg-white/10 border border-exodus-light-blue/30 rounded-lg p-6">
                  <h3 className="text-white font-bold text-lg mb-4">MT5 Credentials</h3>
                  <div className="space-y-3">
                    <div className="bg-white/5 p-3 rounded">
                      <p className="text-gray-400 text-xs mb-1">Login</p>
                      <p className="text-white font-mono">{selectedAccount.credentials.login}</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded">
                      <p className="text-gray-400 text-xs mb-1">Password</p>
                      <p className="text-white font-mono">{selectedAccount.credentials.password}</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded">
                      <p className="text-gray-400 text-xs mb-1">Server</p>
                      <p className="text-white font-mono">{selectedAccount.credentials.server}</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Add New Credentials Form */
                <form onSubmit={handleAddCredentials} className="space-y-4">
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
                    <p className="text-yellow-400 text-sm">
                      <strong>⚠️ Manual Setup Required:</strong> Add MT5 credentials from your broker platform
                    </p>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">MT5 Login ID *</label>
                    <input
                      type="text"
                      value={credentials.login}
                      onChange={(e) => setCredentials(prev => ({ ...prev, login: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-exodus-light-blue transition"
                      placeholder="12345678"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">MT5 Password *</label>
                    <input
                      type="text"
                      value={credentials.password}
                      onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-exodus-light-blue transition"
                      placeholder="TempPass123!"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">MT5 Server *</label>
                    <input
                      type="text"
                      value={credentials.server}
                      onChange={(e) => setCredentials(prev => ({ ...prev, server: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-exodus-light-blue transition"
                      placeholder="Exodus-Live01"
                      required
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setSelectedAccount(null)}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-semibold transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-exodus-light-blue hover:bg-blue-400 text-white py-3 rounded-lg font-semibold transition"
                    >
                      Save Credentials
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

