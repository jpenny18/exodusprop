'use client';
import React from 'react';
import Link from 'next/link';

export default function ProgramRulesPage() {
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

          <h1 className="text-4xl font-bold text-exodus-light-blue mb-8">Program Rules & Evaluation Agreement</h1>
          <p className="text-gray-300 mb-8">Effective Date: December 2nd, 2025</p>
          
          <div className="space-y-8 text-gray-300">
            <section className="space-y-4">
              <p>Welcome to Exodus Trading Ltd.! This document outlines the rules, parameters, and conditions for participating in our 1-Step Evaluation Challenge. By purchasing and participating in this program, you acknowledge that you have read, understood, and agreed to comply with all rules outlined herein.</p>
              <p className="mt-4">Violation of any rule will result in immediate account termination and forfeiture of any simulated profits or eligibility for payouts.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">1. Program Overview</h2>
              <div className="bg-gradient-to-br from-exodus-light-blue/10 to-exodus-light-blue/5 backdrop-blur-sm rounded-xl p-6 border border-exodus-light-blue/20">
                <p className="text-lg font-semibold text-exodus-light-blue mb-4">1-Step Evaluation Challenge</p>
                <p className="mb-4">The Exodus 1-Step Challenge is a single-phase evaluation where traders must demonstrate consistent profitability while adhering to strict risk management rules. Upon successful completion, traders become eligible for simulated funded accounts.</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Account Sizes:</strong> $25,000 | $50,000 | $100,000 | $200,000</li>
                  <li><strong>Challenge Type:</strong> Single-Phase (1-Step)</li>
                  <li><strong>Leverage:</strong> Up to 1:100</li>
                  <li><strong>Profit Target:</strong> 8% of initial account balance</li>
                  <li><strong>Trading Period:</strong> Unlimited (no time restrictions)</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">2. Trading Rules & Risk Parameters</h2>
              
              <div className="space-y-6">
                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <h3 className="text-xl font-bold text-exodus-light-blue mb-3">2.1. Maximum Daily Loss (4%)</h3>
                  <p className="mb-2">You must not lose more than 4% of your account balance in any single trading day.</p>
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li>Daily loss is calculated from the account balance at the start of the trading day (5:00 PM EST rollover).</li>
                    <li>Both realized and unrealized losses count toward your daily loss limit.</li>
                    <li>Breaching this limit will result in immediate account termination.</li>
                  </ul>
                  <div className="mt-4 bg-exodus-dark/50 p-4 rounded-lg">
                    <p className="text-xs font-semibold text-exodus-light-blue mb-2">Example:</p>
                    <p className="text-xs">$100,000 account → Maximum daily loss = $4,000</p>
                    <p className="text-xs">If your balance reaches $96,000 (including open positions), you will breach.</p>
                  </div>
                </div>

                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <h3 className="text-xl font-bold text-exodus-light-blue mb-3">2.2. Maximum Drawdown - Static (6%)</h3>
                  <p className="mb-2">Your account balance must never fall below 94% of your initial starting balance.</p>
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li>This is a <strong>static drawdown</strong>, meaning it does not trail with profits.</li>
                    <li>Both realized and unrealized losses count toward your maximum drawdown.</li>
                    <li>Once you achieve the profit target, the drawdown limit remains at the initial 6%.</li>
                    <li>Breaching this limit will result in immediate account termination.</li>
                  </ul>
                  <div className="mt-4 bg-exodus-dark/50 p-4 rounded-lg">
                    <p className="text-xs font-semibold text-exodus-light-blue mb-2">Example:</p>
                    <p className="text-xs">$100,000 account → Maximum drawdown = $6,000</p>
                    <p className="text-xs">Your balance (including open trades) must never go below $94,000.</p>
                    <p className="text-xs mt-2">Even if you profit to $108,000 (8% profit target), your drawdown limit stays at $94,000.</p>
                  </div>
                </div>

                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <h3 className="text-xl font-bold text-exodus-light-blue mb-3">2.3. Profit Target (8%)</h3>
                  <p className="mb-2">To successfully complete the evaluation, you must achieve an 8% profit on your initial account balance.</p>
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li>Only closed positions count toward your profit target.</li>
                    <li>Open floating profits do not count until trades are closed.</li>
                    <li>There is no time limit to achieve your profit target.</li>
                  </ul>
                  <div className="mt-4 bg-exodus-dark/50 p-4 rounded-lg">
                    <p className="text-xs font-semibold text-exodus-light-blue mb-2">Profit Targets by Account Size:</p>
                    <p className="text-xs">$25,000 → $2,000 profit target</p>
                    <p className="text-xs">$50,000 → $4,000 profit target</p>
                    <p className="text-xs">$100,000 → $8,000 profit target</p>
                    <p className="text-xs">$200,000 → $16,000 profit target</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">3. Allowed Trading Practices</h2>
              <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 backdrop-blur-sm rounded-xl p-6 border border-green-500/20">
                <p className="text-lg font-semibold text-green-400 mb-4">✅ Permitted Activities</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Expert Advisors (EAs):</strong> Fully allowed – you may use automated trading systems.</li>
                  <li><strong>Trading Bots:</strong> Permitted – algorithmic trading is accepted.</li>
                  <li><strong>News Trading:</strong> Allowed – you may trade during high-impact news events.</li>
                  <li><strong>Weekend Holding:</strong> Permitted – you may hold positions over the weekend.</li>
                  <li><strong>Hedging:</strong> Allowed – you may hedge your positions.</li>
                  <li><strong>Scalping:</strong> Permitted – short-term trading strategies are accepted.</li>
                  <li><strong>All Forex Pairs:</strong> Major, minor, and exotic pairs are all available.</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">4. Prohibited Trading Practices</h2>
              <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 backdrop-blur-sm rounded-xl p-6 border border-red-500/20">
                <p className="text-lg font-semibold text-red-400 mb-4">❌ Strictly Forbidden</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Account Manipulation:</strong> Any attempt to exploit platform vulnerabilities or manipulate data feeds.</li>
                  <li><strong>Copy Trading Between Accounts:</strong> Using multiple accounts to mirror trades or hedge risk.</li>
                  <li><strong>Reverse/Arbitrage Strategies:</strong> Exploiting price discrepancies across brokers or feeds.</li>
                  <li><strong>Tick Scalping:</strong> Exploiting latency or delayed price feeds for guaranteed profits.</li>
                  <li><strong>Account Sharing:</strong> Sharing login credentials or allowing others to trade your account.</li>
                  <li><strong>High-Frequency Trading (HFT):</strong> Excessive order placement intended to manipulate or overload systems.</li>
                </ul>
                <p className="mt-4 text-sm">Any detected use of prohibited strategies will result in immediate disqualification and account termination, with no refund or payout eligibility.</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">5. Minimum Trading Days</h2>
              <p>There is <strong>no minimum trading day requirement</strong> for Exodus challenges. You may complete your evaluation in as few days as you wish, provided you meet the profit target and adhere to all risk management rules.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">6. Consistency Rule</h2>
              <p>Exodus does <strong>not enforce a consistency rule</strong>. You may achieve your profit target in a single trade or over multiple trades—there are no restrictions on how profits are earned, as long as all other rules are followed.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">7. Account Credentials & Platform</h2>
              <p>7.1. Upon successful payment, you will receive your MetaTrader 4 or MetaTrader 5 trading credentials via email within 24 hours.</p>
              <p>7.2. You are responsible for safeguarding your login details. Exodus is not liable for any unauthorized access resulting from shared or compromised credentials.</p>
              <p>7.3. Only one account per trader is permitted unless explicitly authorized by Exodus management.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">8. Simulated Funded Account</h2>
              <div className="bg-gradient-to-br from-exodus-light-blue/10 to-exodus-light-blue/5 backdrop-blur-sm rounded-xl p-6 border border-exodus-light-blue/20">
                <p className="text-lg font-semibold text-exodus-light-blue mb-4">Post-Evaluation Phase</p>
                <p className="mb-4">Upon successfully passing the evaluation, you will receive access to a simulated funded account with the following terms:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Profit Split:</strong> Determined upon funding (details provided after passing evaluation).</li>
                  <li><strong>Payout Frequency:</strong> On-demand – request payouts anytime after meeting minimum payout thresholds.</li>
                  <li><strong>Payout Method:</strong> Exclusively USDT (Tron TRC-20).</li>
                  <li><strong>Same Risk Rules Apply:</strong> Daily loss and max drawdown limits remain in effect on funded accounts.</li>
                </ul>
                <p className="mt-4 text-sm">All funded accounts remain simulated. No real capital is deployed. Payouts are performance-based rewards, not withdrawals of real trading profits.</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">9. Scaling Plan</h2>
              <p>Exodus offers an <strong>unlimited scaling program</strong> for successful funded traders. Consistent profitability and adherence to risk rules may qualify you for account size increases over time.</p>
              <p className="mt-2">Scaling eligibility is reviewed internally and communicated directly to qualified traders.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">10. Breach & Account Termination</h2>
              <p>Your account will be immediately terminated if:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You exceed the 4% maximum daily loss limit.</li>
                <li>Your account balance falls below the 6% maximum static drawdown threshold.</li>
                <li>You engage in any prohibited trading practice.</li>
                <li>You violate any term outlined in this agreement or the Terms of Service.</li>
              </ul>
              <p className="mt-4"><strong>No refunds will be issued for breached accounts.</strong> You may repurchase a new evaluation challenge at any time.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">11. KYC & Payout Verification</h2>
              <p>11.1. Before receiving any simulated payout, you must complete our KYC (Know Your Customer) verification process.</p>
              <p>11.2. Required documents may include government-issued ID, proof of residence, and a signed trader agreement.</p>
              <p>11.3. Failure to complete KYC may result in payout delays or disqualification from the funded program.</p>
              <p>11.4. All payout requests are subject to internal compliance review and may be withheld if fraudulent activity or rule violations are suspected.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">12. Data & Performance Monitoring</h2>
              <p>Exodus reserves the right to monitor all trading activity, review account performance, and conduct audits at any time. This includes but is not limited to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Trade history analysis</li>
                <li>Risk management adherence</li>
                <li>Detection of prohibited strategies</li>
                <li>Verification of trading consistency</li>
              </ul>
              <p className="mt-4">Exodus's determinations regarding rule violations are final and binding.</p>
            </section>

            <section className="space-y-4 bg-white/5 p-6 rounded-lg border border-white/10">
              <h2 className="text-2xl font-bold text-white">13. Acknowledgment & Acceptance</h2>
              <p>By purchasing and participating in the Exodus 1-Step Evaluation Challenge, you acknowledge and agree that:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You have read and understood all program rules outlined in this document.</li>
                <li>You accept full responsibility for your trading decisions and performance.</li>
                <li>You understand that all accounts are simulated and no real capital is traded.</li>
                <li>You agree to comply with all risk management rules and prohibited practices.</li>
                <li>You accept that violation of any rule will result in immediate disqualification without refund.</li>
                <li>You agree that Exodus reserves the right to modify program rules at any time with prior notice.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">14. Questions & Support</h2>
              <p>If you have any questions about the program rules or need clarification, please contact our support team:</p>
              <p className="mt-4">📧 <a href="mailto:support@exodus.com" className="text-exodus-light-blue hover:underline">support@exodus.com</a></p>
              <p className="mt-4">We're here to help you succeed. Good luck, and trade responsibly!</p>
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

