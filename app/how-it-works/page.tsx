"use client";

import Image from "next/image";
import Link from "next/link";

export default function HowItWorks() {
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
            How It Works
          </h1>
          <p className="text-lg md:text-2xl text-gray-200">
            Your journey from challenge to funded trader
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          
          {/* Step 1 */}
          <div className="relative mb-12 md:mb-16">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border-t-4 border-exodus-light-blue">
              <div className="flex items-start gap-4 md:gap-6 mb-6">
                <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-exodus-light-blue to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl md:text-3xl">1</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl md:text-4xl font-bold text-exodus-dark mb-3 md:mb-4">
                    Select Your Challenge Size
                  </h2>
                  <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4">
                    Choose from our available account sizes based on your trading experience and goals:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4">
                    <div className="bg-exodus-light-blue/10 rounded-lg p-3 md:p-4 text-center border-2 border-exodus-light-blue">
                      <p className="text-lg md:text-2xl font-bold text-exodus-dark">$25K</p>
                      <p className="text-xs md:text-sm text-gray-600">$247</p>
                    </div>
                    <div className="bg-exodus-light-blue/10 rounded-lg p-3 md:p-4 text-center border-2 border-exodus-light-blue">
                      <p className="text-lg md:text-2xl font-bold text-exodus-dark">$50K</p>
                      <p className="text-xs md:text-sm text-gray-600">$399</p>
                    </div>
                    <div className="bg-exodus-light-blue/10 rounded-lg p-3 md:p-4 text-center border-2 border-exodus-light-blue">
                      <p className="text-lg md:text-2xl font-bold text-exodus-dark">$100K</p>
                      <p className="text-xs md:text-sm text-gray-600">$699</p>
                    </div>
                    <div className="bg-exodus-light-blue/10 rounded-lg p-3 md:p-4 text-center border-2 border-exodus-light-blue">
                      <p className="text-lg md:text-2xl font-bold text-exodus-dark">$200K</p>
                      <p className="text-xs md:text-sm text-gray-600">$1,499</p>
                    </div>
                  </div>
                  <p className="text-sm md:text-base text-gray-600 italic">
                    All challenges are 1-step evaluations with clear, trader-friendly rules.
                  </p>
                </div>
              </div>
            </div>
            {/* Connecting Line */}
            <div className="hidden md:block absolute left-8 top-full w-1 h-12 bg-gradient-to-b from-exodus-light-blue to-transparent"></div>
          </div>

          {/* Step 2 */}
          <div className="relative mb-12 md:mb-16">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border-t-4 border-exodus-light-blue">
              <div className="flex items-start gap-4 md:gap-6 mb-6">
                <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-exodus-light-blue to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl md:text-3xl">2</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl md:text-4xl font-bold text-exodus-dark mb-3 md:mb-4">
                    Purchase Your Challenge
                  </h2>
                  <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4">
                    Complete your purchase securely through our payment portal. We accept:
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start gap-2 text-sm md:text-base text-gray-700">
                      <span className="text-exodus-light-blue font-bold">✓</span>
                      <span>Credit & Debit Cards</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm md:text-base text-gray-700">
                      <span className="text-exodus-light-blue font-bold">✓</span>
                      <span>Cryptocurrency (Bitcoin, USDT, and more)</span>
                    </li>
                  </ul>
                  <div className="bg-exodus-light-blue/10 border-l-4 border-exodus-light-blue rounded-lg p-4 md:p-5">
                    <p className="text-sm md:text-base text-gray-700">
                      <span className="font-semibold">Note:</span> Challenge fees are one-time, non-refundable payments for platform access and evaluation services.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Connecting Line */}
            <div className="hidden md:block absolute left-8 top-full w-1 h-12 bg-gradient-to-b from-exodus-light-blue to-transparent"></div>
          </div>

          {/* Step 3 */}
          <div className="relative mb-12 md:mb-16">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border-t-4 border-exodus-light-blue">
              <div className="flex items-start gap-4 md:gap-6 mb-6">
                <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-exodus-light-blue to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl md:text-3xl">3</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl md:text-4xl font-bold text-exodus-dark mb-3 md:mb-4">
                    Receive Account Credentials
                  </h2>
                  <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4">
                    After purchase, you'll receive:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-lg p-4 md:p-5">
                      <h3 className="font-bold text-exodus-dark mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5 text-exodus-light-blue" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M2.94 6.412A2 2 0 002 8.108V16a2 2 0 002 2h12a2 2 0 002-2V8.108a2 2 0 00-.94-1.696l-6-3.75a2 2 0 00-2.12 0l-6 3.75zm2.615 2.423a1 1 0 10-1.11 1.664l5 3.333a1 1 0 001.11 0l5-3.333a1 1 0 00-1.11-1.664L10 11.798 5.555 8.835z" clipRule="evenodd" />
                        </svg>
                        Email Confirmation
                      </h3>
                      <p className="text-xs md:text-sm text-gray-600">Your trading credentials sent instantly</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 md:p-5">
                      <h3 className="font-bold text-exodus-dark mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5 text-exodus-light-blue" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Dashboard Access
                      </h3>
                      <p className="text-xs md:text-sm text-gray-600">Login to view your account details</p>
                    </div>
                  </div>
                  <p className="text-sm md:text-base text-gray-600">
                    You can start trading immediately after receiving your credentials.
                  </p>
                </div>
              </div>
            </div>
            {/* Connecting Line */}
            <div className="hidden md:block absolute left-8 top-full w-1 h-12 bg-gradient-to-b from-exodus-light-blue to-transparent"></div>
          </div>

          {/* Step 4 */}
          <div className="relative mb-12 md:mb-16">
            <div className="bg-gradient-to-br from-exodus-blue to-exodus-dark rounded-2xl shadow-xl p-6 md:p-10 text-white">
              <div className="flex items-start gap-4 md:gap-6 mb-6">
                <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/50">
                  <span className="text-white font-bold text-xl md:text-3xl">4</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4">
                    Trade Your Challenge
                  </h2>
                  <p className="text-base md:text-lg text-gray-200 leading-relaxed mb-4">
                    Now comes the important part - prove your trading skill:
                  </p>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 md:p-6 mb-4">
                    <h3 className="text-lg md:text-xl font-bold mb-3">Challenge Requirements:</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm md:text-base">Profit Target:</span>
                        <span className="text-lg md:text-xl font-bold text-exodus-light-blue">8%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm md:text-base">Max Daily Loss:</span>
                        <span className="text-lg md:text-xl font-bold">4%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm md:text-base">Max Total Loss:</span>
                        <span className="text-lg md:text-xl font-bold">6% (Static)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm md:text-base">Time Limit:</span>
                        <span className="text-lg md:text-xl font-bold text-exodus-light-blue">None!</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm md:text-base text-gray-200 italic">
                    Trade with freedom - no minimum days, no consistency rules, just reach your profit target while following risk management.
                  </p>
                </div>
              </div>
            </div>
            {/* Connecting Line */}
            <div className="hidden md:block absolute left-8 top-full w-1 h-12 bg-gradient-to-b from-exodus-light-blue to-transparent"></div>
          </div>

          {/* Step 5 */}
          <div className="relative mb-12 md:mb-16">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border-t-4 border-exodus-light-blue">
              <div className="flex items-start gap-4 md:gap-6 mb-6">
                <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-exodus-light-blue to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl md:text-3xl">5</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl md:text-4xl font-bold text-exodus-dark mb-3 md:mb-4">
                    Pass & Get Funded
                  </h2>
                  <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4">
                    Once you hit the 8% profit target while following all rules:
                  </p>
                  <div className="bg-gradient-to-r from-exodus-light-blue/20 to-blue-100 rounded-xl p-5 md:p-6 mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <svg className="w-8 h-8 text-exodus-light-blue" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <h3 className="text-lg md:text-xl font-bold text-exodus-dark">Challenge Passed!</h3>
                    </div>
                    <p className="text-sm md:text-base text-gray-700">
                      You're now eligible for a performance account and can start earning real profits.
                    </p>
                  </div>
                  <p className="text-sm md:text-base text-gray-600">
                    Your performance account will be set up with the same balance as your challenge size.
                  </p>
                </div>
              </div>
            </div>
            {/* Connecting Line */}
            <div className="hidden md:block absolute left-8 top-full w-1 h-12 bg-gradient-to-b from-exodus-light-blue to-transparent"></div>
          </div>

          {/* Step 6 */}
          <div className="relative mb-12 md:mb-16">
            <div className="bg-gradient-to-br from-exodus-light-blue to-blue-600 rounded-2xl shadow-xl p-6 md:p-10 text-white">
              <div className="flex items-start gap-4 md:gap-6 mb-6">
                <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/50">
                  <span className="text-white font-bold text-xl md:text-3xl">6</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4">
                    Trade Your Funded Account
                  </h2>
                  <p className="text-base md:text-lg leading-relaxed mb-4">
                    Continue trading with the same rules. Key benefits:
                  </p>
                  <ul className="space-y-3 mb-4">
                    <li className="flex items-start gap-2 text-sm md:text-base">
                      <span className="font-bold text-xl">✓</span>
                      <span>Keep up to <span className="font-bold">90% of your profits</span></span>
                    </li>
                    <li className="flex items-start gap-2 text-sm md:text-base">
                      <span className="font-bold text-xl">✓</span>
                      <span>No profit caps or withdrawal limits</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm md:text-base">
                      <span className="font-bold text-xl">✓</span>
                      <span>Same trader-friendly rules</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm md:text-base">
                      <span className="font-bold text-xl">✓</span>
                      <span>Scale up to larger account sizes</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* Connecting Line */}
            <div className="hidden md:block absolute left-8 top-full w-1 h-12 bg-gradient-to-b from-exodus-light-blue to-transparent"></div>
          </div>

          {/* Step 7 */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border-t-4 border-exodus-light-blue">
              <div className="flex items-start gap-4 md:gap-6 mb-6">
                <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-exodus-light-blue to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl md:text-3xl">7</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl md:text-4xl font-bold text-exodus-dark mb-3 md:mb-4">
                    Request Payouts On-Demand
                  </h2>
                  <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4">
                    This is what it's all about - getting paid for your trading success:
                  </p>
                  <div className="bg-gradient-to-r from-exodus-light-blue/10 to-blue-50 rounded-xl p-5 md:p-6 mb-4">
                    <h3 className="text-lg md:text-xl font-bold text-exodus-dark mb-3">Payout Process:</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-exodus-light-blue text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                        <p className="text-sm md:text-base text-gray-700">Submit payout request from your dashboard</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-exodus-light-blue text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                        <p className="text-sm md:text-base text-gray-700">Account reviewed for rule compliance</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-exodus-light-blue text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                        <p className="text-sm md:text-base text-gray-700">Approved payouts processed promptly</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-exodus-dark text-white rounded-xl p-5 md:p-6">
                    <p className="text-sm md:text-base leading-relaxed mb-3">
                      <span className="font-bold">All payouts are made in USDT on the Tron network.</span>
                    </p>
                    <p className="text-xs md:text-sm text-gray-300">
                      Request payouts whenever you want - daily, weekly, or as often as you prefer!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center bg-gradient-to-br from-exodus-blue to-exodus-dark rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-base md:text-lg text-gray-200 mb-6 max-w-2xl mx-auto">
              Join successful traders who are already earning with Exodus. Select your challenge size and begin today.
            </p>
            <Link
              href="/purchase"
              className="bg-exodus-light-blue hover:bg-blue-400 text-white px-8 py-4 rounded-lg font-semibold text-base md:text-lg transition shadow-lg inline-block"
            >
              GET STARTED NOW
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

