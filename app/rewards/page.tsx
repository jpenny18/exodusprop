"use client";

import Image from "next/image";
import Link from "next/link";

export default function HowWePayTraders() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-exodus-blue/95 backdrop-blur-sm z-50 border-b border-exodus-light-blue/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <Link href="/" className="flex items-center gap-3 md:gap-6 p-4 md:p-6">
              <Image
                src="/logo.png"
                alt="Exodus Logo"
                width={120}
                height={120}
                priority
                className="h-16 md:h-28 w-auto"
              />
            </Link>
            <div className="flex items-center gap-3 md:gap-4">
              <Link href="/" className="text-white hover:text-exodus-light-blue transition font-semibold text-xs md:text-sm">
                HOME
              </Link>
              <Link href="/auth" className="bg-exodus-light-blue hover:bg-blue-400 text-white px-4 md:px-5 py-2 rounded-lg font-semibold transition text-xs md:text-sm">
                SIGN UP
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-exodus-blue via-exodus-blue to-exodus-dark pt-24 md:pt-32 pb-12 md:pb-16 px-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-exodus-light-blue rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h1 className="text-3xl md:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
            How Performance Rewards Are Processed
          </h1>
          <p className="text-lg md:text-2xl text-gray-200">
            Transparent, rule-based simulated performance rewards
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-4xl mx-auto space-y-8 md:space-y-12">
          
          {/* Introduction */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 border-t-4 border-exodus-light-blue">
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              At Exodus, our objective is to operate a structured, rule-based simulated trading program where participants clearly understand how reward eligibility works and what conditions must be satisfied.
            </p>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed mt-4 font-semibold text-exodus-dark">
              Clarity reduces misunderstandings and unrealistic expectations.
            </p>
          </div>

          {/* Simulated Trading Environment */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-exodus-dark mb-4 md:mb-6">
              Simulated Trading Environment
            </h2>
            <div className="space-y-3 md:space-y-4 text-gray-700 text-base md:text-lg leading-relaxed">
              <p>
                All Exodus accounts operate exclusively within a <span className="font-semibold text-exodus-dark">simulated, non-executing trading environment</span>.
              </p>
              <p className="font-semibold text-exodus-dark">
                Exodus:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-exodus-light-blue font-bold">•</span>
                  <span>Is not a broker</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-exodus-light-blue font-bold">•</span>
                  <span>Does not accept trading deposits</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-exodus-light-blue font-bold">•</span>
                  <span>Does not execute trades in live financial markets</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-exodus-light-blue font-bold">•</span>
                  <span>Does not allocate real capital to participant trading activity</span>
                </li>
              </ul>
              <p>
                All payouts represent simulated performance-based rewards derived from hypothetical trading results and internal reward calculations.
              </p>
              <p>
                Participation does not involve the management of real investor funds.
              </p>
            </div>
          </div>

          {/* Performance Reward Reserve */}
          <div className="bg-gradient-to-br from-exodus-blue to-exodus-dark rounded-2xl shadow-xl p-6 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6">
              Performance Reward Reserve
            </h2>
            <p className="text-base md:text-lg text-gray-200 leading-relaxed mb-6">
              To support operational stability, Exodus maintains an internal liquidity reserve designated for the processing of approved simulated performance rewards.
            </p>
            <div className="bg-white/10 backdrop-blur-sm border-2 border-exodus-light-blue rounded-xl p-6 md:p-8 text-center">
              <p className="text-sm md:text-base text-exodus-light-blue font-semibold mb-2">
                Current internal reserve allocation:
              </p>
              <p className="text-4xl md:text-6xl font-bold text-white">
                $70,000
              </p>
              <p className="text-xs md:text-sm text-gray-300 mt-3">
                USD
              </p>
            </div>
            <p className="text-base md:text-lg text-gray-200 leading-relaxed mt-6">
              This reserve is an internal operational allocation and does not represent client deposits, segregated trust accounts, or capital backing live market exposure.
            </p>
            <p className="text-base md:text-lg text-gray-200 leading-relaxed mt-4">
              Exodus may adjust this allocation at its sole discretion.
            </p>
          </div>

          {/* Illustrative Reward Range Examples */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-exodus-dark mb-4 md:mb-6">
              Illustrative Reward Range Examples
            </h2>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6">
              The following figures are illustrative examples based on common program structures and are not guarantees of payout eligibility:
            </p>
            
            <div className="bg-gray-50 rounded-xl p-5 md:p-6 mb-6">
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-3">
                  <div className="text-sm md:text-base font-semibold text-exodus-dark mb-1">50K Performance Tier</div>
                  <div className="text-sm md:text-base text-gray-700">Typical first reward range: <span className="font-semibold text-exodus-dark">~$1,000 – $2,000</span></div>
                </div>
                <div className="border-b border-gray-200 pb-3">
                  <div className="text-sm md:text-base font-semibold text-exodus-dark mb-1">100K Performance Tier</div>
                  <div className="text-sm md:text-base text-gray-700">Typical first reward range: <span className="font-semibold text-exodus-dark">~$2,000 – $4,000</span></div>
                </div>
                <div className="pb-2">
                  <div className="text-sm md:text-base font-semibold text-exodus-dark mb-1">200K Performance Tier</div>
                  <div className="text-sm md:text-base text-gray-700">Typical first reward range: <span className="font-semibold text-exodus-dark">~$4,000 – $8,000</span></div>
                </div>
              </div>
            </div>

            <div className="bg-exodus-light-blue/10 border-l-4 border-exodus-light-blue rounded-lg p-5 md:p-6">
              <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-3">
                Across tiers, average initial reward calculations may approximate <span className="font-bold text-exodus-dark">~$3,300</span> based on hypothetical performance scenarios.
              </p>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed font-semibold">
                Actual reward amounts vary depending on simulated trading results and rule compliance.
              </p>
            </div>
          </div>

          {/* Reward Processing Structure */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-exodus-dark mb-4 md:mb-6">
              Reward Processing Structure
            </h2>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6">
              Reward requests are processed as follows:
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-exodus-light-blue rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm md:text-base">1</span>
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-base md:text-lg text-gray-700">
                    Participant submits a reward request through the dashboard.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-exodus-light-blue rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm md:text-base">2</span>
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-base md:text-lg text-gray-700 mb-2">
                    The account undergoes review for:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li className="text-sm md:text-base text-gray-600">• Rule compliance</li>
                    <li className="text-sm md:text-base text-gray-600">• Risk parameter adherence</li>
                    <li className="text-sm md:text-base text-gray-600">• Trade integrity and behavioral consistency</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-exodus-light-blue rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm md:text-base">3</span>
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-base md:text-lg text-gray-700">
                    Approved reward calculations are processed from internal operational reserves.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-5 md:p-6">
              <p className="text-base md:text-lg text-gray-700 leading-relaxed font-semibold">
                Exodus reserves sole discretion in determining rule compliance and payout eligibility.
              </p>
            </div>

            <div className="mt-8 bg-gray-50 rounded-xl p-5 md:p-6">
              <h3 className="text-lg md:text-xl font-bold text-exodus-dark mb-3">
                Processing Timeline
              </h3>
              <p className="text-sm md:text-base text-gray-700 mb-3">
                Reward requests are reviewed on a rolling basis.
              </p>
              <p className="text-sm md:text-base text-gray-700 mb-3">
                Processing timelines may vary depending on volume, internal review requirements, and compliance verification procedures.
              </p>
              <p className="text-sm md:text-base text-gray-700 font-semibold">
                No specific processing time is guaranteed.
              </p>
            </div>
          </div>

          {/* Important Conditions */}
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-2xl p-6 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-yellow-900 mb-4 md:mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Important Conditions
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm md:text-base text-gray-800">
                <span className="font-bold">•</span>
                <span>Passing an evaluation or holding an Exodus Account does not guarantee reward eligibility</span>
              </li>
              <li className="flex items-start gap-2 text-sm md:text-base text-gray-800">
                <span className="font-bold">•</span>
                <span>Reward eligibility is conditional upon full rule compliance</span>
              </li>
              <li className="flex items-start gap-2 text-sm md:text-base text-gray-800">
                <span className="font-bold">•</span>
                <span>Violations of program rules may void simulated gains and payout eligibility</span>
              </li>
              <li className="flex items-start gap-2 text-sm md:text-base text-gray-800">
                <span className="font-bold">•</span>
                <span>All rewards are derived exclusively from simulated trading performance</span>
              </li>
            </ul>
          </div>

          {/* Understanding Reward Frequency */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-exodus-dark mb-4 md:mb-6">
              Understanding Reward Frequency
            </h2>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6">
              The prop trading industry often promotes unrealistic expectations.
            </p>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6 font-semibold text-exodus-dark">
              Exodus believes participants should understand statistical realities.
            </p>

            <h3 className="text-xl md:text-2xl font-bold text-exodus-dark mb-4">
              Industry-Wide Observations (Not Exodus Guarantees):
            </h3>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4">
              Across the broader simulated prop trading industry:
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2 text-sm md:text-base text-gray-700">
                <span className="text-exodus-light-blue font-bold">•</span>
                <span>Approximately 3–5% of participants complete evaluation objectives</span>
              </li>
              <li className="flex items-start gap-2 text-sm md:text-base text-gray-700">
                <span className="text-exodus-light-blue font-bold">•</span>
                <span>Of those who advance, approximately 40–60% request a payout</span>
              </li>
              <li className="flex items-start gap-2 text-sm md:text-base text-gray-700">
                <span className="text-exodus-light-blue font-bold">•</span>
                <span>Many participants reset, violate rules, or discontinue trading before reward eligibility</span>
              </li>
            </ul>
            <p className="text-sm md:text-base text-gray-600 italic">
              These figures represent general industry observations only and do not predict Exodus outcomes.
            </p>
          </div>

          <div className="bg-exodus-dark rounded-2xl shadow-xl p-6 md:p-10 text-white">
            <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
              Hypothetical Example
            </h3>
            <p className="text-base md:text-lg text-gray-200 mb-4">
              For illustration purposes only:
            </p>
            <p className="text-base md:text-lg text-gray-200 mb-4">
              For every 100 evaluation purchases:
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 md:p-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm md:text-base text-gray-200">Participants completing objectives:</span>
                <span className="text-lg md:text-xl font-bold text-exodus-light-blue">~4</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm md:text-base text-gray-200">Participants requesting payout:</span>
                <span className="text-lg md:text-xl font-bold text-exodus-light-blue">~2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm md:text-base text-gray-200">Illustrative average reward:</span>
                <span className="text-lg md:text-xl font-bold text-exodus-light-blue">~$3,300</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-white/20">
                <span className="text-sm md:text-base text-white font-semibold">Illustrative total reward exposure:</span>
                <span className="text-xl md:text-2xl font-bold text-white">~$6,600</span>
              </div>
            </div>
            <p className="text-sm md:text-base text-gray-300 leading-relaxed mt-6 italic">
              This example is hypothetical and not a representation of actual or future Exodus results.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
            <h3 className="text-xl md:text-2xl font-bold text-exodus-dark mb-4">
              Why This Matters
            </h3>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4">
              Because reward eligibility is statistically limited and rule-dependent:
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2 text-sm md:text-base text-gray-700">
                <span className="text-exodus-light-blue font-bold">•</span>
                <span>Internal reserves can be maintained</span>
              </li>
              <li className="flex items-start gap-2 text-sm md:text-base text-gray-700">
                <span className="text-exodus-light-blue font-bold">•</span>
                <span>Reward processing is not dependent on immediate new sales</span>
              </li>
              <li className="flex items-start gap-2 text-sm md:text-base text-gray-700">
                <span className="text-exodus-light-blue font-bold">•</span>
                <span>Operational stability can be preserved</span>
              </li>
            </ul>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              However, no assurance is given that reward frequency or participant outcomes will match historical industry observations.
            </p>
          </div>

          <div className="bg-gradient-to-br from-exodus-light-blue to-blue-600 rounded-2xl shadow-xl p-6 md:p-10 text-white">
            <h3 className="text-xl md:text-2xl font-bold mb-4">
              Final Notice
            </h3>
            <p className="text-base md:text-lg leading-relaxed mb-4">
              Exodus is a simulated trading evaluation and reward platform.
            </p>
            <p className="text-base md:text-lg leading-relaxed mb-4">
              It is not regulated by a financial authority and does not provide brokerage services, investment advice, or employment.
            </p>
            <p className="text-base md:text-lg leading-relaxed font-semibold">
              All participation occurs within a simulated environment.
            </p>
          </div>

          {/* CTA */}
          <div className="text-center py-8">
            <Link
              href="/purchase"
              className="bg-exodus-light-blue hover:bg-blue-400 text-white px-8 py-4 rounded-lg font-semibold text-base md:text-lg transition shadow-lg inline-block"
            >
              START YOUR CHALLENGE
            </Link>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-exodus-dark py-8 md:py-12 px-4 border-t border-exodus-light-blue/20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image
              src="/logo.png"
              alt="Exodus Logo"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <span className="text-xl font-bold text-white">exodus</span>
          </div>
          <p className="text-gray-400 text-xs md:text-sm mb-4">
            © {new Date().getFullYear()} EXODUS TRADING LTD. All rights reserved.
          </p>
          <div className="flex justify-center gap-4 md:gap-6 text-gray-400 text-xs md:text-sm">
            <Link href="/terms" className="hover:text-exodus-light-blue transition">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-exodus-light-blue transition">
              Privacy
            </Link>
            <Link href="/refund" className="hover:text-exodus-light-blue transition">
              Refund Policy
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

