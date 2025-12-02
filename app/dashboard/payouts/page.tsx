"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { userDashboardNavItems } from "@/lib/dashboard-nav";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function PayoutsPage() {
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email || "");
      }
    });
    return () => unsubscribe();
  }, []);
  const [payoutHistory, setPayoutHistory] = useState([
    { id: "1", amount: 2450, status: "pending", date: "2025-01-28", wallet: "TXn...abc123" },
    { id: "2", amount: 1800, status: "completed", date: "2025-01-15", wallet: "TXn...xyz789" },
  ]);

  const [newPayout, setNewPayout] = useState({
    accountId: "",
    amount: "",
    walletAddress: "",
  });


  const handleSubmitPayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayout.accountId || !newPayout.amount || !newPayout.walletAddress) {
      alert("Please fill all fields");
      return;
    }
    // TODO: Submit to Firebase
    console.log("Payout requested:", newPayout);
    alert("Payout request submitted successfully! Processing time: 1-3 business days.");
    setNewPayout({ accountId: "", amount: "", walletAddress: "" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }
  };

  return (
    <DashboardLayout navItems={userDashboardNavItems} userEmail={userEmail}>
      <div className="max-w-6xl mx-auto space-y-8 relative">
        {/* Blurred Content */}
        <div className="blur-sm pointer-events-none select-none">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Payouts</h1>
            <p className="text-gray-300">Request and track your profit withdrawals</p>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Request Payout Form */}
          <div className="bg-white/10 backdrop-blur-lg border-2 border-exodus-light-blue rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Request Payout</h2>
            
            <form onSubmit={handleSubmitPayout} className="space-y-4">
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Select Account *</label>
                <select
                  value={newPayout.accountId}
                  onChange={(e) => setNewPayout(prev => ({ ...prev, accountId: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-exodus-light-blue transition"
                  required
                >
                  <option value="" className="bg-exodus-dark">Select an account</option>
                  <option value="1" className="bg-exodus-dark">$100,000 - Active (Profit: $2,450)</option>
                  <option value="2" className="bg-exodus-dark">$50,000 - Active (Profit: $800)</option>
                </select>
              </div>

              <div>
                <label className="block text-white text-sm font-semibold mb-2">Payout Amount (USD) *</label>
                <input
                  type="number"
                  value={newPayout.amount}
                  onChange={(e) => setNewPayout(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-exodus-light-blue transition"
                  placeholder="Enter amount"
                  required
                />
                <p className="text-gray-400 text-xs mt-2">Minimum payout: $100</p>
              </div>

              <div>
                <label className="block text-white text-sm font-semibold mb-2">USDT (Tron) Wallet Address *</label>
                <input
                  type="text"
                  value={newPayout.walletAddress}
                  onChange={(e) => setNewPayout(prev => ({ ...prev, walletAddress: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-exodus-light-blue transition font-mono text-sm"
                  placeholder="TXnXxXxXxXxXxXxXxXxXxXx..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-exodus-light-blue hover:bg-blue-400 text-white py-3 rounded-lg font-bold transition shadow-lg shadow-exodus-light-blue/30"
              >
                Submit Payout Request
              </button>
            </form>

            <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-300 text-sm">
                <strong>Note:</strong> Payouts are processed within 1-3 business days. Ensure your KYC is approved before requesting a payout.
              </p>
            </div>
          </div>

          {/* Payout Information */}
          <div className="bg-white/10 backdrop-blur-lg border-2 border-exodus-light-blue rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Payout Information</h2>
            
            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-exodus-light-blue font-semibold mb-2">Processing Time</h4>
                <p className="text-gray-300 text-sm">1-3 business days</p>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-exodus-light-blue font-semibold mb-2">Payment Method</h4>
                <p className="text-gray-300 text-sm">USDT (Tron Network) only</p>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-exodus-light-blue font-semibold mb-2">Minimum Payout</h4>
                <p className="text-gray-300 text-sm">$100 USD</p>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-exodus-light-blue font-semibold mb-2">Payout Schedule</h4>
                <p className="text-gray-300 text-sm">On-demand, request anytime</p>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-exodus-light-blue font-semibold mb-2">Fees</h4>
                <p className="text-gray-300 text-sm">Network fees covered by Exodus</p>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-exodus-light-blue font-semibold mb-2">Requirements</h4>
                <p className="text-gray-300 text-sm">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Approved KYC verification</li>
                    <li>Signed trader agreement</li>
                    <li>Active trading account</li>
                  </ul>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payout History */}
        <div className="bg-white/10 backdrop-blur-lg border-2 border-exodus-light-blue rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Payout History</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left text-gray-300 font-semibold py-3 px-2">Date</th>
                  <th className="text-left text-gray-300 font-semibold py-3 px-2">Amount</th>
                  <th className="text-left text-gray-300 font-semibold py-3 px-2">Wallet</th>
                  <th className="text-left text-gray-300 font-semibold py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {payoutHistory.map((payout) => (
                  <tr key={payout.id} className="border-b border-white/10">
                    <td className="text-white py-4 px-2">{new Date(payout.date).toLocaleDateString()}</td>
                    <td className="text-white font-semibold py-4 px-2">${payout.amount.toLocaleString()}</td>
                    <td className="text-gray-300 font-mono text-sm py-4 px-2">{payout.wallet}</td>
                    <td className="py-4 px-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${getStatusColor(payout.status)}`}>
                        {payout.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </div>

        {/* Locked Modal Overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-50 px-4">
          <div className="bg-exodus-dark/95 backdrop-blur-xl border-2 border-yellow-500/50 rounded-2xl p-8 md:p-12 max-w-lg w-full shadow-2xl">
            <div className="text-center">
              {/* Lock Icon */}
              <div className="w-20 h-20 bg-yellow-500/20 border-2 border-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>

              {/* Title */}
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                🔒 Payouts Locked
              </h2>

              {/* Message */}
              <p className="text-gray-300 text-base md:text-lg mb-6 leading-relaxed">
                This page will automatically unlock when you are a <span className="text-exodus-light-blue font-semibold">funded trader</span> with <span className="text-green-400 font-semibold">positive P&L</span>.
              </p>

              {/* Requirements */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-left mb-6">
                <h3 className="text-white font-semibold mb-3">Requirements to Unlock:</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-0.5">•</span>
                    <span>Pass your evaluation challenge</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-0.5">•</span>
                    <span>Become a funded trader</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-0.5">•</span>
                    <span>Achieve positive profit & loss</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-0.5">•</span>
                    <span>Complete KYC verification</span>
                  </li>
                </ul>
              </div>

              {/* CTA */}
              <p className="text-gray-400 text-sm">
                Keep trading and hit your profit target to unlock payouts! 🚀
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

