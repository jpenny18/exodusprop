"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { userDashboardNavItems } from "@/lib/dashboard-nav";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function SupportPage() {
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email || "");
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <DashboardLayout navItems={userDashboardNavItems} userEmail={userEmail}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Support</h1>
          <p className="text-gray-300">We're here to help you succeed</p>
        </div>

        {/* Contact Card */}
        <div className="bg-white/10 backdrop-blur-lg border-2 border-exodus-light-blue rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-exodus-light-blue" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            Contact Us
          </h2>
          
          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-2">Email Support</h3>
              <a href="mailto:support@exodusprop.com" className="text-exodus-light-blue hover:underline text-lg font-mono">
                support@exodusprop.com
              </a>
              <p className="text-gray-400 text-sm mt-2">Response time: 24-48 hours</p>
            </div>

            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-2">Discord Community</h3>
              <a href="https://discord.gg/exodus" className="text-exodus-light-blue hover:underline text-lg">
                Join our Discord Server
              </a>
              <p className="text-gray-400 text-sm mt-2">Connect with other traders and get instant help</p>
            </div>

            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-2">Business Hours</h3>
              <p className="text-white">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
              <p className="text-gray-400 text-sm mt-2">Weekend inquiries will be answered on the next business day</p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white/10 backdrop-blur-lg border-2 border-exodus-light-blue rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="/dashboard/faq" className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition group">
              <svg className="w-6 h-6 text-exodus-light-blue" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="text-white font-semibold">FAQ</h4>
                <p className="text-gray-400 text-sm">Frequently asked questions</p>
              </div>
            </a>

            <a href="/program-rules" className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition group">
              <svg className="w-6 h-6 text-exodus-light-blue" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="text-white font-semibold">Program Rules</h4>
                <p className="text-gray-400 text-sm">Review trading rules</p>
              </div>
            </a>

            <a href="/dashboard/kyc" className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition group">
              <svg className="w-6 h-6 text-exodus-light-blue" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="text-white font-semibold">KYC Help</h4>
                <p className="text-gray-400 text-sm">Verification assistance</p>
              </div>
            </a>

            <a href="/dashboard/payouts" className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition group">
              <svg className="w-6 h-6 text-exodus-light-blue" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="text-white font-semibold">Payout Info</h4>
                <p className="text-gray-400 text-sm">Withdrawal help</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

