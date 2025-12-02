"use client";

import { useState } from "react";
import { updateUserPassword } from "@/lib/auth-helpers";

interface PasswordChangeModalProps {
  onComplete: () => void;
}

export default function PasswordChangeModal({ onComplete }: PasswordChangeModalProps) {
  const [step, setStep] = useState(1);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return "Password must contain at least one special character (!@#$%^&*)";
    }
    return null;
  };

  const handleContinue = () => {
    if (step === 1) {
      setStep(2);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate new password
    const validationError = validatePassword(newPassword);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await updateUserPassword(newPassword);
      onComplete();
    } catch (err: any) {
      console.error("Error updating password:", err);
      setError(err.message || "Failed to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-exodus-dark border-2 border-exodus-light-blue rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-yellow-500/20 border-2 border-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {step === 1 ? "Welcome to Exodus!" : "Set Your Password"}
          </h2>
          <p className="text-gray-300 text-sm">
            {step === 1 
              ? "For security, you need to set a new password before accessing your dashboard."
              : "Create a strong password to secure your account."
            }
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
            step >= 1 ? "bg-exodus-light-blue border-exodus-light-blue text-white" : "border-white/20 text-gray-400"
          }`}>
            1
          </div>
          <div className={`h-1 w-12 rounded ${step >= 2 ? "bg-exodus-light-blue" : "bg-white/20"}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
            step >= 2 ? "bg-exodus-light-blue border-exodus-light-blue text-white" : "border-white/20 text-gray-400"
          }`}>
            2
          </div>
        </div>

        {/* Step 1: Information */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3">🔐 Password Requirements:</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-exodus-light-blue mt-0.5">✓</span>
                  <span>At least 8 characters long</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-exodus-light-blue mt-0.5">✓</span>
                  <span>One uppercase letter (A-Z)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-exodus-light-blue mt-0.5">✓</span>
                  <span>One lowercase letter (a-z)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-exodus-light-blue mt-0.5">✓</span>
                  <span>One number (0-9)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-exodus-light-blue mt-0.5">✓</span>
                  <span>One special character (!@#$%^&*)</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleContinue}
              className="w-full bg-exodus-light-blue hover:bg-blue-400 text-white py-3 md:py-4 rounded-lg font-bold text-base md:text-lg transition shadow-lg shadow-exodus-light-blue/30"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Password Input */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                New Password *
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-exodus-light-blue transition"
                placeholder="Enter your new password"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-exodus-light-blue transition"
                placeholder="Confirm your new password"
                required
                disabled={loading}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 md:py-4 rounded-lg font-bold transition"
                disabled={loading}
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 bg-exodus-light-blue hover:bg-blue-400 text-white py-3 md:py-4 rounded-lg font-bold transition shadow-lg shadow-exodus-light-blue/30 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Updating..." : "Set Password"}
              </button>
            </div>
          </form>
        )}

        {/* Notice */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-gray-400 text-xs text-center">
            🔒 Your account security is important to us. This password will be used for all future logins.
          </p>
        </div>
      </div>
    </div>
  );
}

