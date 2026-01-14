"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createUser, signIn } from "@/lib/auth-helpers";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    displayName: "",
    country: "",
    agreeTerms: false,
    agreePrivacy: false,
    isOver18: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setError(""); // Clear error on input change
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        // Login
        await signIn(formData.email, formData.password);
        router.push("/dashboard");
      } else {
        // Sign up - validate checkboxes
        if (!formData.agreeTerms || !formData.agreePrivacy || !formData.isOver18) {
          setError("Please accept all terms and confirm you are 18+");
          setLoading(false);
          return;
        }

        if (!formData.displayName || !formData.country) {
          setError("Please fill in all required fields");
          setLoading(false);
          return;
        }

        await createUser({
          email: formData.email,
          password: formData.password,
          displayName: formData.displayName,
          country: formData.country,
        });

        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      
      // User-friendly error messages
      let errorMessage = "Authentication failed. Please try again.";
      
      if (error.message?.includes("invalid-credential") || 
          error.message?.includes("wrong-password") ||
          error.message?.includes("user-not-found")) {
        errorMessage = "Wrong username or password";
      } else if (error.message?.includes("email-already-in-use")) {
        errorMessage = "Email already in use. Please login instead.";
      } else if (error.message?.includes("weak-password")) {
        errorMessage = "Password must be at least 6 characters";
      } else if (error.message?.includes("invalid-email")) {
        errorMessage = "Invalid email address";
      } else if (error.message?.includes("too-many-requests")) {
        errorMessage = "Too many attempts. Please try again later.";
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  const countries = [
    "United States", "United Kingdom", "Canada", "Australia", "Germany",
    "France", "Spain", "Italy", "Netherlands", "Brazil", "Mexico",
    "India", "China", "Japan", "South Korea", "Singapore", "UAE",
    "South Africa", "Nigeria", "Other"
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-exodus-blue via-exodus-blue to-exodus-dark relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-exodus-light-blue rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <nav className="relative z-10 border-b border-exodus-light-blue/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center h-24 md:h-32 relative">
            <Link href="/" className="flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Exodus Logo"
                width={200}
                height={200}
                priority
                className="h-40 md:h-60 w-auto"
              />
            </Link>
            <Link
              href="/"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-exodus-light-blue transition text-sm md:text-base"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Auth Container */}
      <div className="relative z-10 flex items-center justify-center px-4 py-8 md:py-16">
        <div className="w-full max-w-md">
          {/* Auth Card */}
          <div className="bg-white/10 backdrop-blur-lg border-2 border-exodus-light-blue rounded-2xl p-6 md:p-8 shadow-2xl">
            {/* Toggle Slider */}
            <div className="mb-8">
              <div className="bg-exodus-dark/50 rounded-xl p-1 flex relative">
                <div
                  className={`absolute top-1 bottom-1 w-1/2 bg-exodus-light-blue rounded-lg transition-transform duration-300 ease-in-out ${
                    isLogin ? "translate-x-0" : "translate-x-full"
                  }`}
                />
                <button
                  onClick={() => setIsLogin(true)}
                  className={`relative z-10 flex-1 py-3 rounded-lg font-semibold transition ${
                    isLogin ? "text-white" : "text-gray-400"
                  }`}
                >
                  LOG IN
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`relative z-10 flex-1 py-3 rounded-lg font-semibold transition ${
                    !isLogin ? "text-white" : "text-gray-400"
                  }`}
                >
                  SIGN UP
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              {/* Sign Up Fields */}
              {!isLogin && (
                <div className="space-y-4 md:space-y-5">
                  <div>
                    <label htmlFor="displayName" className="block text-white text-sm font-semibold mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      id="displayName"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      required={!isLogin}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-exodus-light-blue transition"
                      placeholder="Enter your display name"
                    />
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-white text-sm font-semibold mb-2">
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required={!isLogin}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-exodus-light-blue transition appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-exodus-dark">Select your country</option>
                      {countries.map((country) => (
                        <option key={country} value={country} className="bg-exodus-dark">
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-white text-sm font-semibold mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-exodus-light-blue transition"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-white text-sm font-semibold mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-exodus-light-blue transition"
                  placeholder={isLogin ? "Enter your password" : "Create a password"}
                />
              </div>

              {/* Sign Up Checkboxes */}
              {!isLogin && (
                <div className="space-y-3 pt-2">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="isOver18"
                      checked={formData.isOver18}
                      onChange={handleInputChange}
                      required={!isLogin}
                      className="mt-1 w-5 h-5 rounded border-2 border-white/20 bg-white/10 checked:bg-exodus-light-blue checked:border-exodus-light-blue focus:outline-none focus:ring-2 focus:ring-exodus-light-blue/50 transition cursor-pointer"
                    />
                    <span className="text-white text-sm leading-tight group-hover:text-exodus-light-blue transition">
                      I confirm that I am 18 years of age or older
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                      required={!isLogin}
                      className="mt-1 w-5 h-5 rounded border-2 border-white/20 bg-white/10 checked:bg-exodus-light-blue checked:border-exodus-light-blue focus:outline-none focus:ring-2 focus:ring-exodus-light-blue/50 transition cursor-pointer"
                    />
                    <span className="text-white text-sm leading-tight group-hover:text-exodus-light-blue transition">
                      I agree to the{" "}
                      <Link href="/terms" className="text-exodus-light-blue hover:underline">
                        Terms of Use
                      </Link>
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="agreePrivacy"
                      checked={formData.agreePrivacy}
                      onChange={handleInputChange}
                      required={!isLogin}
                      className="mt-1 w-5 h-5 rounded border-2 border-white/20 bg-white/10 checked:bg-exodus-light-blue checked:border-exodus-light-blue focus:outline-none focus:ring-2 focus:ring-exodus-light-blue/50 transition cursor-pointer"
                    />
                    <span className="text-white text-sm leading-tight group-hover:text-exodus-light-blue transition">
                      I agree to the{" "}
                      <Link href="/privacy" className="text-exodus-light-blue hover:underline">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                </div>
              )}

              {/* Forgot Password for Login */}
              {isLogin && (
                <div className="text-right">
                  <Link
                    href="/forgot-password"
                    className="text-exodus-light-blue hover:underline text-sm"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 md:py-4 rounded-lg font-bold text-base md:text-lg transition shadow-lg shadow-exodus-light-blue/30 mt-6 ${
                  loading 
                    ? "bg-gray-500 cursor-not-allowed text-gray-300" 
                    : "bg-exodus-light-blue hover:bg-blue-400 text-white"
                }`}
              >
                {loading ? "Processing..." : (isLogin ? "LOG IN" : "CREATE ACCOUNT")}
              </button>
            </form>
          </div>

          {/* Help Text */}
          <p className="text-center text-gray-400 text-sm mt-6">
            Need help?{" "}
            <Link href="/contact" className="text-exodus-light-blue hover:underline">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

