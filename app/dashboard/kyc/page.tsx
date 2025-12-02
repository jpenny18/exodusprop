"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { userDashboardNavItems } from "@/lib/dashboard-nav";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function KYCPage() {
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email || "");
      }
    });
    return () => unsubscribe();
  }, []);
  const [kycStatus, setKycStatus] = useState<"pending" | "submitted" | "approved" | "rejected">("pending");
  const [files, setFiles] = useState<{
    idFront: File | null;
    idBack: File | null;
    proofOfAddress: File | null;
    tradingAgreement: boolean;
  }>({
    idFront: null,
    idBack: null,
    proofOfAddress: null,
    tradingAgreement: false,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "idFront" | "idBack" | "proofOfAddress") => {
    if (e.target.files && e.target.files[0]) {
      setFiles((prev) => ({ ...prev, [type]: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!files.idFront || !files.idBack || !files.proofOfAddress || !files.tradingAgreement) {
      alert("Please upload all required documents and sign the agreement");
      return;
    }
    // TODO: Upload to Firebase Storage
    console.log("KYC submitted:", files);
    setKycStatus("submitted");
    alert("KYC documents submitted successfully! We'll review them within 24-48 hours.");
  };

  return (
    <DashboardLayout navItems={userDashboardNavItems} userEmail={userEmail}>
      <div className="max-w-4xl mx-auto space-y-8 relative">
        {/* Blurred Content */}
        <div className="blur-sm pointer-events-none select-none">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">KYC Verification</h1>
            <p className="text-gray-300">Complete your verification to withdraw funds</p>
          </div>

        {/* Status Card */}
        <div className={`bg-white/10 backdrop-blur-lg border-2 rounded-2xl p-6 ${
          kycStatus === "approved" ? "border-green-500/50" :
          kycStatus === "rejected" ? "border-red-500/50" :
          kycStatus === "submitted" ? "border-yellow-500/50" :
          "border-exodus-light-blue/50"
        }`}>
          <div className="flex items-center gap-4">
            {kycStatus === "approved" && (
              <>
                <svg className="w-12 h-12 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-xl font-bold text-white">KYC Approved</h3>
                  <p className="text-gray-300">Your account is fully verified</p>
                </div>
              </>
            )}
            {kycStatus === "rejected" && (
              <>
                <svg className="w-12 h-12 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-xl font-bold text-white">KYC Rejected</h3>
                  <p className="text-gray-300">Please resubmit your documents</p>
                </div>
              </>
            )}
            {kycStatus === "submitted" && (
              <>
                <svg className="w-12 h-12 text-yellow-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <div>
                  <h3 className="text-xl font-bold text-white">KYC Under Review</h3>
                  <p className="text-gray-300">We're reviewing your documents (24-48 hours)</p>
                </div>
              </>
            )}
            {kycStatus === "pending" && (
              <>
                <svg className="w-12 h-12 text-exodus-light-blue" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-xl font-bold text-white">KYC Required</h3>
                  <p className="text-gray-300">Upload your documents to get verified</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Upload Form */}
        {(kycStatus === "pending" || kycStatus === "rejected") && (
          <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg border-2 border-exodus-light-blue rounded-2xl p-6 md:p-8 space-y-6">
            <div>
              <label className="block text-white font-semibold mb-3">
                ID Front (Passport/Driver's License) *
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileChange(e, "idFront")}
                className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-exodus-light-blue file:text-white file:font-semibold file:cursor-pointer hover:file:bg-blue-400"
              />
              {files.idFront && (
                <p className="text-green-400 text-sm mt-2">✓ {files.idFront.name}</p>
              )}
            </div>

            <div>
              <label className="block text-white font-semibold mb-3">
                ID Back *
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileChange(e, "idBack")}
                className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-exodus-light-blue file:text-white file:font-semibold file:cursor-pointer hover:file:bg-blue-400"
              />
              {files.idBack && (
                <p className="text-green-400 text-sm mt-2">✓ {files.idBack.name}</p>
              )}
            </div>

            <div>
              <label className="block text-white font-semibold mb-3">
                Proof of Address (Utility Bill/Bank Statement) *
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileChange(e, "proofOfAddress")}
                className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-exodus-light-blue file:text-white file:font-semibold file:cursor-pointer hover:file:bg-blue-400"
              />
              {files.proofOfAddress && (
                <p className="text-green-400 text-sm mt-2">✓ {files.proofOfAddress.name}</p>
              )}
            </div>

            <div className="bg-white/5 border border-exodus-light-blue/30 rounded-lg p-6">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={files.tradingAgreement}
                  onChange={(e) =>
                    setFiles((prev) => ({ ...prev, tradingAgreement: e.target.checked }))
                  }
                  className="mt-1 w-5 h-5 rounded border-2 border-white/20 bg-white/10 checked:bg-exodus-light-blue checked:border-exodus-light-blue transition shrink-0"
                />
                <span className="text-white text-sm leading-tight">
                  I have read and agree to the{" "}
                  <a href="/funded-trader-agreement" className="text-exodus-light-blue hover:underline font-semibold">
                    Funded Trader Agreement
                  </a>
                  , and I confirm all information provided is accurate.
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-exodus-light-blue hover:bg-blue-400 text-white py-4 rounded-lg font-bold text-lg transition shadow-lg shadow-exodus-light-blue/30"
            >
              Submit KYC Documents
            </button>
          </form>
        )}

        {/* Information */}
        <div className="bg-white/10 backdrop-blur-lg border-2 border-exodus-light-blue/30 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Document Requirements</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-exodus-light-blue mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Documents must be clear and legible</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-exodus-light-blue mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>All four corners of the document must be visible</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-exodus-light-blue mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Proof of address must be dated within the last 3 months</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-exodus-light-blue mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Accepted formats: JPG, PNG, PDF (max 10MB each)</span>
            </li>
          </ul>
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
                🔒 KYC Locked
              </h2>

              {/* Message */}
              <p className="text-gray-300 text-base md:text-lg mb-6 leading-relaxed">
                This page will unlock alongside our <span className="text-exodus-light-blue font-semibold">Funded Trader Agreement</span> after you have <span className="text-green-400 font-semibold">successfully completed</span> your evaluation challenge.
              </p>

              {/* Requirements */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-left mb-6">
                <h3 className="text-white font-semibold mb-3">What happens next:</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-0.5">1.</span>
                    <span>Complete your evaluation challenge</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-0.5">2.</span>
                    <span>Pass your profit target (8%)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-0.5">3.</span>
                    <span>Receive funded trader status</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-0.5">4.</span>
                    <span>KYC & Trader Agreement unlock automatically</span>
                  </li>
                </ul>
              </div>

              {/* CTA */}
              <p className="text-gray-400 text-sm">
                Focus on your trading and we'll unlock this when you're ready! 💪
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

