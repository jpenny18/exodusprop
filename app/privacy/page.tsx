'use client';
import React from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
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

          <h1 className="text-4xl font-bold text-exodus-light-blue mb-8">Privacy Policy</h1>
          <p className="text-gray-300 mb-8">Effective Date: December 2nd, 2025</p>

          <div className="space-y-8 text-gray-300">
            <section className="space-y-4">
              <p>Exodus Trading Ltd. ("we," "our," or "us") is committed to protecting your privacy and handling your information transparently and responsibly. This Privacy Policy describes how we collect, use, disclose, and safeguard your personal data when you access our website, register for an account, or participate in our programs.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">1. Information We Collect</h2>
              <p>We collect the following categories of information:</p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white">1.1. Account Information</h3>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>Full name</li>
                    <li>Email address</li>
                    <li>Username and password</li>
                    <li>Contact details</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">1.2. Identity Verification (KYC/AML Compliance)</h3>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>Government-issued identification documents</li>
                    <li>Proof of residence (e.g., utility bills, bank statements)</li>
                    <li>Other verification data as required by law or internal policies</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">1.3. Payment Information</h3>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>Payment details are collected and processed securely via our third-party payment processors (e.g., Whop).</li>
                    <li>We do not store or retain full payment card data on our servers.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">1.4. Usage Data</h3>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>IP address</li>
                    <li>Browser type and version</li>
                    <li>Device identifiers and device type</li>
                    <li>Access dates and times</li>
                    <li>Pages visited and referring URLs</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">1.5. Communications and Support Data</h3>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>Records of correspondence with our team (e.g., support requests, verification inquiries)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">2. How We Use Your Information</h2>
              <p>We may use your personal data for the following purposes:</p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white">2.1. Service Delivery and Account Management</h3>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>Provide access to our simulated trading programs</li>
                    <li>Manage your user account and program participation</li>
                    <li>Authenticate your identity and maintain security</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">2.2. Compliance and Verification</h3>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>Comply with applicable laws, regulations, and internal KYC/AML policies</li>
                    <li>Prevent, detect, and investigate fraud, abuse, or violations of our Terms of Service</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">2.3. Communication</h3>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>Notify you of important updates, policy changes, and service-related information</li>
                    <li>Respond to inquiries or support requests</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">2.4. Marketing and Promotions</h3>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>Send you information about promotions, special offers, or new services (you may opt out at any time)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">2.5. Analytics and Improvements</h3>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>Analyze usage trends and performance</li>
                    <li>Improve website functionality, services, and user experience</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">2.6. Legal and Risk Management</h3>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>Enforce our agreements, including the Terms of Service</li>
                    <li>Establish, exercise, or defend legal claims</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">3. Data Sharing and Disclosure</h2>
              <p>We do not sell your personal information. We may share or disclose your data in the following circumstances:</p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white">3.1. Payment Processing</h3>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>With payment providers (e.g., Whop) for billing and transaction management</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">3.2. Regulatory Compliance</h3>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>With governmental agencies, regulatory bodies, or law enforcement if required by applicable law, legal process, or to protect our rights</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">3.3. Service Providers</h3>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>With trusted vendors and contractors who assist with operational support (e.g., cloud hosting, CRM systems, analytics tools), subject to contractual obligations to protect your information</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">3.4. Corporate Transactions</h3>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>In connection with a merger, acquisition, or asset sale, your information may be transferred as part of that transaction, in accordance with applicable data protection laws</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">4. Data Retention</h2>
              <p>4.1. We retain personal data for as long as reasonably necessary to fulfill the purposes outlined in this policy, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Providing services to you</li>
                <li>Maintaining records to comply with legal, regulatory, and accounting requirements</li>
                <li>Enforcing our Terms of Service</li>
                <li>Resolving disputes</li>
              </ul>
              <p className="mt-4">4.2. KYC and identity verification records are retained for the duration required by applicable laws and internal compliance protocols.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">5. Data Security</h2>
              <p>We implement reasonable technical and organizational measures to secure your personal data against unauthorized access, alteration, disclosure, or destruction. However, no internet-based system can be guaranteed 100% secure. You acknowledge and accept this inherent risk.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">6. Your Rights</h2>
              <p>Depending on your jurisdiction, you may have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access the personal data we hold about you</li>
                <li>Request correction or deletion of your information (subject to legal and operational limitations)</li>
                <li>Object to or restrict certain processing</li>
                <li>Withdraw consent for marketing communications at any time</li>
              </ul>
              <p className="mt-4">To exercise your rights, please contact us at:</p>
              <p className="mt-2">📧 <a href="mailto:support@exodus.com" className="text-exodus-light-blue hover:underline">support@exodus.com</a></p>
              <p className="mt-4">We may require verification of your identity before processing any request.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">7. International Transfers</h2>
              <p>Your personal data may be processed or stored in jurisdictions outside your country of residence, which may have different data protection laws. By using our services, you consent to such transfers in compliance with applicable law.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">8. Children's Privacy</h2>
              <p>Our services are intended only for individuals over the age of 18. We do not knowingly collect personal data from minors. If you believe we have collected data from a child, please contact us immediately, and we will take appropriate steps to remove the information.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">9. Changes to This Privacy Policy</h2>
              <p>We reserve the right to update or modify this Privacy Policy at any time. Changes will be posted on this page with an updated effective date. Continued use of our services constitutes acceptance of the revised policy.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">10. Contact Us</h2>
              <p>If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, you may contact us at:</p>
              <p className="mt-4">Exodus Trading Ltd. – Privacy Compliance</p>
              <p className="mt-2">📧 <a href="mailto:support@exodus.com" className="text-exodus-light-blue hover:underline">support@exodus.com</a></p>
              <p className="mt-4">By using our website and services, you acknowledge that you have read, understood, and agree to this Privacy Policy.</p>
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

