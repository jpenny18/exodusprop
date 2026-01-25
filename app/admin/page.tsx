"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { 
  getAllUsers, 
  getAllPurchases, 
  getAllAccounts, 
  getAllPayouts,
  getPendingKYC,
  getUser
} from "@/lib/auth-helpers";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    activeAccounts: 0,
    pendingKYC: 0,
    pendingPayouts: 0,
  });

  const [recentPurchases, setRecentPurchases] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if user is admin
        const userData = await getUser(user.uid);
        if (!userData?.isAdmin) {
          // Not admin, redirect to user dashboard
          router.push("/dashboard");
          return;
        }

        setCurrentUserEmail(user.email || "");
        
        // Fetch all admin data
        try {
          const [users, purchases, accounts, payouts, pendingKYC] = await Promise.all([
            getAllUsers(),
            getAllPurchases(),
            getAllAccounts(),
            getAllPayouts(),
            getPendingKYC(),
          ]);

          // Calculate stats
          const totalRevenue = purchases
            .filter(p => p.status === 'completed')
            .reduce((sum, p) => {
              const price = p.subscriptionPrice || p.accountPrice || 0;
              return sum + price;
            }, 0);
          
          const activeAccounts = accounts.filter(acc => acc.status === 'active').length;
          const pendingPayoutsCount = payouts.filter(p => p.status === 'pending').length;

          setStats({
            totalUsers: users.length,
            totalRevenue,
            activeAccounts,
            pendingKYC: pendingKYC.length,
            pendingPayouts: pendingPayoutsCount,
          });

          // Get 5 most recent purchases
          const sortedPurchases = purchases
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 5)
            .map(p => ({
              id: p.id,
              user: p.email,
              account: p.subscriptionTier 
                ? `${p.subscriptionTier} (${p.accountsCount || 0} accounts)` 
                : (p.accountSize || 'N/A').replace('$', '').replace(',000', 'K'),
              platform: p.platform || 'N/A',
              amount: p.subscriptionPrice || p.accountPrice || 0,
              date: p.timestamp,
            }));

          setRecentPurchases(sortedPurchases);
        } catch (error) {
          console.error("Error fetching admin data:", error);
        }

        setLoading(false);
      } else {
        router.push("/auth");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const adminNavItems = [
    {
      name: "Admin Dashboard",
      href: "/admin",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </svg>
      ),
    },
    {
      name: "Crypto Orders",
      href: "/admin/crypto-orders",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: "Card Orders",
      href: "/admin/card-orders",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: "Accounts",
      href: "/admin/accounts",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
          <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: "Emails",
      href: "/admin/emails",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
      ),
    },
    {
      name: "KYC Reviews",
      href: "/admin/kyc",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: "Payouts",
      href: "/admin/payouts",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      ),
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-exodus-blue via-exodus-blue to-exodus-dark flex items-center justify-center">
        <div className="text-white text-xl">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <DashboardLayout navItems={adminNavItems} userEmail={currentUserEmail} isAdmin={true}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-300">Manage your prop firm operations</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
          <div className="bg-white/10 backdrop-blur-lg border-2 border-exodus-light-blue/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm font-semibold">Total Users</h3>
              <svg className="w-8 h-8 text-exodus-light-blue" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border-2 border-green-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm font-semibold">Total Revenue</h3>
              <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-white">${stats.totalRevenue.toLocaleString()}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border-2 border-blue-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm font-semibold">Active Accounts</h3>
              <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-white">{stats.activeAccounts}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border-2 border-yellow-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm font-semibold">Pending KYC</h3>
              <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-white">{stats.pendingKYC}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border-2 border-purple-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm font-semibold">Pending Payouts</h3>
              <svg className="w-8 h-8 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-white">{stats.pendingPayouts}</p>
          </div>
        </div>

        {/* Recent Purchases */}
        <div className="bg-white/10 backdrop-blur-lg border-2 border-exodus-light-blue rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Purchases</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left text-gray-300 font-semibold py-3 px-2">Date</th>
                  <th className="text-left text-gray-300 font-semibold py-3 px-2">User</th>
                  <th className="text-left text-gray-300 font-semibold py-3 px-2">Account</th>
                  <th className="text-left text-gray-300 font-semibold py-3 px-2">Platform</th>
                  <th className="text-left text-gray-300 font-semibold py-3 px-2">Amount</th>
                  <th className="text-left text-gray-300 font-semibold py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentPurchases.map((purchase) => (
                  <tr key={purchase.id} className="border-b border-white/10">
                    <td className="text-white py-4 px-2">{new Date(purchase.date).toLocaleDateString()}</td>
                    <td className="text-white py-4 px-2">{purchase.user}</td>
                    <td className="text-white font-semibold py-4 px-2">{purchase.account}</td>
                    <td className="text-white py-4 px-2">
                      <span className="px-2 py-1 bg-exodus-light-blue/20 border border-exodus-light-blue/30 rounded text-xs font-semibold">
                        {purchase.platform}
                      </span>
                    </td>
                    <td className="text-green-400 font-semibold py-4 px-2">${purchase.amount}</td>
                    <td className="py-4 px-2">
                      <button className="text-exodus-light-blue hover:text-blue-300 transition">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            href="/admin/kyc"
            className="bg-white/10 backdrop-blur-lg border-2 border-exodus-light-blue rounded-xl p-6 hover:border-exodus-light-blue/60 transition"
          >
            <h3 className="text-xl font-bold text-white mb-2">Review KYC</h3>
            <p className="text-gray-300 text-sm mb-4">{stats.pendingKYC} pending verifications</p>
            <span className="text-exodus-light-blue font-semibold">Review Now →</span>
          </a>

          <a
            href="/admin/payouts"
            className="bg-white/10 backdrop-blur-lg border-2 border-exodus-light-blue rounded-xl p-6 hover:border-exodus-light-blue/60 transition"
          >
            <h3 className="text-xl font-bold text-white mb-2">Process Payouts</h3>
            <p className="text-gray-300 text-sm mb-4">{stats.pendingPayouts} pending requests</p>
            <span className="text-exodus-light-blue font-semibold">View All →</span>
          </a>

          <a
            href="/admin/users"
            className="bg-white/10 backdrop-blur-lg border-2 border-exodus-light-blue rounded-xl p-6 hover:border-exodus-light-blue/60 transition"
          >
            <h3 className="text-xl font-bold text-white mb-2">Manage Users</h3>
            <p className="text-gray-300 text-sm mb-4">{stats.totalUsers} total users</p>
            <span className="text-exodus-light-blue font-semibold">View All →</span>
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
}

