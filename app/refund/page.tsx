'use client';
import React from 'react';
import Link from 'next/link';

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-exodus-blue via-exodus-blue to-exodus-dark text-white">
      <div className="relative px-6 py-16 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-exodus-light-blue/[0.02]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-3/4 h-full rounded-full bg-exodus-light-blue/[0.03] blur-[150px] opacity-60"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Back to Home Link */}
          <Link href="/" className="inline-flex items-center gap-2 text-exodus-light-blue hover:text-blue-300 transition mb-8">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>

          <h1 className="text-4xl font-bold text-exodus-light-blue mb-8">Refund & Chargeback Policy</h1>
          <p className="text-gray-300 mb-8">Effective Date: December 2nd, 2025</p>
          
          <div className="space-y-8 text-gray-300">
            <section className="space-y-4">
              <p>Exodus Trading Ltd. is committed to transparency and fairness in all transactions related to our evaluation services. By purchasing a challenge or subscription from Exodus, you agree to the following refund and chargeback terms. These policies ensure our ability to offer consistent service, protect against abuse, and maintain operational integrity in compliance with any applicable regulations.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">1. Refund Eligibility for Successful Challenge Completion</h2>
              <div className="bg-gradient-to-br from-exodus-light-blue/10 to-exodus-light-blue/5 backdrop-blur-sm rounded-xl p-6 border border-exodus-light-blue/20">
                <p className="text-lg font-semibold text-exodus-light-blue mb-4">Challenge Fee Refund Program</p>
                <p className="mb-4">To be eligible:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You must successfully complete an Exodus trading challenge;</li>
                  <li>You must remain in full compliance with all trading rules and parameters at all times;</li>
                  <li>You must complete two (2) consecutive successful withdrawals from your funded simulation account;</li>
                  <li>You must submit a valid refund request for the specific account that meets the above criteria.</li>
                </ul>
                <p className="mt-4">Refunds under this program are processed only after the second approved payout and apply exclusively to the associated account.</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">2. Non-Refundable Circumstances</h2>
              <p>Challenge fees, instant access fees, and subscription payments are non-refundable in the following scenarios:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Failure to complete a challenge;</li>
                <li>Breach or violation of any trading rules or platform terms;</li>
                <li>Voluntary account closure or inactivity;</li>
                <li>Suspicious, manipulative, or exploitative trading behavior;</li>
                <li>Disagreement with platform terms or conditions after payment has been made;</li>
                <li>Partial use of a subscription or challenge access.</li>
              </ul>
              <p className="mt-4">Refunds will not be granted on the basis of user dissatisfaction with evaluation outcomes or trading restrictions.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">3. Chargeback Policy</h2>
              <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 backdrop-blur-sm rounded-xl p-6 border border-red-500/20">
                <p className="text-lg font-semibold text-red-400 mb-4">If a user initiates a chargeback:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All profits associated with any funded or challenge accounts will be automatically forfeited;</li>
                  <li>The user's access will be permanently revoked, and they will be banned from all future participation;</li>
                  <li>The user may be added to a third-party industry blacklist to prevent abuse across similar platforms.</li>
                </ul>
                <p className="mt-4">We strongly encourage users to contact our support team prior to filing any dispute to resolve concerns directly.</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">4. Refund Request Procedure</h2>
              <p>Eligible refund requests must be submitted via the user's dashboard or emailed to <span className="text-exodus-light-blue">support@exodus.com</span> and must include:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The specific account ID associated with the completed challenge;</li>
                <li>Proof of two consecutive approved withdrawals;</li>
                <li>The original payment transaction ID.</li>
              </ul>
              <p className="mt-4">Please allow up to 5 business days for processing. Approved refunds will be issued to the original payment method only.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">5. Challenge & Evaluation Fees</h2>
              <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20">
                <p className="mb-4">All challenge and instant access fees are payments for:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access to our simulated trading evaluation environment;</li>
                  <li>Performance-based assessments and analytics;</li>
                  <li>Use of proprietary rules, infrastructure, and performance metrics.</li>
                </ul>
                <p className="mt-4">These payments are not investments, not deposits, and do not constitute the purchase of financial instruments or any guaranteed outcome.</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">6. Subscription Billing and Cancellation</h2>
              <p>If you enroll in a subscription plan:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You may cancel at any time prior to the next billing cycle to avoid renewal charges;</li>
                <li>No partial refunds will be issued for unused days or early cancellation.</li>
              </ul>
              <p className="mt-4">To cancel a subscription, log in to your dashboard or contact <span className="text-exodus-light-blue">support@exodus.com</span>.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">7. Disputes & Unauthorized Charges</h2>
              <p>All refund or billing inquiries must be submitted within three (3) calendar days of the original transaction.</p>
              <p className="mt-4">Please email our billing department at <span className="text-exodus-light-blue">support@exodus.com</span> with any concerns related to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Duplicate charges;</li>
                <li>Unauthorized transactions;</li>
                <li>Billing errors or disputes.</li>
              </ul>
            </section>

            <section className="space-y-4 bg-white/5 p-6 rounded-lg border border-white/10">
              <h2 className="text-2xl font-bold text-white">8. Final Notice</h2>
              <p>By purchasing a challenge or subscription through Exodus, you agree that:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You are purchasing access to a simulated trading evaluation service, not a live trading account or investment product;</li>
                <li>You understand and accept that fees are non-refundable except where explicitly stated under the refund eligibility conditions above;</li>
                <li>You waive any claim for refund outside the terms of this policy.</li>
              </ul>
            </section>

            <div className="pt-8">
              <p className="text-sm text-gray-400">Last updated: December 2nd, 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

