"use client";

import { useState } from "react";
import Image from "next/image";
import { signIn } from "@/lib/auth-helpers";
import { auth } from "@/lib/firebase";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, Loader2, AlertCircle } from "lucide-react";

export default function AdminAuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get('redirect') || '/admin';
  const errorParam = searchParams?.get('error');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(errorParam === 'admin_required' ? 'Admin privileges required' : '');
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setError(""); // Clear error on input change
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Sign in with Firebase
      await signIn(formData.email, formData.password);
      
      // Get the current user and their ID token
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Authentication failed');
      }

      const idToken = await user.getIdToken(true); // Force refresh to get latest claims

      // Create admin session
      const sessionResponse = await fetch('/api/auth/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      const sessionData = await sessionResponse.json();

      if (!sessionResponse.ok) {
        // Handle non-admin users
        if (sessionResponse.status === 403) {
          setError('Access denied. You do not have admin privileges.');
          setLoading(false);
          return;
        }
        throw new Error(sessionData.error || 'Failed to create session');
      }

      // Session created successfully, redirect to admin dashboard
      router.push(redirect);
    } catch (error: any) {
      console.error("Admin auth error:", error);
      
      // User-friendly error messages
      let errorMessage = "Authentication failed. Please try again.";
      
      if (error.message?.includes('invalid-credential') || 
          error.message?.includes('wrong-password') ||
          error.message?.includes('user-not-found')) {
        errorMessage = "Invalid email or password";
      } else if (error.message?.includes('too-many-requests')) {
        errorMessage = "Too many attempts. Please try again later.";
      } else if (error.message?.includes('admin privileges')) {
        errorMessage = "Access denied. Admin privileges required.";
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500/10 rounded-full mb-4 border-2 border-blue-500/30">
            <Shield className="text-blue-500" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-gray-400">Sign in to access the admin dashboard</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                <AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={20} />
                <div>
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 transition-all"
                placeholder="admin@exodusprop.com"
                autoComplete="email"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 transition-all"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/25"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <Shield size={20} />
                  <span>Sign In as Admin</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800/50 text-gray-400">or</span>
            </div>
          </div>

          {/* Regular User Link */}
          <div className="text-center">
            <p className="text-sm text-gray-400">
              Not an admin?{' '}
              <a href="/auth" className="text-blue-500 hover:text-blue-400 font-medium transition-colors">
                Sign in as user
              </a>
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
          <p className="text-xs text-gray-400 text-center">
            🔒 This is a secure admin portal. All actions are logged and monitored.
          </p>
        </div>
      </div>
    </div>
  );
}

