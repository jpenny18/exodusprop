"use client";

import Image from "next/image";
import Link from "next/link";

export default function RulesAndObjectives() {
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
            Rules & Objectives
          </h1>
          <p className="text-lg md:text-2xl text-gray-200">
            Clear guidelines for challenge success
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-4xl mx-auto space-y-8 md:space-y-12">
          
          {/* Introduction */}
          <div className="bg-gradient-to-br from-exodus-blue to-exodus-dark rounded-2xl shadow-xl p-6 md:p-10 text-white">
            <div className="flex items-start gap-4 mb-4">
              <svg className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-3">
                  Important Notice
                </h2>
                <p className="text-base md:text-lg leading-relaxed">
                  All traders must follow the rules below exactly. Failure to comply results in challenge failure or payout disqualification.
                </p>
              </div>
            </div>
          </div>

          {/* Account Type */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 border-t-4 border-exodus-light-blue">
            <h2 className="text-2xl md:text-3xl font-bold text-exodus-dark mb-4 md:mb-6">
              Account Type
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-base md:text-lg text-gray-700">
                <span className="text-exodus-light-blue font-bold">✓</span>
                <span>Simulated trading account</span>
              </li>
              <li className="flex items-start gap-2 text-base md:text-lg text-gray-700">
                <span className="text-exodus-light-blue font-bold">✓</span>
                <span>Standard contract sizing based on selected tier</span>
              </li>
              <li className="flex items-start gap-2 text-base md:text-lg text-gray-700">
                <span className="text-exodus-light-blue font-bold">✓</span>
                <span>No minimum trading days unless stated otherwise</span>
              </li>
            </ul>
          </div>

          {/* Profit Target */}
          <div className="bg-gradient-to-br from-exodus-light-blue to-blue-600 rounded-2xl shadow-xl p-6 md:p-10 text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
              Profit Target
            </h2>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 md:p-8 text-center mb-6">
              <p className="text-5xl md:text-7xl font-bold mb-2">8%</p>
              <p className="text-base md:text-lg">Profit Target</p>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-base md:text-lg">
                <span className="font-bold">•</span>
                <span>Calculated from the starting account balance</span>
              </li>
              <li className="flex items-start gap-2 text-base md:text-lg">
                <span className="font-bold">•</span>
                <span>Must be achieved without violating drawdown limits</span>
              </li>
            </ul>
          </div>

          {/* Drawdown Rules */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-exodus-dark mb-6 md:mb-8">
              Drawdown Rules
            </h2>
            
            {/* Daily Loss Limit */}
            <div className="mb-8 bg-gray-50 rounded-xl p-5 md:p-6">
              <h3 className="text-xl md:text-2xl font-bold text-exodus-dark mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-exodus-dark" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                Daily Loss Limit
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-exodus-dark text-white px-4 py-2 rounded-lg font-bold text-xl md:text-2xl">
                    4%
                  </div>
                  <span className="text-base md:text-lg text-gray-700">Maximum daily loss</span>
                </div>
                <ul className="space-y-2 ml-2">
                  <li className="flex items-start gap-2 text-sm md:text-base text-gray-600">
                    <span className="font-bold">•</span>
                    <span>Based on the account's starting balance</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm md:text-base text-gray-600">
                    <span className="font-bold">•</span>
                    <span>Includes both closed and floating P&L</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm md:text-base text-gray-600">
                    <span className="font-bold">•</span>
                    <span>Resets at 00:00 UTC each day</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Maximum Loss Limit */}
            <div className="bg-exodus-light-blue/10 border-2 border-exodus-light-blue rounded-xl p-5 md:p-6">
              <h3 className="text-xl md:text-2xl font-bold text-exodus-dark mb-4 flex items-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                </svg>
                Maximum Loss Limit (Static)
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-exodus-dark text-white px-4 py-2 rounded-lg font-bold text-xl md:text-2xl">
                    6%
                  </div>
                  <span className="text-base md:text-lg text-gray-800 font-semibold">Maximum total loss</span>
                </div>
                <ul className="space-y-2 ml-2">
                  <li className="flex items-start gap-2 text-sm md:text-base text-gray-700">
                    <span className="font-bold">•</span>
                    <span><span className="font-semibold">Static drawdown</span> (not trailing)</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm md:text-base text-gray-700">
                    <span className="font-bold">•</span>
                    <span>Account must never fall below this threshold</span>
                  </li>
                </ul>
                
                {/* Example Box */}
                <div className="bg-white border-2 border-exodus-light-blue rounded-lg p-4 md:p-5 mt-4">
                  <h4 className="text-base md:text-lg font-bold text-exodus-dark mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Example: $100K Account
                  </h4>
                  <div className="space-y-3 text-sm md:text-base text-gray-700 leading-relaxed">
                    <p>
                      On a <span className="font-semibold">$100k account</span>, you can lose up to <span className="font-semibold text-exodus-dark">$6,000</span> from your starting balance.
                    </p>
                    <p>
                      If you grow the account to <span className="font-semibold text-exodus-light-blue">$107k</span> (7% profit), your minimum allowed balance remains <span className="font-semibold">$94k</span> ($100k - $6k).
                    </p>
                    <p className="bg-exodus-light-blue/10 border-l-4 border-exodus-light-blue pl-3 py-2">
                      This means you could technically lose <span className="font-semibold">$13k</span> from your peak of $107k and still be within the rules, as long as you don't drop below the initial $94k threshold and/or violate the max daily loss in doing so.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trading Behavior */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 border-l-4 border-exodus-dark">
            <h2 className="text-2xl md:text-3xl font-bold text-exodus-dark mb-4 md:mb-6">
              Trading Behavior
            </h2>
            <p className="text-base md:text-lg text-gray-700 mb-4 font-semibold">
              The following are NOT permitted:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-base md:text-lg text-gray-700">
                <span className="text-exodus-dark font-bold">✗</span>
                <span>Account sharing</span>
              </li>
              <li className="flex items-start gap-2 text-base md:text-lg text-gray-700">
                <span className="text-exodus-dark font-bold">✗</span>
                <span>Copy trading between users</span>
              </li>
              <li className="flex items-start gap-2 text-base md:text-lg text-gray-700">
                <span className="text-exodus-dark font-bold">✗</span>
                <span>Trade manipulation</span>
              </li>
              <li className="flex items-start gap-2 text-base md:text-lg text-gray-700">
                <span className="text-exodus-dark font-bold">✗</span>
                <span>Exploiting platform latency or pricing errors</span>
              </li>
              <li className="flex items-start gap-2 text-base md:text-lg text-gray-700">
                <span className="text-exodus-dark font-bold">✗</span>
                <span>Abusive or high-frequency strategies designed to bypass risk controls</span>
              </li>
            </ul>
          </div>

          {/* News & Holding Trades */}
          <div className="bg-gradient-to-br from-exodus-blue to-exodus-dark rounded-2xl shadow-xl p-6 md:p-10 text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
              News & Holding Trades
            </h2>
            <p className="text-base md:text-lg text-gray-200 mb-4">
              Unless otherwise stated:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-base md:text-lg">
                <span className="text-exodus-light-blue font-bold text-xl">✓</span>
                <span>Trading during news events is <span className="font-bold">permitted</span></span>
              </li>
              <li className="flex items-start gap-2 text-base md:text-lg">
                <span className="text-exodus-light-blue font-bold text-xl">✓</span>
                <span>Holding trades overnight and over weekends is <span className="font-bold">permitted</span></span>
              </li>
            </ul>
            <p className="text-sm md:text-base text-gray-300 mt-4 italic">
              (Any exceptions will be clearly disclosed.)
            </p>
          </div>

          {/* Passing the Challenge */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-exodus-dark mb-4 md:mb-6">
              Passing the Challenge
            </h2>
            <p className="text-base md:text-lg text-gray-700 mb-6">
              A challenge is considered passed when:
            </p>
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-exodus-light-blue rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-base md:text-lg text-gray-700 pt-1">
                  The profit target is met
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-exodus-light-blue rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-base md:text-lg text-gray-700 pt-1">
                  All drawdown rules are respected
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-exodus-light-blue rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-base md:text-lg text-gray-700 pt-1">
                  No prohibited behavior is detected
                </p>
              </div>
            </div>
            <div className="bg-exodus-light-blue/10 border-2 border-exodus-light-blue rounded-xl p-5 md:p-6">
              <p className="text-base md:text-lg text-gray-800 font-semibold">
                Passing a challenge grants eligibility to request a performance account.
              </p>
            </div>
          </div>

          {/* Performance Accounts & Payouts */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 border-t-4 border-exodus-light-blue">
            <h2 className="text-2xl md:text-3xl font-bold text-exodus-dark mb-4 md:mb-6">
              Performance Accounts & Payouts
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-base md:text-lg text-gray-700">
                <span className="text-exodus-light-blue font-bold">•</span>
                <span>Performance accounts remain simulated</span>
              </li>
              <li className="flex items-start gap-2 text-base md:text-lg text-gray-700">
                <span className="text-exodus-light-blue font-bold">•</span>
                <span>Traders must continue following all rules</span>
              </li>
              <li className="flex items-start gap-2 text-base md:text-lg text-gray-700">
                <span className="text-exodus-light-blue font-bold">•</span>
                <span>Payout eligibility is based on ongoing compliance</span>
              </li>
              <li className="flex items-start gap-2 text-base md:text-lg text-gray-700">
                <span className="text-exodus-dark font-bold">•</span>
                <span className="font-semibold">Violations void payout eligibility</span>
              </li>
            </ul>
          </div>

          {/* Quick Reference Card */}
          <div className="bg-gradient-to-br from-exodus-light-blue to-blue-600 rounded-2xl shadow-xl p-6 md:p-10 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center">
              Quick Reference
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-5">
                <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Allowed
                </h4>
                <ul className="space-y-2 text-sm md:text-base">
                  <li>✓ News trading</li>
                  <li>✓ Weekend holding</li>
                  <li>✓ EAs and bots</li>
                  <li>✓ All trading styles</li>
                </ul>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-5">
                <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Not Allowed
                </h4>
                <ul className="space-y-2 text-sm md:text-base">
                  <li>✗ Account sharing</li>
                  <li>✗ Copy trading</li>
                  <li>✗ Manipulation</li>
                  <li>✗ Exploiting errors</li>
                </ul>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-5">
                <h4 className="font-bold text-lg mb-2">Profit Target</h4>
                <p className="text-3xl font-bold">8%</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-5">
                <h4 className="font-bold text-lg mb-2">Max Drawdown</h4>
                <p className="text-xl font-bold mb-1">Daily: 4%</p>
                <p className="text-xl font-bold">Total: 6%</p>
              </div>
            </div>
          </div>

          {/* Final Disclaimer */}
          <div className="bg-gray-100 border-2 border-gray-300 rounded-2xl p-6 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
              Final Disclaimer
            </h2>
            <div className="space-y-4 text-sm md:text-base text-gray-700 leading-relaxed">
              <p>
                ExodusProp is an educational and analytical platform. We do not offer investment advice, brokerage services, or guaranteed outcomes.
              </p>
              <p className="font-semibold text-gray-900">
                Trading carries risk. Past simulated performance does not indicate future results.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center py-8">
            <Link
              href="/purchase"
              className="bg-exodus-light-blue hover:bg-blue-400 text-white px-8 py-4 rounded-lg font-semibold text-base md:text-lg transition shadow-lg inline-block mb-4"
            >
              START YOUR CHALLENGE
            </Link>
            <p className="text-sm md:text-base text-gray-600">
              Read and understand all rules before purchasing
            </p>
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

