"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { userDashboardNavItems } from "@/lib/dashboard-nav";
import { auth } from "@/lib/firebase";
import { submitWithdrawalDetails, getWithdrawalRequest, getUserMetaApiAccount, getKYCSubmission, WithdrawalRequest } from "@/lib/auth-helpers";
import { onAuthStateChanged } from "firebase/auth";
import { 
  Wallet, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Bitcoin, 
  Building, 
  CreditCard,
  Loader2,
  Shield
} from 'lucide-react';

const statusColors = {
  completed: 'bg-green-500/20 text-green-400 border-green-500/30',
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  failed: 'bg-red-500/20 text-red-400 border-red-500/30',
  rejected: 'bg-red-500/20 text-red-400 border-red-500/30'
};

const statusIcons = {
  completed: CheckCircle,
  pending: Clock,
  failed: XCircle,
  rejected: XCircle
};

const methodIcons: { [key: string]: React.ElementType } = {
  'bank_transfer': Building,
  'crypto': Bitcoin,
  'card': CreditCard
};

export default function PayoutsPage() {
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [withdrawalHistory, setWithdrawalHistory] = useState<WithdrawalRequest[]>([]);
  const [kycApproved, setKycApproved] = useState(false);
  const [accountBalance, setAccountBalance] = useState(0);
  const [accountSize, setAccountSize] = useState(0);

  const [newPayout, setNewPayout] = useState({
    accountId: "",
    amount: "",
    method: "crypto" as "crypto" | "bank_transfer" | "card",
    cryptoType: "usdc_solana" as "usdc_solana" | "usdt_trc20",
    walletAddress: "",
    bankDetails: {
      accountNumber: "",
      routingNumber: "",
      accountName: "",
      bankName: ""
    }
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserEmail(user.email || "");
        setUserId(user.uid);

        // Check KYC status
        try {
          const kycSubmission = await getKYCSubmission(user.uid);
          setKycApproved(kycSubmission?.status === 'approved');
        } catch (error) {
          console.error('Error checking KYC:', error);
        }

        // Load withdrawal history
        try {
          const request = await getWithdrawalRequest(user.uid);
          setWithdrawalHistory(request ? [request] : []);
        } catch (error) {
          console.error('Error loading withdrawals:', error);
        }

        // Load user account balance
        try {
          const account = await getUserMetaApiAccount(user.uid);
          if (account) {
            setNewPayout(prev => ({ ...prev, accountId: account.accountId }));
            // Note: In production, fetch actual balance from MetaAPI
            setAccountBalance(account.accountSize); // Placeholder
            setAccountSize(account.accountSize);
          }
        } catch (error) {
          console.error('Error loading account:', error);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmitPayout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!kycApproved) {
      alert("Please complete KYC verification before requesting payouts.");
      return;
    }

    const amount = parseFloat(newPayout.amount);
    if (!newPayout.amount || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (newPayout.method === 'crypto' && !newPayout.walletAddress) {
      alert("Please enter your crypto wallet address");
      return;
    }

    if (newPayout.method === 'bank_transfer' && (!newPayout.bankDetails.accountNumber || !newPayout.bankDetails.routingNumber)) {
      alert("Please fill in all bank details");
      return;
    }

    try {
      setSubmitting(true);
      
      // Currently only crypto withdrawals are supported
      if (newPayout.method !== 'crypto') {
        alert("Only crypto withdrawals are currently supported. Please select crypto method.");
        setSubmitting(false);
        return;
      }

      await submitWithdrawalDetails(userId, newPayout.cryptoType, newPayout.walletAddress);

      alert("Payout request submitted successfully! Processing time: 1-3 business days.");
      
      // Reset form
      setNewPayout({
        ...newPayout,
        amount: "",
        cryptoType: "usdc_solana",
        walletAddress: "",
        bankDetails: {
          accountNumber: "",
          routingNumber: "",
          accountName: "",
          bankName: ""
        }
      });

      // Reload withdrawal history
      const request = await getWithdrawalRequest(userId);
      setWithdrawalHistory(request ? [request] : []);
    } catch (error) {
      console.error('Error submitting payout:', error);
      alert("Failed to submit payout request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-exodus-blue via-exodus-blue to-exodus-dark">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  return (
    <DashboardLayout navItems={userDashboardNavItems} userEmail={userEmail}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Wallet className="text-blue-500" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Payouts</h1>
              <p className="text-sm text-gray-400">Manage your trading account payouts</p>
            </div>
          </div>
        </div>

        {/* KYC Warning */}
        {!kycApproved && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-3">
            <Shield className="text-yellow-500 mt-0.5" size={20} />
          <div>
              <h3 className="text-yellow-500 font-medium">KYC Verification Required</h3>
              <p className="text-sm text-gray-400 mt-1">
                You must complete KYC verification before requesting payouts. 
                <a href="/dashboard/kyc" className="text-blue-500 hover:text-blue-400 underline ml-1">
                  Complete KYC now →
                </a>
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payout Request Form */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <DollarSign size={20} className="text-blue-500" />
              Request Payout
            </h2>

            {/* Available Balance */}
            <div className="mb-6 p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Available Balance</p>
              <p className="text-2xl font-bold text-white">${accountBalance.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Account Size: ${accountSize.toLocaleString()}</p>
            </div>
            
            <form onSubmit={handleSubmitPayout} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Payout Amount <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                  required
                    value={newPayout.amount}
                    onChange={(e) => setNewPayout({ ...newPayout, amount: e.target.value })}
                    disabled={!kycApproved}
                    className="w-full pl-8 pr-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 disabled:opacity-50"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Payment Method <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewPayout({ ...newPayout, method: 'crypto' })}
                    disabled={!kycApproved}
                    className={`p-3 rounded-lg border transition-all disabled:opacity-50 ${
                      newPayout.method === 'crypto'
                        ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                        : 'bg-gray-900/50 border-gray-700/50 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <Bitcoin size={20} className="mx-auto mb-1" />
                    <span className="text-xs">Crypto</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewPayout({ ...newPayout, method: 'bank_transfer' })}
                    disabled={!kycApproved}
                    className={`p-3 rounded-lg border transition-all disabled:opacity-50 ${
                      newPayout.method === 'bank_transfer'
                        ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                        : 'bg-gray-900/50 border-gray-700/50 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <Building size={20} className="mx-auto mb-1" />
                    <span className="text-xs">Bank</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewPayout({ ...newPayout, method: 'card' })}
                    disabled={!kycApproved}
                    className={`p-3 rounded-lg border transition-all disabled:opacity-50 ${
                      newPayout.method === 'card'
                        ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                        : 'bg-gray-900/50 border-gray-700/50 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <CreditCard size={20} className="mx-auto mb-1" />
                    <span className="text-xs">Card</span>
                  </button>
                </div>
              </div>

              {newPayout.method === 'crypto' && (
              <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Crypto Wallet Address <span className="text-red-400">*</span>
                  </label>
                <input
                  type="text"
                    required
                  value={newPayout.walletAddress}
                    onChange={(e) => setNewPayout({ ...newPayout, walletAddress: e.target.value })}
                    disabled={!kycApproved}
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 disabled:opacity-50 font-mono text-sm"
                    placeholder="bc1q..."
                  />
                  <p className="text-xs text-gray-500 mt-1">BTC address only</p>
                </div>
              )}

              {newPayout.method === 'bank_transfer' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Account Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newPayout.bankDetails.accountNumber}
                      onChange={(e) => setNewPayout({ 
                        ...newPayout, 
                        bankDetails: { ...newPayout.bankDetails, accountNumber: e.target.value }
                      })}
                      disabled={!kycApproved}
                      className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 disabled:opacity-50"
                      placeholder="1234567890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Routing Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newPayout.bankDetails.routingNumber}
                      onChange={(e) => setNewPayout({ 
                        ...newPayout, 
                        bankDetails: { ...newPayout.bankDetails, routingNumber: e.target.value }
                      })}
                      disabled={!kycApproved}
                      className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 disabled:opacity-50"
                      placeholder="021000021"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Account Holder Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                  required
                      value={newPayout.bankDetails.accountName}
                      onChange={(e) => setNewPayout({ 
                        ...newPayout, 
                        bankDetails: { ...newPayout.bankDetails, accountName: e.target.value }
                      })}
                      disabled={!kycApproved}
                      className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 disabled:opacity-50"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={newPayout.bankDetails.bankName}
                      onChange={(e) => setNewPayout({ 
                        ...newPayout, 
                        bankDetails: { ...newPayout.bankDetails, bankName: e.target.value }
                      })}
                      disabled={!kycApproved}
                      className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 disabled:opacity-50"
                      placeholder="Chase Bank"
                />
              </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || !kycApproved}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  submitting || !kycApproved
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {submitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <DollarSign size={20} />
                    <span>Request Payout</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Payout History */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Payout History</h2>
            
            {withdrawalHistory.length === 0 ? (
              <div className="text-center py-12">
                <Wallet className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No payout requests yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {withdrawalHistory.map((withdrawal) => {
                  const StatusIcon = statusIcons[withdrawal.status];
                  const MethodIcon = methodIcons[withdrawal.method] || Bitcoin;

                  return (
                    <div key={withdrawal.requestId} className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <StatusIcon size={16} className={
                            withdrawal.status === 'completed' ? 'text-green-400' :
                            withdrawal.status === 'pending' ? 'text-yellow-400' :
                            'text-red-400'
                          } />
                          <span className="text-sm font-medium text-white capitalize">{withdrawal.status}</span>
                        </div>
                        <span className="text-sm font-bold text-white">${withdrawal.amount.toLocaleString()}</span>
              </div>

                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <MethodIcon size={12} />
                          <span className="capitalize">{withdrawal.method.replace('_', ' ')}</span>
                        </div>
                        <span>{new Date(withdrawal.createdAt.toMillis()).toLocaleDateString()}</span>
              </div>

                      {withdrawal.adminNotes && (
                        <div className="mt-2 p-2 bg-blue-500/5 border border-blue-500/20 rounded text-xs text-gray-400">
                          <strong className="text-blue-400">Note:</strong> {withdrawal.adminNotes}
              </div>
                      )}
              </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
            <h3 className="text-blue-400 font-medium mb-2 text-sm">Processing Time</h3>
            <p className="text-xs text-gray-400">
              Payouts are typically processed within 1-3 business days after approval.
            </p>
          </div>
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
            <h3 className="text-blue-400 font-medium mb-2 text-sm">Minimum Payout</h3>
            <p className="text-xs text-gray-400">
              Minimum payout amount is $100 for all methods.
              </p>
            </div>
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
            <h3 className="text-blue-400 font-medium mb-2 text-sm">KYC Required</h3>
            <p className="text-xs text-gray-400">
              All payout requests require approved KYC verification for compliance.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
