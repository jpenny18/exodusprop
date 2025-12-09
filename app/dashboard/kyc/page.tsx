"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { userDashboardNavItems } from "@/lib/dashboard-nav";
import { auth, getKYCSubmission, createOrUpdateKYCSubmission, KYCSubmission } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  User, 
  FileText, 
  Shield, 
  Clock, 
  XCircle,
  Loader2
} from 'lucide-react';

export default function KYCPage() {
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existingSubmission, setExistingSubmission] = useState<KYCSubmission | null>(null);

  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: '',
    email: ''
  });

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserEmail(user.email || "");
        setUserId(user.uid);
        setPersonalInfo(prev => ({ ...prev, email: user.email || '' }));

        // Load existing submission
        try {
          const submission = await getKYCSubmission(user.uid);
          if (submission) {
            setExistingSubmission(submission);
            setPersonalInfo(submission.personalInfo);
          }
        } catch (error) {
          console.error('Error loading KYC submission:', error);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "idFront" | "idBack" | "proofOfAddress") => {
    if (e.target.files && e.target.files[0]) {
      setFiles((prev) => ({ ...prev, [type]: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!files.idFront || !files.idBack || !files.proofOfAddress || !files.tradingAgreement) {
      alert("Please upload all required documents and sign the agreement");
      return;
    }

    if (!personalInfo.firstName || !personalInfo.lastName || !personalInfo.address || !personalInfo.city || !personalInfo.country) {
      alert("Please fill in all personal information fields");
      return;
    }

    try {
      setSubmitting(true);
      
      // Create/update KYC submission
      await createOrUpdateKYCSubmission(userId, {
        email: userEmail,
        personalInfo
      });

    alert("KYC documents submitted successfully! We'll review them within 24-48 hours.");
      
      // Reload submission
      const submission = await getKYCSubmission(userId);
      if (submission) {
        setExistingSubmission(submission);
      }
    } catch (error) {
      console.error('Error submitting KYC:', error);
      alert("Failed to submit KYC. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'approved':
        return (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400">
            <CheckCircle size={20} />
            <span className="font-medium">Approved</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
            <XCircle size={20} />
            <span className="font-medium">Rejected</span>
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-400">
            <Clock size={20} />
            <span className="font-medium">Under Review</span>
          </div>
        );
      default:
  return (
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400">
            <AlertCircle size={20} />
            <span className="font-medium">Not Submitted</span>
          </div>
        );
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Shield className="text-blue-500" size={24} />
                </div>
                <div>
                <h1 className="text-2xl font-bold text-white">KYC Verification</h1>
                <p className="text-sm text-gray-400">Know Your Customer verification for payouts</p>
                </div>
                </div>
            {getStatusBadge(existingSubmission?.status)}
          </div>
        </div>

        {/* Status Message */}
        {existingSubmission?.status === 'approved' && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-3">
            <CheckCircle className="text-green-500 mt-0.5" size={20} />
            <div>
              <h3 className="text-green-500 font-medium">KYC Approved</h3>
              <p className="text-sm text-gray-400 mt-1">
                Your KYC verification has been approved. You can now request payouts.
              </p>
            </div>
          </div>
        )}

        {existingSubmission?.status === 'rejected' && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
            <XCircle className="text-red-500 mt-0.5" size={20} />
            <div>
              <h3 className="text-red-500 font-medium">KYC Rejected</h3>
              <p className="text-sm text-gray-400 mt-1">
                {existingSubmission.reviewNotes || 'Your KYC submission was rejected. Please resubmit with correct documents.'}
              </p>
            </div>
          </div>
        )}

        {existingSubmission?.status === 'pending' && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-3">
            <Clock className="text-yellow-500 mt-0.5" size={20} />
            <div>
              <h3 className="text-yellow-500 font-medium">Under Review</h3>
              <p className="text-sm text-gray-400 mt-1">
                Your KYC submission is being reviewed. This typically takes 24-48 hours.
              </p>
            </div>
          </div>
        )}

        {/* KYC Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <User size={20} className="text-blue-500" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  First Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={personalInfo.firstName}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                  disabled={existingSubmission?.status === 'approved'}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 disabled:opacity-50"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Last Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={personalInfo.lastName}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                  disabled={existingSubmission?.status === 'approved'}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 disabled:opacity-50"
                  placeholder="Doe"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={personalInfo.address}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, address: e.target.value })}
                  disabled={existingSubmission?.status === 'approved'}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 disabled:opacity-50"
                  placeholder="123 Main Street"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  City <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={personalInfo.city}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, city: e.target.value })}
                  disabled={existingSubmission?.status === 'approved'}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 disabled:opacity-50"
                  placeholder="New York"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  State/Province <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={personalInfo.state}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, state: e.target.value })}
                  disabled={existingSubmission?.status === 'approved'}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 disabled:opacity-50"
                  placeholder="NY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Postal Code <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={personalInfo.postalCode}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, postalCode: e.target.value })}
                  disabled={existingSubmission?.status === 'approved'}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 disabled:opacity-50"
                  placeholder="10001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Country <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={personalInfo.country}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, country: e.target.value })}
                  disabled={existingSubmission?.status === 'approved'}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 disabled:opacity-50"
                  placeholder="United States"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={personalInfo.phone}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                  disabled={existingSubmission?.status === 'approved'}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 disabled:opacity-50"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Document Uploads */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileText size={20} className="text-blue-500" />
              Document Uploads
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Government ID (Front) <span className="text-red-400">*</span>
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                  onChange={(e) => handleFileChange(e, 'idFront')}
                  disabled={existingSubmission?.status === 'approved'}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600 file:cursor-pointer disabled:opacity-50"
              />
                {files.idFront && <p className="text-sm text-green-400 mt-1">✓ {files.idFront.name}</p>}
                {existingSubmission?.documents.governmentIdFileName && <p className="text-sm text-blue-400 mt-1">📄 Uploaded: {existingSubmission.documents.governmentIdFileName}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Government ID (Back) <span className="text-red-400">*</span>
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                  onChange={(e) => handleFileChange(e, 'idBack')}
                  disabled={existingSubmission?.status === 'approved'}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600 file:cursor-pointer disabled:opacity-50"
              />
                {files.idBack && <p className="text-sm text-green-400 mt-1">✓ {files.idBack.name}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Proof of Address <span className="text-red-400">*</span>
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                  onChange={(e) => handleFileChange(e, 'proofOfAddress')}
                  disabled={existingSubmission?.status === 'approved'}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600 file:cursor-pointer disabled:opacity-50"
              />
                {files.proofOfAddress && <p className="text-sm text-green-400 mt-1">✓ {files.proofOfAddress.name}</p>}
                {existingSubmission?.documents.proofOfAddressFileName && <p className="text-sm text-blue-400 mt-1">📄 Uploaded: {existingSubmission.documents.proofOfAddressFileName}</p>}
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
              <p className="text-sm text-gray-400">
                <strong className="text-blue-400">Accepted documents:</strong> Passport, Driver's License, National ID Card. 
                For proof of address: Utility bill, bank statement, or government letter (must be dated within last 3 months).
              </p>
            </div>
          </div>

          {/* Trading Agreement */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileText size={20} className="text-blue-500" />
              Trading Agreement
            </h2>
            <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={files.tradingAgreement}
                onChange={(e) => setFiles({ ...files, tradingAgreement: e.target.checked })}
                disabled={existingSubmission?.status === 'approved'}
                className="mt-1 w-5 h-5 rounded border-gray-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900 disabled:opacity-50"
                />
              <label className="text-sm text-gray-300">
                I have read and agree to the <a href="/terms" className="text-blue-500 hover:text-blue-400 underline">Terms & Conditions</a> and <a href="/program-rules" className="text-blue-500 hover:text-blue-400 underline">Program Rules</a>. 
                I understand that false information may result in account termination and forfeiture of funds.
              </label>
            </div>
            </div>

          {/* Submit Button */}
          {existingSubmission?.status !== 'approved' && (
            <button
              type="submit"
              disabled={submitting}
              className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                submitting
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
                  <Upload size={20} />
                  <span>Submit KYC Documents</span>
                </>
              )}
            </button>
          )}
          </form>
      </div>
    </DashboardLayout>
  );
}
