"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getUserAccounts, getUser } from "@/lib/auth-helpers";
import PasswordChangeModal from "@/components/PasswordChangeModal";
import { userDashboardNavItems } from "@/lib/dashboard-nav";

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [requiresPasswordChange, setRequiresPasswordChange] = useState(false);
  const [totalAccounts, setTotalAccounts] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserEmail(user.email || "");
        
        // Check if user requires password change
        const userData = await getUser(user.uid);
        if (userData?.requiresPasswordChange) {
          setRequiresPasswordChange(true);
        }
        
        // Fetch user data
        try {
          const accounts = await getUserAccounts(user.uid);
          setTotalAccounts(accounts.length);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
        
        setLoading(false);
      } else {
        router.push("/auth");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handlePasswordChangeComplete = () => {
    setRequiresPasswordChange(false);
  };


  // If password change required, show only the modal (no dashboard layout)
  if (requiresPasswordChange) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-exodus-blue via-exodus-blue to-exodus-dark">
        <PasswordChangeModal onComplete={handlePasswordChangeComplete} />
      </div>
    );
  }

  return (
    <DashboardLayout navItems={userDashboardNavItems} userEmail={userEmail}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Welcome to Your Dashboard
          </h1>
          <p className="text-gray-300">Manage your trading accounts and track your performance</p>
        </div>

        {/* Stats Grid */}
        <div className="max-w-sm">
          <div className="bg-white/10 backdrop-blur-lg border-2 border-exodus-light-blue/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm font-semibold">Total Accounts</h3>
              <svg className="w-8 h-8 text-exodus-light-blue" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-white">{totalAccounts}</p>
          </div>
        </div>

        {/* Purchase New Account */}
        <div className="max-w-2xl">
          <div className="bg-white/10 backdrop-blur-lg border-2 border-exodus-light-blue rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-exodus-light-blue" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Purchase New Account
            </h2>
            <p className="text-gray-300 mb-6">
              Ready to scale up? Purchase a new evaluation account and start trading immediately.
            </p>
            <Link
              href="/purchase"
              className="inline-block bg-exodus-light-blue hover:bg-blue-400 text-white px-6 py-3 rounded-lg font-bold transition shadow-lg shadow-exodus-light-blue/30"
            >
              Browse Accounts
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

