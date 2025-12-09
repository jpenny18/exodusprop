'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { getCachedMetrics, UserMetaApiAccount } from '@/lib/auth-helpers';
import { collection, query, where, getDocs } from 'firebase/firestore';
import DashboardLayout from '@/components/DashboardLayout';
import { userDashboardNavItems } from '@/lib/dashboard-nav';
import { Lock, Plus, AlertTriangle, TrendingUp, Loader2, ChevronRight, DollarSign, BarChart } from 'lucide-react';

interface AccountWithMetrics extends UserMetaApiAccount {
  cachedMetrics?: any;
}

export default function MyAccountsPage() {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<AccountWithMetrics[]>([]);

  useEffect(() => {
    const fetchAllAccounts = async () => {
      if (user) {
        try {
          // Query all accounts for this user
          const accountsRef = collection(db, 'userMetaApiAccounts');
          const q = query(accountsRef, where('userId', '==', user.uid));
          const snapshot = await getDocs(q);
          
          const accountsData: AccountWithMetrics[] = [];
          
          // Fetch each account with its cached metrics
          for (const doc of snapshot.docs) {
            const account = doc.data() as UserMetaApiAccount;
            
            // Try to get cached metrics for each account
            const metrics = await getCachedMetrics(account.accountId);
            
            accountsData.push({
              ...account,
              cachedMetrics: metrics
            });
          }
          
          // Sort accounts: active first, then by creation date
          accountsData.sort((a, b) => {
            if (a.status === 'active' && b.status !== 'active') return -1;
            if (a.status !== 'active' && b.status === 'active') return 1;
            const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return bDate - aDate;
          });
          
          setAccounts(accountsData);
        } catch (error) {
          console.error('Error fetching accounts:', error);
        }
      }
      setLoading(false);
    };

    fetchAllAccounts();
  }, [user]);

  const handleStartChallenge = () => {
    router.push('/purchase');
  };

  const handleViewAccount = (accountId: string) => {
    router.push(`/dashboard/accounts/${accountId}`);
  };
  
  // Determine status styling
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'passed':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border border-red-500/30';
      case 'funded':
        return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
      case 'inactive':
        return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-exodus-blue via-exodus-blue to-exodus-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-exodus-light-blue animate-spin" />
      </div>
    );
  }

  // If user has accounts, show them
  if (accounts.length > 0) {
    const activeAccounts = accounts.filter(acc => acc.status === 'active' || acc.status === 'inactive');
    const canAddMore = activeAccounts.length < 5;

    return (
      <DashboardLayout navItems={userDashboardNavItems} userEmail={user?.email || ''}>
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">My Trading Accounts</h1>
              <p className="text-gray-300">
                {activeAccounts.length} of 5 active challenge accounts
              </p>
            </div>
            
            {canAddMore && (
              <button 
                onClick={handleStartChallenge}
                className="bg-exodus-light-blue hover:bg-blue-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <Plus size={20} />
                Add Challenge
              </button>
            )}
          </div>

          {/* Account Limit Warning */}
          {!canAddMore && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-amber-500 mt-0.5" size={20} />
                <div>
                  <p className="text-amber-500 font-medium">Maximum Accounts Reached</p>
                  <p className="text-sm text-gray-300 mt-1">
                    You have reached the maximum of 5 active challenge accounts. Complete or close an existing challenge to add a new one.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Account Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((account) => {
              const metrics = account.cachedMetrics;
              const profit = metrics ? ((metrics.balance - account.accountSize) / account.accountSize) * 100 : 0;

              return (
                <div 
                  key={account.accountId}
                  onClick={() => handleViewAccount(account.accountId)}
                  className="bg-white/10 backdrop-blur-lg border-2 border-exodus-light-blue/30 rounded-xl p-6 cursor-pointer hover:border-exodus-light-blue/50 hover:shadow-lg hover:shadow-exodus-light-blue/20 transition-all"
                >
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(account.status)}`}>
                      {account.status.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-400">
                      {account.platform.toUpperCase()}
                    </span>
                  </div>

                  {/* Account Size & Type */}
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-white">
                      ${account.accountSize.toLocaleString()}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {account.accountType === '1-step' ? 'Exodus 1-Step' : 
                       account.accountType === 'gauntlet' ? 'Exodus Gauntlet' :
                       account.accountType === 'standard' ? 'Exodus Standard' : 'Exodus Instant'} • 
                      {account.step === 3 ? ' Funded' : 
                       (account.accountType === '1-step' || account.accountType === 'gauntlet') ? ' Challenge' : 
                       ` Step ${account.step}`}
                    </p>
                  </div>

                  {/* Metrics */}
                  {metrics && (
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Balance</span>
                        <span className="text-sm font-medium text-white">
                          ${metrics.balance?.toLocaleString() || account.accountSize.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Profit/Loss</span>
                        <div className="flex items-center gap-1">
                          {profit >= 0 ? (
                            <TrendingUp size={14} className="text-green-400" />
                          ) : (
                            <TrendingUp size={14} className="text-red-400 rotate-180" />
                          )}
                          <span className={`text-sm font-medium ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {profit >= 0 ? '+' : ''}{profit.toFixed(2)}%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Profit Target</span>
                        <span className="text-sm font-medium text-white">
                          {profit.toFixed(1)}% / 8%
                        </span>
                      </div>
                    </div>
                  )}

                  {/* View Details Button */}
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-exodus-light-blue/20 hover:bg-exodus-light-blue/30 text-white rounded-lg transition-colors text-sm font-medium border border-exodus-light-blue/30">
                    <span>View Details</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              );
            })}

            {/* Add New Challenge Card - Only show if less than 5 active */}
            {canAddMore && (
              <div 
                onClick={handleStartChallenge}
                className="bg-white/10 backdrop-blur-lg border-2 border-dashed border-exodus-light-blue/30 rounded-xl p-6 cursor-pointer hover:border-exodus-light-blue/50 hover:shadow-lg hover:shadow-exodus-light-blue/20 transition-all flex flex-col items-center justify-center min-h-[280px]"
              >
                <div className="w-12 h-12 rounded-full bg-exodus-light-blue/20 flex items-center justify-center mb-4">
                  <Plus className="text-exodus-light-blue" size={24} />
                </div>
                <h3 className="text-white font-medium mb-2">Start New Challenge</h3>
                <p className="text-xs text-gray-400 text-center">
                  Add up to {5 - activeAccounts.length} more challenge {5 - activeAccounts.length === 1 ? 'account' : 'accounts'}
                </p>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Otherwise show the locked/empty state
  return (
    <DashboardLayout navItems={userDashboardNavItems} userEmail={user?.email || ''}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">My Trading Accounts</h1>
          <p className="text-gray-300">Manage your trading accounts and track your performance</p>
        </div>

        {/* Empty State */}
        <div className="flex items-center justify-center py-12">
          <div className="bg-white/10 backdrop-blur-lg border-2 border-exodus-light-blue rounded-2xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-exodus-light-blue/20 flex items-center justify-center">
              <Lock className="text-exodus-light-blue" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Account Metrics Locked</h2>
            <p className="text-gray-300 mb-6">
              See your account metrics and performance analytics after purchasing a challenge. Start your journey to becoming a funded trader today.
            </p>
            <button 
              onClick={handleStartChallenge}
              className="bg-exodus-light-blue hover:bg-blue-400 text-white font-bold py-3 px-6 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              Start New Challenge
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-lg border-2 border-exodus-light-blue/30 rounded-xl p-4">
            <h3 className="text-white font-medium mb-1">6% Max Drawdown</h3>
            <p className="text-sm text-gray-300">
              Static maximum drawdown from starting balance
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg border-2 border-exodus-light-blue/30 rounded-xl p-4">
            <h3 className="text-white font-medium mb-1">8% Profit Target</h3>
            <p className="text-sm text-gray-300">
              Achieve 8% growth to pass the challenge
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg border-2 border-exodus-light-blue/30 rounded-xl p-4">
            <h3 className="text-white font-medium mb-1">No Minimum Days</h3>
            <p className="text-sm text-gray-300">
              Pass the challenge at your own pace
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
