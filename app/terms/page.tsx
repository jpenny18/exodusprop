'use client';
import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
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

          <h1 className="text-4xl font-bold text-exodus-light-blue mb-8">Terms of Service</h1>
          <p className="text-gray-300 mb-8">Effective Date: December 2nd, 2025</p>
          
          <div className="space-y-8 text-gray-300">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">1. Acceptance of Terms</h2>
              <p>By accessing, registering, purchasing, or participating in any program offered by Exodus Trading Ltd., you expressly agree to comply with these Terms of Service ("Terms"). If you do not agree with any part of these Terms, you must not use our services.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">2. Nature of Services</h2>
              <p>2.1. Exodus provides access to simulated trading programs intended solely for educational and skill evaluation purposes. No actual capital is allocated or traded by participants at any time.</p>
              <p>2.2. All references to "funded accounts," "capital," "payouts," or similar terms are used exclusively to describe simulated trading environments. These references do not indicate any transfer or allocation of real financial assets.</p>
              <p>2.3. Participation in any program does not establish a brokerage relationship, fiduciary duty, or investment advisory arrangement.</p>
              <p>2.4. You acknowledge that no aspect of the services constitutes a financial product or investment offering, and no purchase of services represents an opportunity to acquire or trade real assets.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">3. Ownership and Control of Simulated Capital</h2>
              <p>3.1. All simulated account balances, including those labeled as "funded," are entirely fictitious and remain the sole property of Exodus Trading Ltd.</p>
              <p>3.2. Users do not acquire any ownership interest, rights, or claims to any actual funds, securities, or assets through participation in any program.</p>
              <p>3.3. Exodus maintains absolute discretion to adjust, modify, reset, or revoke any simulated balances, performance records, or account parameters.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">4. Risk Disclosure</h2>
              <p>4.1. Trading in simulated environments is for demonstration, education, and skill assessment only. No performance metrics are indicative of actual or future trading success.</p>
              <p>4.2. Exodus does not guarantee any financial return, profit, income, or success, whether simulated or real.</p>
              <p>4.3. All participation is at your sole discretion and risk. You are solely responsible for determining whether any program is suitable for your objectives and experience.</p>
              <p>4.4. No aspect of our services should be construed as financial advice or relied upon to make real-world investment decisions.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">5. Account Conduct and Rules</h2>
              <p>5.1. Each participant may maintain only one active evaluation or simulated account at any time unless explicitly authorized in writing.</p>
              <p>5.2. Account sharing, sub-licensing, reselling, or transferring access to any program is strictly prohibited and will result in immediate suspension or termination.</p>
              <p>5.3. Use of automated systems, software exploits, data feed manipulation, or other conduct intended to unfairly influence performance metrics is strictly prohibited.</p>
              <p>5.4. All trading must be conducted within the published program parameters. Exodus reserves the sole right to determine whether any activity constitutes a breach of program rules or unethical conduct.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">6. Simulated Payouts and Reward Eligibility</h2>
              <p>6.1. All simulated profit splits, performance-based rewards, or any representations of payout are fully discretionary and contingent upon complete compliance with these Terms, program rules, and a satisfactory internal review.</p>
              <p>6.2. No payout or reward shall be considered earned or due unless expressly confirmed in writing by an authorized representative of Exodus.</p>
              <p>6.3. Exodus reserves the unrestricted right, at its sole discretion, to withhold, adjust, cancel, or deny any simulated payout or performance-based reward for any reason, including but not limited to suspected violation of these Terms, program abuse, or conduct detrimental to the integrity of the program.</p>
              <p>6.4. Processing timelines for rewards or discretionary payouts may vary based on verification requirements, compliance reviews, or administrative processes.</p>
              <p>6.5. Under no circumstances shall any simulated payout be construed as a promise or guarantee of financial compensation or actual funds.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">7. Termination, Suspension, and Account Revocation</h2>
              <p>7.1. Exodus reserves the right to suspend, revoke, or terminate any account or participation in any program at any time, with or without cause, at its sole discretion.</p>
              <p>7.2. Grounds for suspension or termination may include but are not limited to: suspected breach of these Terms, program manipulation, fraud, unethical behavior, or any activity deemed harmful to Exodus's operations or reputation.</p>
              <p>7.3. Upon suspension or termination, all eligibility for current or future simulated rewards, payouts, or benefits is automatically forfeited, without compensation.</p>
              <p>7.4. Exodus may retain or delete any data associated with terminated accounts at its discretion.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">8. Intellectual Property</h2>
              <p>8.1. All website content, program structures, trading simulations, data feeds, platform interfaces, branding, and proprietary tools are and remain the exclusive property of Exodus Trading Ltd.</p>
              <p>8.2. Unauthorized reproduction, distribution, modification, public display, or commercial exploitation is strictly prohibited without prior written consent.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">9. Program Modifications and Discretion</h2>
              <p>9.1. Exodus reserves the right to modify, revise, suspend, or discontinue any aspect of its services, programs, features, pricing, or rules at any time, with or without prior notice.</p>
              <p>9.2. Continued participation after any modification constitutes acceptance of the updated Terms and conditions.</p>
              <p>9.3. Exodus reserves sole discretion to interpret program rules and eligibility criteria, and its determinations shall be final and binding.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">10. Legal Disclaimers</h2>
              <p>10.1. Exodus Trading Ltd. is not a broker-dealer, investment advisor, or regulated financial institution.</p>
              <p>10.2. No information provided constitutes investment advice, a solicitation to invest, or a recommendation to engage in any financial transaction.</p>
              <p>10.3. You agree that your use of the services is entirely voluntary and at your own risk.</p>
              <p>10.4. To the fullest extent permitted by applicable law, Exodus disclaims any and all liability for any losses or damages arising out of or in connection with participation in any program.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">11. Governing Law and Dispute Resolution</h2>
              <p>11.1. These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which Exodus Trading Ltd. is registered, without regard to its conflict of laws principles.</p>
              <p>11.2. Any dispute arising from or relating to these Terms shall be subject to resolution exclusively through arbitration or other dispute resolution mechanisms as determined by Exodus, unless prohibited by applicable law.</p>
              <p>11.3. You agree to waive any class action or collective proceeding against Exodus to the maximum extent permitted by law.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">12. Entire Agreement</h2>
              <p>These Terms constitute the entire agreement between you and Exodus Trading Ltd. regarding your use of the services and supersede any prior understandings or agreements.</p>
              <p>By continuing to use Exodus's services, you acknowledge that you have read, understood, and agreed to these Terms of Service in full.</p>
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

