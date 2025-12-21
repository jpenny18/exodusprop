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
            How We Pay Traders
          </h1>
          <p className="text-lg md:text-2xl text-gray-200">
            Transparent, rule-based performance payouts
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-4xl mx-auto space-y-8 md:space-y-12">
          
          {/* Introduction */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 border-t-4 border-exodus-light-blue">
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              At ExodusProp, our goal is simple: create a transparent, rule-based performance program where traders clearly understand how payouts work, where they come from, and what to expect.
            </p>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed mt-4 font-semibold text-exodus-dark">
              We believe clarity builds trust — especially for a new firm.
            </p>
          </div>

          {/* Simulated Trading Environment */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-exodus-dark mb-4 md:mb-6">
              Simulated Trading Environment
            </h2>
            <div className="space-y-3 md:space-y-4 text-gray-700 text-base md:text-lg leading-relaxed">
              <p>
                All accounts operated through ExodusProp are <span className="font-semibold text-exodus-dark">simulated trading environments</span>.
              </p>
              <p>
                We are not a broker, do not accept deposits, and do not place trades on behalf of users.
              </p>
              <p>
                Payouts are performance-based rewards tied to simulated account results and are governed by the rules outlined in our program.
              </p>
            </div>
          </div>

          {/* Payout Reserve */}
          <div className="bg-gradient-to-br from-exodus-blue to-exodus-dark rounded-2xl shadow-xl p-6 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6">
              Our Payout Reserve
            </h2>
            <p className="text-base md:text-lg text-gray-200 leading-relaxed mb-6">
              To ensure payouts are processed reliably and without dependence on future sales, ExodusProp maintains a dedicated payout reserve.
            </p>
            <div className="bg-white/10 backdrop-blur-sm border-2 border-exodus-light-blue rounded-xl p-6 md:p-8 text-center">
              <p className="text-sm md:text-base text-exodus-light-blue font-semibold mb-2">
                Current Payout Reserve:
              </p>
              <p className="text-4xl md:text-6xl font-bold text-white">
                $70,000
              </p>
              <p className="text-xs md:text-sm text-gray-300 mt-3">
                USD
              </p>
            </div>
            <p className="text-base md:text-lg text-gray-200 leading-relaxed mt-6">
              This reserve is separate from operational expenses and exists solely to process approved payout requests.
            </p>
          </div>

          {/* What the Reserve Covers */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-exodus-dark mb-4 md:mb-6">
              What the Reserve Covers
            </h2>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6">
              Based on historical prop firm data and conservative assumptions, our reserve is designed to cover multiple payout requests on the same day.
            </p>
            
            <div className="bg-gray-50 rounded-xl p-5 md:p-6 mb-6">
              <h3 className="text-lg md:text-xl font-bold text-exodus-dark mb-4">
                Typical First Payout Ranges
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="text-sm md:text-base text-gray-700">50K performance tier:</span>
                  <span className="text-sm md:text-base font-semibold text-exodus-dark">~$1,000 – $2,000</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="text-sm md:text-base text-gray-700">100K performance tier:</span>
                  <span className="text-sm md:text-base font-semibold text-exodus-dark">~$2,000 – $4,000</span>
                </div>
                <div className="flex justify-between items-center pb-2">
                  <span className="text-sm md:text-base text-gray-700">200K performance tier:</span>
                  <span className="text-sm md:text-base font-semibold text-exodus-dark">~$4,000 – $8,000</span>
                </div>
              </div>
            </div>

            <div className="bg-exodus-light-blue/10 border-l-4 border-exodus-light-blue rounded-lg p-5 md:p-6">
              <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-3">
                Across all tiers, the average first payout is approximately <span className="font-bold text-exodus-dark">$3,300</span>.
              </p>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                With a $70,000 reserve, we can comfortably process:
              </p>
              <ul className="mt-3 space-y-2 ml-4">
                <li className="flex items-start gap-2 text-sm md:text-base text-gray-700">
                  <span className="text-exodus-light-blue font-bold">✓</span>
                  <span>20+ average-sized payouts in a single day, or</span>
                </li>
                <li className="flex items-start gap-2 text-sm md:text-base text-gray-700">
                  <span className="text-exodus-light-blue font-bold">✓</span>
                  <span>10–12 higher-tier payouts simultaneously</span>
                </li>
              </ul>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed mt-4 font-semibold">
                This means payouts are not dependent on new challenge purchases and are handled from an existing reserve.
              </p>
            </div>
          </div>

          {/* How Payout Requests Are Processed */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-exodus-dark mb-4 md:mb-6">
              How Payout Requests Are Processed
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-exodus-light-blue rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm md:text-base">1</span>
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-base md:text-lg text-gray-700">
                    Trader submits a payout request from their dashboard.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-exodus-light-blue rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm md:text-base">2</span>
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-base md:text-lg text-gray-700 mb-2">
                    The account is reviewed for:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li className="text-sm md:text-base text-gray-600">• Rule compliance</li>
                    <li className="text-sm md:text-base text-gray-600">• Trade integrity</li>
                    <li className="text-sm md:text-base text-gray-600">• Risk adherence</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-exodus-light-blue rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm md:text-base">3</span>
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-base md:text-lg text-gray-700">
                    Approved payouts are processed from the reserve.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-gray-50 rounded-xl p-5 md:p-6">
              <h3 className="text-lg md:text-xl font-bold text-exodus-dark mb-3">
                Processing Schedule
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm md:text-base text-gray-700">
                  <span className="text-exodus-light-blue font-bold">✓</span>
                  <span>Payout requests are reviewed daily</span>
                </li>
                <li className="flex items-start gap-2 text-sm md:text-base text-gray-700">
                  <span className="text-exodus-light-blue font-bold">✓</span>
                  <span>Approved payouts are processed within 1-3 hours</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-2xl p-6 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-yellow-900 mb-4 md:mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Important Notes
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm md:text-base text-gray-800">
                <span className="font-bold">•</span>
                <span>Passing a challenge or holding a performance account does not guarantee a payout</span>
              </li>
              <li className="flex items-start gap-2 text-sm md:text-base text-gray-800">
                <span className="font-bold">•</span>
                <span>Payouts are discretionary and rule-based</span>
              </li>
              <li className="flex items-start gap-2 text-sm md:text-base text-gray-800">
                <span className="font-bold">•</span>
                <span>Violations of trading rules void payout eligibility</span>
              </li>
              <li className="flex items-start gap-2 text-sm md:text-base text-gray-800">
                <span className="font-bold">•</span>
                <span>All payouts are tied to simulated performance outcomes</span>
              </li>
            </ul>
            <p className="text-sm md:text-base text-gray-800 mt-6 font-semibold">
              We publish this page so traders understand exactly how payouts work before participating.
            </p>
          </div>

          {/* Performance Math Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-exodus-dark mb-4 md:mb-6">
              Understanding Payouts: The Reality
            </h2>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6">
              Most traders have heard extreme claims in the prop firm industry. We prefer to share realistic performance data and math, so expectations are clear.
            </p>

            <h3 className="text-xl md:text-2xl font-bold text-exodus-dark mb-4">
              Challenge Pass Rates (Industry Reality)
            </h3>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4">
              Across the prop trading industry, typical outcomes are:
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2 text-sm md:text-base text-gray-700">
                <span className="text-exodus-light-blue font-bold">•</span>
                <span>3–5% of traders successfully complete a challenge</span>
              </li>
              <li className="flex items-start gap-2 text-sm md:text-base text-gray-700">
                <span className="text-exodus-light-blue font-bold">•</span>
                <span>Of those who pass, approximately 40–60% request a payout</span>
              </li>
              <li className="flex items-start gap-2 text-sm md:text-base text-gray-700">
                <span className="text-exodus-light-blue font-bold">•</span>
                <span>Many traders stop trading, violate rules, or reset before requesting payouts</span>
              </li>
            </ul>
            <p className="text-sm md:text-base text-gray-600 italic">
              This is normal and expected behavior across all firms.
            </p>
          </div>

          <div className="bg-exodus-dark rounded-2xl shadow-xl p-6 md:p-10 text-white">
            <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
              What This Means in Practice
            </h3>
            <p className="text-base md:text-lg text-gray-200 mb-4">
              For every 100 challenges sold:
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 md:p-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm md:text-base text-gray-200">Traders who pass:</span>
                <span className="text-lg md:text-xl font-bold text-exodus-light-blue">~4</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm md:text-base text-gray-200">Traders who request payout:</span>
                <span className="text-lg md:text-xl font-bold text-exodus-light-blue">~2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm md:text-base text-gray-200">Average payout per trader:</span>
                <span className="text-lg md:text-xl font-bold text-exodus-light-blue">$3,300</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-white/20">
                <span className="text-sm md:text-base text-white font-semibold">Total payout obligation:</span>
                <span className="text-xl md:text-2xl font-bold text-white">$6,600</span>
              </div>
            </div>
            <p className="text-base md:text-lg text-gray-200 leading-relaxed mt-6">
              This structure allows payout reserves to remain stable and predictable.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
            <h3 className="text-xl md:text-2xl font-bold text-exodus-dark mb-4">
              Why This Matters for Traders
            </h3>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4">
              Because payouts are statistically infrequent and rule-dependent:
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2 text-sm md:text-base text-gray-700">
                <span className="text-exodus-light-blue font-bold">✓</span>
                <span>ExodusProp can maintain a pre-funded reserve</span>
              </li>
              <li className="flex items-start gap-2 text-sm md:text-base text-gray-700">
                <span className="text-exodus-light-blue font-bold">✓</span>
                <span>Payouts are not reliant on new users</span>
              </li>
              <li className="flex items-start gap-2 text-sm md:text-base text-gray-700">
                <span className="text-exodus-light-blue font-bold">✓</span>
                <span>Processing is not delayed by sales cycles</span>
              </li>
            </ul>
            <p className="text-base md:text-lg text-exodus-dark font-semibold">
              This is how long-term prop firms survive.
            </p>
          </div>

          <div className="bg-gradient-to-br from-exodus-light-blue to-blue-600 rounded-2xl shadow-xl p-6 md:p-10 text-white text-center">
            <h3 className="text-xl md:text-2xl font-bold mb-4">
              Why We Share This
            </h3>
            <p className="text-base md:text-lg leading-relaxed">
              We do not believe in hiding the math. Understanding the reality of challenge completion and payout frequency helps traders make informed decisions and reduces unrealistic expectations.
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

