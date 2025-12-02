"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { userDashboardNavItems } from "@/lib/dashboard-nav";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function SettingsPage() {
  const [userEmail, setUserEmail] = useState("");
  const [settings, setSettings] = useState({
    displayName: "John Trader",
    email: "trader@exodus.com",
    country: "United States",
    walletAddress: "TXnXxXxXxXxXxXxXxXxXxXx...",
    emailNotifications: true,
    tradeAlerts: true,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email || "");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save to Firebase
    console.log("Settings saved:", settings);
    alert("Settings saved successfully!");
  };

  return (
    <DashboardLayout navItems={userDashboardNavItems} userEmail={userEmail}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Account Settings</h1>
          <p className="text-gray-300">Manage your profile and preferences</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Profile Information */}
          <div className="bg-white/10 backdrop-blur-lg border-2 border-exodus-light-blue rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Display Name</label>
                <input
                  type="text"
                  value={settings.displayName}
                  onChange={(e) => setSettings(prev => ({ ...prev, displayName: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-exodus-light-blue transition"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-semibold mb-2">Email</label>
                <input
                  type="email"
                  value={settings.email}
                  disabled
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-gray-400 cursor-not-allowed"
                />
                <p className="text-gray-400 text-xs mt-2">Email cannot be changed. Contact support for assistance.</p>
              </div>

              <div>
                <label className="block text-white text-sm font-semibold mb-2">Country</label>
                <input
                  type="text"
                  value={settings.country}
                  onChange={(e) => setSettings(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-exodus-light-blue transition"
                />
              </div>
            </div>
          </div>

          {/* Payout Settings */}
          <div className="bg-white/10 backdrop-blur-lg border-2 border-exodus-light-blue rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Payout Settings</h2>
            
            <div>
              <label className="block text-white text-sm font-semibold mb-2">Default Wallet Address (USDT Tron)</label>
              <input
                type="text"
                value={settings.walletAddress}
                onChange={(e) => setSettings(prev => ({ ...prev, walletAddress: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-exodus-light-blue transition font-mono text-sm"
                placeholder="TXnXxXxXxXxXxXxXxXxXxXx..."
              />
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white/10 backdrop-blur-lg border-2 border-exodus-light-blue rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Notification Preferences</h2>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                  className="w-5 h-5 rounded border-2 border-white/20 bg-white/10 checked:bg-exodus-light-blue checked:border-exodus-light-blue transition"
                />
                <div>
                  <span className="text-white font-semibold block">Email Notifications</span>
                  <span className="text-gray-400 text-sm">Receive updates about your accounts and payouts</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={settings.tradeAlerts}
                  onChange={(e) => setSettings(prev => ({ ...prev, tradeAlerts: e.target.checked }))}
                  className="w-5 h-5 rounded border-2 border-white/20 bg-white/10 checked:bg-exodus-light-blue checked:border-exodus-light-blue transition"
                />
                <div>
                  <span className="text-white font-semibold block">Trade Alerts</span>
                  <span className="text-gray-400 text-sm">Get notified about important account events</span>
                </div>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-exodus-light-blue hover:bg-blue-400 text-white py-3 rounded-lg font-bold transition shadow-lg shadow-exodus-light-blue/30"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-bold transition"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Danger Zone */}
        <div className="bg-red-500/10 backdrop-blur-lg border-2 border-red-500/30 rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Danger Zone</h2>
          <p className="text-gray-300 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
          <button className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-6 py-3 rounded-lg font-semibold transition border border-red-500/30">
            Delete Account
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

