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
              <p>Welcome to Exodus Trading Ltd.! This document outlines the rules, parameters, and conditions for participating in our simulated trading evaluation program. By purchasing and participating, you acknowledge that you have read, understood, and agreed to comply with all rules outlined herein.</p>
              <div className="bg-yellow-500/10 border-l-4 border-yellow-400 rounded-lg p-4 my-4">
                <p className="text-sm font-semibold mb-2">Important Notice:</p>
                <p className="text-sm">All Exodus Evaluation Accounts and Exodus Accounts operate exclusively within a simulated, non-executing trading environment. No orders are transmitted to live markets. No real capital is allocated to participant trading activity. All rewards are derived from hypothetical trading performance and internal calculations only.</p>
              </div>
              <p className="mt-4">Violation of any rule will result in immediate account termination and forfeiture of any simulated performance results or reward eligibility.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">1. Program Overview</h2>
              <div className="bg-gradient-to-br from-exodus-light-blue/10 to-exodus-light-blue/5 backdrop-blur-sm rounded-xl p-6 border border-exodus-light-blue/20">
                <p className="text-lg font-semibold text-exodus-light-blue mb-4">Simulated Trading Evaluation Program</p>
                <p className="mb-4">The Exodus evaluation program is a single-phase assessment where participants must demonstrate consistent simulated performance while adhering to defined risk parameters. Upon successful completion and subject to compliance review, participants may become eligible for an Exodus Account and participation in the performance-based reward program.</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Simulated Account Sizes:</strong> $25,000 | $50,000 | $100,000 | $200,000</li>
                  <li><strong>Evaluation Type:</strong> Single-Phase (1-Step)</li>
                  <li><strong>Simulated Leverage:</strong> Up to 1:100</li>
                  <li><strong>Profit Target:</strong> 8% of initial simulated account balance</li>
                  <li><strong>Evaluation Period:</strong> Unlimited (no time restrictions)</li>
                </ul>
                <p className="mt-4 text-sm italic">All trading occurs in a simulated, demo environment. Completing evaluation objectives does not guarantee advancement or reward eligibility.</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">2. Simulated Environment Disclosure</h2>
              <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 backdrop-blur-sm rounded-xl p-6 border border-red-500/20">
                <p className="text-lg font-semibold text-red-400 mb-4">Critical Understanding Required</p>
                <p className="mb-4">Before participating, participants must understand the following:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>No Live Market Execution:</strong> All trading activity takes place in a simulated, demo environment only. No orders are transmitted to any live market.</li>
                  <li><strong>No Real Capital Allocation:</strong> No client funds are deposited into financial markets. No real capital is allocated to participant trading activity.</li>
                  <li><strong>Hypothetical Performance Only:</strong> All gains, losses, and rewards are derived from hypothetical trading performance and internal reward calculations only.</li>
                  <li><strong>No Investment Management:</strong> Participation does not involve the management of real investor funds.</li>
                  <li><strong>Simulated Results Limitations:</strong> Simulated trading does not replicate all real-world market conditions. Factors such as liquidity constraints, slippage, latency, broker execution variability, psychological stress, and capital risk exposure may differ materially from live trading environments.</li>
                </ul>
                <p className="mt-4 text-sm">Failure to understand these disclosures may result in unrealistic expectations. All participants are responsible for comprehending the simulated nature of the program.</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">3. Trading Rules & Risk Parameters</h2>
              
              <div className="space-y-6">
                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <h3 className="text-xl font-bold text-exodus-light-blue mb-3">3.1. Maximum Daily Loss (4%)</h3>
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
                  <h3 className="text-xl font-bold text-exodus-light-blue mb-3">3.2. Maximum Drawdown - Static (6%)</h3>
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
                  <h3 className="text-xl font-bold text-exodus-light-blue mb-3">3.3. Profit Target (8%)</h3>
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
              <h2 className="text-2xl font-bold text-white">4. Allowed Trading Practices</h2>
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
              <h2 className="text-2xl font-bold text-white">5. Prohibited Trading Practices</h2>
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
              <h2 className="text-2xl font-bold text-white">6. Minimum Trading Days</h2>
              <p>There is <strong>no minimum trading day requirement</strong> for Exodus challenges. You may complete your evaluation in as few days as you wish, provided you meet the profit target and adhere to all risk management rules.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">7. Consistency Rule</h2>
              <p>Exodus does <strong>not enforce a consistency rule</strong>. You may achieve your profit target in a single trade or over multiple trades—there are no restrictions on how profits are earned, as long as all other rules are followed.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">8. Account Credentials & Platform</h2>
              <p>8.1. Upon successful payment, you will receive your MetaTrader 4 or MetaTrader 5 simulated trading credentials via email within 24 hours.</p>
              <p>8.2. You are responsible for safeguarding your login details. Exodus is not liable for any unauthorized access resulting from shared or compromised credentials.</p>
              <p>8.3. Only one account per participant is permitted unless explicitly authorized by Exodus management.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">9. Exodus Account Program</h2>
              <div className="bg-gradient-to-br from-exodus-light-blue/10 to-exodus-light-blue/5 backdrop-blur-sm rounded-xl p-6 border border-exodus-light-blue/20">
                <p className="text-lg font-semibold text-exodus-light-blue mb-4">Post-Evaluation Participation</p>
                <p className="mb-4">Upon successfully completing evaluation objectives and subject to internal compliance review, eligible participants may receive access to an Exodus Account with the following structure:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Profit Split:</strong> Up to 90% profit share on simulated performance (details confirmed upon account approval).</li>
                  <li><strong>Reward Request Structure:</strong> On-demand – submit reward requests based on simulated performance, subject to internal review and processing timelines.</li>
                  <li><strong>Reward Processing Method:</strong> Exclusively USDT (Tron TRC-20).</li>
                  <li><strong>Same Risk Parameters Apply:</strong> Daily loss and max drawdown limits remain in effect on Exodus Accounts.</li>
                </ul>
                <div className="mt-4 bg-yellow-500/10 border-l-4 border-yellow-400 rounded-lg p-4">
                  <p className="text-sm font-semibold mb-2">Critical Disclosures:</p>
                  <ul className="text-sm space-y-1">
                    <li>• All Exodus Accounts operate in a simulated, non-executing environment</li>
                    <li>• No real capital is allocated to participant trading activity</li>
                    <li>• All rewards are derived from hypothetical trading performance and internal calculations</li>
                    <li>• Holding an Exodus Account does not guarantee reward eligibility</li>
                    <li>• Reward eligibility is conditional upon full rule compliance</li>
                    <li>• Exodus reserves sole discretion in determining compliance and eligibility</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">10. Account Scaling Opportunities</h2>
              <p>Exodus may offer account scaling opportunities for participants who demonstrate consistent simulated performance and full adherence to program rules. Account size increases are subject to internal review and approval.</p>
              <p className="mt-2">Scaling eligibility is determined at Exodus's sole discretion and communicated directly to qualified participants.</p>
              <p className="mt-2 text-sm italic">Scaling is not guaranteed and does not constitute a promise of increased reward amounts or eligibility.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">11. Breach & Account Termination</h2>
              <p>Your account will be immediately terminated if:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You exceed the 4% maximum daily loss limit.</li>
                <li>Your account balance falls below the 6% maximum static drawdown threshold.</li>
                <li>You engage in any prohibited trading practice.</li>
                <li>You violate any term outlined in this agreement or the Terms of Service.</li>
              </ul>
              <p className="mt-4"><strong>No refunds will be issued for breached accounts.</strong> Participants may repurchase a new evaluation at any time.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">12. KYC & Reward Verification</h2>
              <p>11.1. Before receiving any performance-based reward, participants must complete the KYC (Know Your Customer) verification process.</p>
              <p>12.2. Required documents may include government-issued ID, proof of residence, and a signed participant agreement.</p>
              <p>12.3. Failure to complete KYC may result in reward processing delays or disqualification from reward eligibility.</p>
              <p>12.4. All reward requests are subject to internal compliance review, behavioral analysis, and rule verification. Requests may be denied or withheld if fraudulent activity, rule violations, or prohibited conduct is detected or suspected.</p>
              <p className="mt-4 text-sm italic">Exodus's determinations regarding compliance and eligibility are final and binding.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">13. Data & Performance Monitoring</h2>
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
              <h2 className="text-2xl font-bold text-white">14. Acknowledgment & Acceptance</h2>
              <p>By purchasing and participating in the Exodus simulated trading evaluation program, you acknowledge and agree that:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You have read and understood all program rules outlined in this document.</li>
                <li>You accept full responsibility for your simulated trading decisions and performance.</li>
                <li>You understand that all accounts operate exclusively in a simulated, non-executing environment and no real capital is traded or allocated.</li>
                <li>You understand that participation does not involve the management of real investor funds.</li>
                <li>You agree to comply with all risk parameters and prohibited practices.</li>
                <li>You understand that completing evaluation objectives does not guarantee advancement or reward eligibility.</li>
                <li>You understand that holding an Exodus Account does not guarantee reward eligibility.</li>
                <li>You accept that reward eligibility is conditional upon full rule compliance and internal review.</li>
                <li>You accept that violation of any rule will result in immediate disqualification without refund.</li>
                <li>You understand that all rewards are derived exclusively from simulated trading performance and internal calculations.</li>
                <li>You accept that Exodus reserves sole discretion in determining rule compliance and reward eligibility.</li>
                <li>You agree that Exodus reserves the right to modify program rules at any time with prior notice.</li>
                <li>You acknowledge that Exodus is not a broker, investment firm, or financial advisor and does not provide investment advice or employment.</li>
              </ul>
              <p className="mt-4 text-sm italic">These acknowledgments are critical to your participation and understanding of the program structure.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">15. Questions & Support</h2>
              <p>If you have any questions about the program rules or need clarification, please contact our support team:</p>
              <p className="mt-4">📧 <a href="mailto:support@exodusprop.com" className="text-exodus-light-blue hover:underline">support@exodusprop.com</a></p>
              <div className="mt-6 bg-exodus-light-blue/10 border-l-4 border-exodus-light-blue rounded-lg p-4">
                <p className="text-sm font-semibold mb-2">Final Reminder:</p>
                <p className="text-sm">Exodus operates as a simulated trading evaluation and performance reward platform. It is not regulated by any financial regulatory authority and does not provide brokerage services, investment advice, or employment. All participation occurs within a simulated environment.</p>
              </div>
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

