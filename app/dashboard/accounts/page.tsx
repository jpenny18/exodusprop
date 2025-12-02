"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { getUserAccounts, type Account } from "@/lib/auth-helpers";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { userDashboardNavItems } from "@/lib/dashboard-nav";

export default function AccountsPage() {
  const [userEmail, setUserEmail] = useState("");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserEmail(user.email || "");
        const fetchedAccounts = await getUserAccounts(user.uid);
        setAccounts(fetchedAccounts);
      }
    });

    return () => unsubscribe();
  }, []);


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

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
  };

  return (
    <DashboardLayout navItems={userDashboardNavItems} userEmail={userEmail}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">My Accounts</h1>
          <p className="text-gray-300">View and manage your trading accounts</p>
        </div>

        {/* No Accounts Message */}
        {accounts.length === 0 && (
          <div className="bg-white/10 backdrop-blur-lg border-2 border-yellow-500/30 rounded-2xl p-8 text-center">
            <svg className="w-16 h-16 text-yellow-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <h3 className="text-2xl font-bold text-white mb-2">No Accounts Yet</h3>
            <p className="text-gray-300 mb-6">
              Your trading account credentials are being set up. You'll receive an email within 24 hours with your login details.
            </p>
            <a
              href="/purchase"
              className="inline-block bg-exodus-light-blue hover:bg-blue-400 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Purchase Another Account
            </a>
          </div>
        )}

        {/* Accounts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="bg-white/10 backdrop-blur-lg border-2 border-exodus-light-blue rounded-2xl p-6 hover:border-exodus-light-blue/60 transition cursor-pointer"
              onClick={() => setSelectedAccount(account)}
            >
              {/* Account Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white">{account.accountSize}</h3>
                  <p className="text-gray-400 text-sm">{account.accountType} Evaluation</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${getStatusColor(
                    account.status
                  )}`}
                >
                  {account.status.toUpperCase()}
                </span>
              </div>

              {/* Account Stats */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-400 text-sm">Current Balance</span>
                  <span className="text-white font-bold">${account.balance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-400 text-sm">Profit/Loss</span>
                  <span
                    className={`font-bold ${
                      account.profit >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {account.profit >= 0 ? "+" : ""}${account.profit.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-400 text-sm">Start Date</span>
                  <span className="text-white font-semibold">
                    {new Date(account.startDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* View Details Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAccount(account);
                }}
                className="w-full bg-exodus-light-blue hover:bg-blue-400 text-white py-2 rounded-lg font-semibold transition"
              >
                View Details
              </button>
            </div>
          ))}

          {/* Add New Account Card */}
          <div className="bg-white/10 backdrop-blur-lg border-2 border-dashed border-exodus-light-blue/50 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[300px] hover:border-exodus-light-blue transition">
            <svg
              className="w-16 h-16 text-exodus-light-blue mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <h3 className="text-xl font-bold text-white mb-2">Purchase New Account</h3>
            <p className="text-gray-400 text-center mb-4">
              Scale up your trading with a new evaluation account
            </p>
            <a
              href="/purchase"
              className="bg-exodus-light-blue hover:bg-blue-400 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Browse Accounts
            </a>
          </div>
        </div>

        {/* Selected Account Details Modal */}
        {selectedAccount && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedAccount(null)}
          >
            <div
              className="bg-exodus-dark border-2 border-exodus-light-blue rounded-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    {selectedAccount.accountSize} Account
                  </h2>
                  <p className="text-gray-400">{selectedAccount.accountType} Evaluation</p>
                </div>
                <button
                  onClick={() => setSelectedAccount(null)}
                  className="text-gray-400 hover:text-white transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Account Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/10 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">Current Balance</p>
                  <p className="text-white text-2xl font-bold">
                    ${selectedAccount.balance.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">Profit/Loss</p>
                  <p
                    className={`text-2xl font-bold ${
                      selectedAccount.profit >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {selectedAccount.profit >= 0 ? "+" : ""}$
                    {selectedAccount.profit.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Pending Credentials Message */}
              {!selectedAccount.credentials && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6 mb-6">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-yellow-400 shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="text-yellow-400 font-bold mb-2">Credentials Pending</h4>
                      <p className="text-gray-300 text-sm">
                        Your MT5 trading credentials are being set up by our team. You'll receive an email within 24 hours with your login details. Check back soon!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Trading Credentials */}
              {selectedAccount.credentials && (
                <div className="bg-white/10 border border-exodus-light-blue/30 rounded-lg p-6 mb-6">
                  <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-exodus-light-blue" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Trading Credentials
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Login</p>
                        <p className="text-white font-mono">{selectedAccount.credentials.login}</p>
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(selectedAccount.credentials!.login, "Login")
                        }
                        className="text-exodus-light-blue hover:text-blue-300 transition"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Password</p>
                        <p className="text-white font-mono">{selectedAccount.credentials.password}</p>
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(selectedAccount.credentials!.password, "Password")
                        }
                        className="text-exodus-light-blue hover:text-blue-300 transition"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Server</p>
                        <p className="text-white font-mono">{selectedAccount.credentials.server}</p>
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(selectedAccount.credentials!.server, "Server")
                        }
                        className="text-exodus-light-blue hover:text-blue-300 transition"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedAccount(null)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-semibold transition"
                >
                  Close
                </button>
                <a
                  href="/dashboard/payouts"
                  className="flex-1 bg-exodus-light-blue hover:bg-blue-400 text-white py-3 rounded-lg font-semibold transition text-center"
                >
                  Request Payout
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

