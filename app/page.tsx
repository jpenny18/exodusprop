"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openLearnDropdown, setOpenLearnDropdown] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(0);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const toggleTooltip = (id: string) => {
    setActiveTooltip(activeTooltip === id ? null : id);
  };

  const tooltips = {
    profitShare: "You keep up to 90% of all profits you generate while trading the funded account. We believe in rewarding successful traders.",
    step1Goal: "The profit target you need to achieve to pass the evaluation. Once you hit 8% profit, you qualify for a funded account.",
    step2Goal: "Not applicable for 1-step evaluations. You only need to pass one phase before receiving your funded account.",
    dailyLoss: "The maximum loss allowed in a single trading day. If your daily loss exceeds 4% of the account balance, the evaluation ends. Resets at 00:00 UTC.",
    maxDrawdown: "The maximum total loss allowed from your initial starting balance. This is static, meaning it never trails up with your profits. Example: On a $100k account, you can lose up to $6,000 from your starting balance. If you grow the account to $107k (7% profit), your minimum allowed balance remains $94k ($100k - $6k). This means you could technically lose $13k from your peak of $107k and still be within the rules, as long as you don't drop below the initial $94k threshold and/or violate the max daily loss in doing so.",
    leverage: "The maximum leverage ratio available for your trades. 1:100 leverage means you can control $100 for every $1 in your account.",
    evaluationFee: "The one-time fee to start your evaluation. This covers your access to the trading platform and evaluation process. Non-refundable."
  };

  // Popular forex pairs for the ticker
  const forexPairs = [
    { pair: "EUR/USD", price: "1.0582", change: "+0.24%" },
    { pair: "GBP/USD", price: "1.2648", change: "+0.18%" },
    { pair: "USD/JPY", price: "149.82", change: "-0.12%" },
    { pair: "AUD/USD", price: "0.6521", change: "+0.31%" },
    { pair: "USD/CAD", price: "1.3642", change: "-0.08%" },
    { pair: "NZD/USD", price: "0.5892", change: "+0.22%" },
    { pair: "EUR/GBP", price: "0.8367", change: "+0.06%" },
    { pair: "USD/CHF", price: "0.8821", change: "-0.15%" },
    { pair: "EUR/JPY", price: "158.52", change: "+0.11%" },
    { pair: "GBP/JPY", price: "189.42", change: "+0.05%" },
  ];

  const challenges = [
    { size: "$25,000", price: "$247", dailyLoss: "$1,000", maxDrawdown: "$1,500" },
    { size: "$50,000", price: "$399", dailyLoss: "$2,000", maxDrawdown: "$3,000" },
    { size: "$100,000", price: "$699", dailyLoss: "$4,000", maxDrawdown: "$6,000" },
    { size: "$200,000", price: "$1,499", dailyLoss: "$8,000", maxDrawdown: "$12,000" },
  ];

  const faqs = [
    {
      question: "How does the 1-step evaluation work?",
      answer:
        "Simply achieve the 8% profit target while following our risk management rules (4% max daily loss, 6% max total loss). Once you pass, you receive your funded account immediately.",
    },
    {
      question: "When can I request payouts?",
      answer:
        "Payouts are on-demand! You can request a payout whenever you want. All payouts are processed exclusively in USDT on the Tron network.",
    },
    {
      question: "Can I use EAs and trading bots?",
      answer:
        "Absolutely! We allow EAs, bots, news trading, and holding positions over the weekend. Trade with complete freedom using your preferred strategy.",
    },
    {
      question: "What is the max daily loss?",
      answer:
        "The maximum daily loss is 4% of your account balance. This resets at 00:00 UTC each day.",
    },
    {
      question: "Is the max loss trailing or static?",
      answer:
        "The 6% max loss is static and calculated from your initial account balance, not trailing. This gives you more flexibility in your trading.",
    },
    {
      question: "What leverage do you offer?",
      answer:
        "All accounts come with 1:100 leverage, giving you the flexibility to trade with substantial buying power.",
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-exodus-blue/95 backdrop-blur-sm z-50 border-b border-exodus-light-blue/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex items-center gap-4 md:gap-8">
              <div className="flex items-center gap-3 md:gap-6 p-4 md:p-6">
                <Image
                  src="/logo.png"
                  alt="Exodus Logo"
                  width={120}
                  height={120}
                  priority
                  className="h-16 md:h-28 w-auto"
                />
              </div>
              <div className="hidden md:flex items-center gap-8">
                <a href="#faq" className="text-white hover:text-exodus-light-blue transition text-sm">
                  FAQ
                </a>
                <div className="relative">
                  <button
                    onClick={() => setOpenLearnDropdown(!openLearnDropdown)}
                    className="text-white hover:text-exodus-light-blue transition flex items-center gap-1 text-sm"
                  >
                    LEARN
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {openLearnDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2">
                      <a
                        href="#"
                        className="block px-4 py-2 text-exodus-dark hover:bg-gray-100 text-sm"
                      >
                        Trading Rules
                      </a>
                      <a
                        href="#"
                        className="block px-4 py-2 text-exodus-dark hover:bg-gray-100 text-sm"
                      >
                        How It Works
                      </a>
                      <a
                        href="#"
                        className="block px-4 py-2 text-exodus-dark hover:bg-gray-100 text-sm"
                      >
                        Resources
                      </a>
                    </div>
                  )}
                </div>
                <a href="#contact" className="text-white hover:text-exodus-light-blue transition text-sm">
                  CONTACT
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-4">
                <a href="/auth" className="text-white hover:text-exodus-light-blue transition font-semibold text-sm">
                  LOG IN
                </a>
                <a href="/auth" className="bg-exodus-light-blue hover:bg-blue-400 text-white px-5 py-2 rounded-lg font-semibold transition text-sm">
                  SIGN UP
                </a>
              </div>
              {/* Mobile Sign Up Button */}
              <a href="/auth" className="md:hidden bg-exodus-light-blue hover:bg-blue-400 text-white px-4 py-2 rounded-lg font-semibold transition text-xs">
                SIGN UP
              </a>
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-white p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 border-t border-exodus-light-blue/20 mt-2">
              <div className="flex flex-col gap-3 pt-4">
                <a href="#faq" className="text-white hover:text-exodus-light-blue transition py-2">
                  FAQ
                </a>
                <a href="#pricing" className="text-white hover:text-exodus-light-blue transition py-2">
                  PRICING
                </a>
                <a href="#contact" className="text-white hover:text-exodus-light-blue transition py-2">
                  CONTACT
                </a>
                <a href="/auth" className="bg-exodus-light-blue hover:bg-blue-400 text-white px-5 py-2.5 rounded-lg font-semibold transition text-left block">
                  SIGN UP
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-exodus-blue via-exodus-blue to-exodus-dark pt-24 md:pt-32 pb-32 md:pb-40 px-4 overflow-hidden min-h-[700px] md:min-h-[700px]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-exodus-light-blue rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-left max-w-4xl">
            <h1 className="text-4xl sm:text-4xl md:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight">
              Pass a trading test and trade forex{" "}
              <span className="text-exodus-light-blue">without depositing your own money.</span>
            </h1>
            <p className="text-lg md:text-2xl text-gray-200 mb-8 md:mb-10">
              Withdraw your profits anytime, on-demand.
            </p>
            
            <div className="flex gap-4 mb-12 md:mb-16">
              <a href="/purchase" className="bg-exodus-light-blue hover:bg-blue-400 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold text-base md:text-lg transition shadow-lg shadow-exodus-light-blue/30 inline-block">
                START TRADING
              </a>
            </div>
          </div>

          {/* Live Forex Ticker Slider */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-white/10 overflow-hidden">
            <div className="flex gap-6 md:gap-8 animate-scroll">
              {[...forexPairs, ...forexPairs].map((item, index) => (
                <div key={index} className="flex items-center gap-2 md:gap-3 min-w-max text-sm md:text-base">
                  <span className={item.change.startsWith('+') ? "text-green-400" : "text-red-400"}>●</span>
                  <span className="text-gray-300 font-semibold">{item.pair}</span>
                  <span className="text-white font-bold">{item.price}</span>
                  <span className={item.change.startsWith('+') ? "text-green-400 text-xs md:text-sm" : "text-red-400 text-xs md:text-sm"}>
                    {item.change}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-5xl font-bold text-center text-exodus-blue mb-4">
            Why Traders Choose <span className="text-exodus-light-blue">Exodus</span>
          </h2>
          <p className="text-center text-gray-600 mb-16 text-lg">
            Trade with confidence using our trader-friendly platform
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 px-6 md:px-0">
            <div className="bg-white p-8 rounded-xl border-t-4 border-exodus-light-blue">
              <h3 className="text-2xl font-bold text-exodus-dark mb-3">Payouts On-Demand</h3>
              <p className="text-gray-600">
                Withdraw your profits anytime, including multiple times per day. All payouts in USDT (Tron).
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border-t-4 border-exodus-light-blue">
              <h3 className="text-2xl font-bold text-exodus-dark mb-3">Fast Funding</h3>
              <p className="text-gray-600">
                Pass the 1-step evaluation and get funded immediately. No minimum or maximum time limits.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border-t-4 border-exodus-light-blue">
              <h3 className="text-2xl font-bold text-exodus-dark mb-3">Trader-Friendly Rules</h3>
              <p className="text-gray-600">
                Trade freely without worrying about consistency rules, profit caps, or limitations on your style.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border-t-4 border-exodus-light-blue">
              <h3 className="text-2xl font-bold text-exodus-dark mb-3">Elite Trading Environment</h3>
              <p className="text-gray-600">
                Access top-tier liquidity from centralized exchanges with tight spreads and deep order books.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border-t-4 border-exodus-light-blue">
              <h3 className="text-2xl font-bold text-exodus-dark mb-3">No Deposits</h3>
              <p className="text-gray-600">
                Pass the test and we provide the funded capital. You do not need to fund the account yourself.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border-t-4 border-exodus-light-blue">
              <h3 className="text-2xl font-bold text-exodus-dark mb-3">Unlimited Scaling</h3>
              <p className="text-gray-600">
                Scale your account up to higher balances as you prove consistent profitability and trading skill.
              </p>
            </div>
          </div>

          <div className="text-center">
            <a href="/purchase" className="bg-exodus-light-blue hover:bg-blue-400 text-white px-8 py-4 rounded-lg font-semibold text-lg transition shadow-lg inline-block">
              CHOOSE YOUR ACCOUNT SIZE
            </a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gradient-to-br from-exodus-dark to-exodus-blue">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-5xl font-bold text-center text-white mb-4">
            Become a Forex Prop Trader
          </h2>
          <p className="text-center text-exodus-light-blue mb-16 text-xl">
            Start trading with Exodus capital today
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative scale-[0.6] md:scale-100 origin-top">
              <div className="bg-exodus-blue/50 backdrop-blur-sm border-2 border-exodus-light-blue rounded-2xl p-8 h-full">
                <h3 className="text-2xl font-bold text-white mb-3 italic">
                  PASS THE EXODUS EVALUATION
                </h3>
                <p className="text-exodus-light-blue text-lg">
                  Pick the 1-step trading test with clear rules and no time limits.
                </p>
              </div>
              {/* Arrow - Desktop Right, Mobile Down */}
              <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 text-exodus-light-blue text-4xl">
                →
              </div>
            </div>
            {/* Mobile Down Arrow */}
            <div className="md:hidden flex justify-center -my-4">
              <svg className="w-12 h-12 text-exodus-light-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>

            <div className="relative scale-[0.6] md:scale-100 origin-top">
              <div className="bg-exodus-blue/50 backdrop-blur-sm border-2 border-exodus-light-blue rounded-2xl p-8 h-full">
                <h3 className="text-2xl font-bold text-white mb-3 italic">
                  TRADE YOUR FUNDED EXODUS ACCOUNT
                </h3>
                <p className="text-exodus-light-blue text-lg">
                  Trade your funded account and keep up to 90% of your profits.
                </p>
              </div>
              {/* Arrow - Desktop Right, Mobile Down */}
              <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 text-exodus-light-blue text-4xl">
                →
              </div>
            </div>
            {/* Mobile Down Arrow */}
            <div className="md:hidden flex justify-center -my-4">
              <svg className="w-12 h-12 text-exodus-light-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>

            <div className="scale-[0.6] md:scale-100 origin-top">
              <div className="bg-exodus-blue/50 backdrop-blur-sm border-2 border-exodus-light-blue rounded-2xl p-8 h-full">
                <h3 className="text-2xl font-bold text-white mb-3 italic">
                  UNLIMITED PAYOUTS ON-DEMAND
                </h3>
                <p className="text-exodus-light-blue text-lg">
                  Withdraw your profits anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-exodus-dark">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-5xl font-bold text-center text-white mb-16">
            Choose Your Account Size
          </h2>

          {/* Account Size Selector */}
          <div className="flex justify-center mb-12 overflow-x-auto px-2">
            <div className="inline-flex bg-exodus-blue/30 backdrop-blur-sm border-2 border-exodus-light-blue rounded-xl p-2 gap-2 min-w-max scale-[0.6] md:scale-100">
              {challenges.map((challenge, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedChallenge(index)}
                  className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold transition text-sm md:text-base whitespace-nowrap ${
                    index === selectedChallenge
                      ? "bg-exodus-light-blue text-white"
                      : "text-white hover:bg-exodus-blue/50"
                  }`}
                >
                  {challenge.size}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing Table */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-exodus-blue/50 backdrop-blur-sm border-2 border-exodus-light-blue rounded-2xl overflow-visible relative">
              {/* Table Header */}
              <div className="grid grid-cols-2 border-b-2 border-exodus-light-blue">
                <div className="p-3 md:p-6 border-r-2 border-exodus-light-blue"></div>
                <div className="p-3 md:p-6 text-center">
                  <h3 className="text-xl md:text-3xl font-bold text-white italic">1-STEP</h3>
                </div>
              </div>

              {/* Table Rows */}
              <div className="grid grid-cols-2 border-b border-exodus-light-blue/30">
                <div className="p-3 md:p-6 border-r-2 border-exodus-light-blue bg-exodus-dark/30 relative">
                  <div className="flex items-center gap-1 md:gap-2">
                    <p className="text-white font-semibold text-sm md:text-lg">Your Profit Share</p>
                    <button
                      onMouseEnter={() => setActiveTooltip('profitShare')}
                      onMouseLeave={() => setActiveTooltip(null)}
                      onClick={() => toggleTooltip('profitShare')}
                      className="text-exodus-light-blue hover:text-blue-300 transition relative shrink-0"
                    >
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      {activeTooltip === 'profitShare' && (
                        <div className="hidden md:block absolute left-full ml-3 top-1/2 -translate-y-1/2 w-52 bg-white text-exodus-dark p-3 rounded-lg shadow-2xl z-[100] text-xs leading-relaxed">
                          {tooltips.profitShare}
                        </div>
                      )}
                      {activeTooltip === 'profitShare' && (
                        <div className="md:hidden fixed inset-x-4 bottom-20 w-auto bg-white text-exodus-dark p-4 rounded-lg shadow-2xl z-[100] text-xs leading-relaxed">
                          {tooltips.profitShare}
                        </div>
                      )}
                    </button>
                  </div>
                </div>
                <div className="p-3 md:p-6 text-center">
                  <p className="text-white font-bold text-sm md:text-lg">Up to 90%</p>
                </div>
              </div>

              <div className="grid grid-cols-2 border-b border-exodus-light-blue/30">
                <div className="p-3 md:p-6 border-r-2 border-exodus-light-blue bg-exodus-dark/30 relative">
                  <div className="flex items-center gap-1 md:gap-2">
                    <p className="text-white font-semibold text-sm md:text-lg">Step 1 Goal</p>
                    <button
                      onMouseEnter={() => setActiveTooltip('step1Goal')}
                      onMouseLeave={() => setActiveTooltip(null)}
                      onClick={() => toggleTooltip('step1Goal')}
                      className="text-exodus-light-blue hover:text-blue-300 transition relative shrink-0"
                    >
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      {activeTooltip === 'step1Goal' && (
                        <div className="hidden md:block absolute left-full ml-3 top-1/2 -translate-y-1/2 w-52 bg-white text-exodus-dark p-3 rounded-lg shadow-2xl z-[100] text-xs leading-relaxed">
                          {tooltips.step1Goal}
                        </div>
                      )}
                      {activeTooltip === 'step1Goal' && (
                        <div className="md:hidden fixed inset-x-4 bottom-20 w-auto bg-white text-exodus-dark p-4 rounded-lg shadow-2xl z-[100] text-xs leading-relaxed">
                          {tooltips.step1Goal}
                        </div>
                      )}
                    </button>
                  </div>
                </div>
                <div className="p-3 md:p-6 text-center">
                  <p className="text-white font-bold text-sm md:text-lg">8%</p>
                </div>
              </div>

              <div className="grid grid-cols-2 border-b border-exodus-light-blue/30">
                <div className="p-3 md:p-6 border-r-2 border-exodus-light-blue bg-exodus-dark/30 relative">
                  <div className="flex items-center gap-1 md:gap-2">
                    <p className="text-white font-semibold text-sm md:text-lg">Step 2 Goal</p>
                    <button
                      onMouseEnter={() => setActiveTooltip('step2Goal')}
                      onMouseLeave={() => setActiveTooltip(null)}
                      onClick={() => toggleTooltip('step2Goal')}
                      className="text-exodus-light-blue hover:text-blue-300 transition relative shrink-0"
                    >
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      {activeTooltip === 'step2Goal' && (
                        <div className="hidden md:block absolute left-full ml-3 top-1/2 -translate-y-1/2 w-52 bg-white text-exodus-dark p-3 rounded-lg shadow-2xl z-[100] text-xs leading-relaxed">
                          {tooltips.step2Goal}
                        </div>
                      )}
                      {activeTooltip === 'step2Goal' && (
                        <div className="md:hidden fixed inset-x-4 bottom-20 w-auto bg-white text-exodus-dark p-4 rounded-lg shadow-2xl z-[100] text-xs leading-relaxed">
                          {tooltips.step2Goal}
                        </div>
                      )}
                    </button>
                  </div>
                </div>
                <div className="p-3 md:p-6 text-center">
                  <p className="text-white font-bold text-sm md:text-lg">–</p>
                </div>
              </div>

              <div className="grid grid-cols-2 border-b border-exodus-light-blue/30">
                <div className="p-3 md:p-6 border-r-2 border-exodus-light-blue bg-exodus-dark/30 relative">
                  <div className="flex items-center gap-1 md:gap-2">
                    <p className="text-white font-semibold text-sm md:text-lg">Max. daily loss</p>
                    <button
                      onMouseEnter={() => setActiveTooltip('dailyLoss')}
                      onMouseLeave={() => setActiveTooltip(null)}
                      onClick={() => toggleTooltip('dailyLoss')}
                      className="text-exodus-light-blue hover:text-blue-300 transition relative shrink-0"
                    >
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      {activeTooltip === 'dailyLoss' && (
                        <div className="hidden md:block absolute left-full ml-3 top-1/2 -translate-y-1/2 w-52 bg-white text-exodus-dark p-3 rounded-lg shadow-2xl z-[100] text-xs leading-relaxed">
                          {tooltips.dailyLoss}
                        </div>
                      )}
                      {activeTooltip === 'dailyLoss' && (
                        <div className="md:hidden fixed inset-x-4 bottom-20 w-auto bg-white text-exodus-dark p-4 rounded-lg shadow-2xl z-[100] text-xs leading-relaxed">
                          {tooltips.dailyLoss}
                        </div>
                      )}
                    </button>
                  </div>
                </div>
                <div className="p-3 md:p-6 text-center">
                  <p className="text-white font-bold text-sm md:text-lg">4% ({challenges[selectedChallenge].dailyLoss})</p>
                </div>
              </div>

              <div className="grid grid-cols-2 border-b border-exodus-light-blue/30">
                <div className="p-3 md:p-6 border-r-2 border-exodus-light-blue bg-exodus-dark/30 relative">
                  <div className="flex items-center gap-1 md:gap-2">
                    <p className="text-white font-semibold text-sm md:text-lg">Max. drawdown (Static)</p>
                    <button
                      onMouseEnter={() => setActiveTooltip('maxDrawdown')}
                      onMouseLeave={() => setActiveTooltip(null)}
                      onClick={() => toggleTooltip('maxDrawdown')}
                      className="text-exodus-light-blue hover:text-blue-300 transition relative shrink-0"
                    >
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      {activeTooltip === 'maxDrawdown' && (
                        <div className="hidden md:block absolute left-full ml-3 top-1/2 -translate-y-1/2 w-64 bg-white text-exodus-dark p-3 rounded-lg shadow-2xl z-[100] text-xs leading-relaxed">
                          {tooltips.maxDrawdown}
                        </div>
                      )}
                      {activeTooltip === 'maxDrawdown' && (
                        <div className="md:hidden fixed inset-x-4 bottom-20 w-auto bg-white text-exodus-dark p-4 rounded-lg shadow-2xl z-[100] text-xs leading-relaxed max-h-[60vh] overflow-y-auto">
                          {tooltips.maxDrawdown}
                        </div>
                      )}
                    </button>
                  </div>
                </div>
                <div className="p-3 md:p-6 text-center">
                  <p className="text-white font-bold text-sm md:text-lg">6% ({challenges[selectedChallenge].maxDrawdown})</p>
                </div>
              </div>

              <div className="grid grid-cols-2 border-b border-exodus-light-blue/30">
                <div className="p-3 md:p-6 border-r-2 border-exodus-light-blue bg-exodus-dark/30 relative">
                  <div className="flex items-center gap-1 md:gap-2">
                    <p className="text-white font-semibold text-sm md:text-lg">Leverage</p>
                    <button
                      onMouseEnter={() => setActiveTooltip('leverage')}
                      onMouseLeave={() => setActiveTooltip(null)}
                      onClick={() => toggleTooltip('leverage')}
                      className="text-exodus-light-blue hover:text-blue-300 transition relative shrink-0"
                    >
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      {activeTooltip === 'leverage' && (
                        <div className="hidden md:block absolute left-full ml-3 top-1/2 -translate-y-1/2 w-52 bg-white text-exodus-dark p-3 rounded-lg shadow-2xl z-[100] text-xs leading-relaxed">
                          {tooltips.leverage}
                        </div>
                      )}
                      {activeTooltip === 'leverage' && (
                        <div className="md:hidden fixed inset-x-4 bottom-20 w-auto bg-white text-exodus-dark p-4 rounded-lg shadow-2xl z-[100] text-xs leading-relaxed">
                          {tooltips.leverage}
                        </div>
                      )}
                    </button>
                  </div>
                </div>
                <div className="p-3 md:p-6 text-center">
                  <p className="text-white font-bold text-sm md:text-lg">Up to 1:100</p>
                </div>
              </div>

              <div className="grid grid-cols-2">
                <div className="p-3 md:p-6 border-r-2 border-exodus-light-blue bg-exodus-dark/30 relative">
                  <div className="flex items-center gap-1 md:gap-2">
                    <p className="text-white font-semibold text-sm md:text-lg">Evaluation fee</p>
                    <button
                      onMouseEnter={() => setActiveTooltip('evaluationFee')}
                      onMouseLeave={() => setActiveTooltip(null)}
                      onClick={() => toggleTooltip('evaluationFee')}
                      className="text-exodus-light-blue hover:text-blue-300 transition relative shrink-0"
                    >
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      {activeTooltip === 'evaluationFee' && (
                        <div className="hidden md:block absolute left-full ml-3 top-1/2 -translate-y-1/2 w-52 bg-white text-exodus-dark p-3 rounded-lg shadow-2xl z-[100] text-xs leading-relaxed">
                          {tooltips.evaluationFee}
                        </div>
                      )}
                      {activeTooltip === 'evaluationFee' && (
                        <div className="md:hidden fixed inset-x-4 bottom-20 w-auto bg-white text-exodus-dark p-4 rounded-lg shadow-2xl z-[100] text-xs leading-relaxed">
                          {tooltips.evaluationFee}
                        </div>
                      )}
                    </button>
                  </div>
                </div>
                <div className="p-3 md:p-6 text-center">
                  <p className="text-exodus-light-blue font-bold text-2xl md:text-4xl">{challenges[selectedChallenge].price}</p>
                </div>
              </div>
            </div>

            <div className="text-center mt-6 md:mt-8">
              <a href="/purchase" className="bg-exodus-light-blue hover:bg-blue-400 text-white px-8 md:px-12 py-3 md:py-4 rounded-lg font-bold text-base md:text-lg transition shadow-lg shadow-exodus-light-blue/30 w-full md:w-auto inline-block">
                START TRADING
              </a>
            </div>
          </div>

          <div className="mt-12 md:mt-16">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-6 md:mb-8 text-center">
              All Accounts Include:
            </h3>
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 md:gap-x-12 gap-y-3 md:gap-y-4 text-gray-300 max-w-3xl">
                <div className="flex items-start gap-2">
                  <span className="text-exodus-light-blue text-sm md:text-base">✓</span>
                  <span className="text-sm md:text-base">Single-phase (1-step) evaluation only</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-exodus-light-blue text-sm md:text-base">✓</span>
                  <span className="text-sm md:text-base">1:100 Leverage on all pairs</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-exodus-light-blue text-sm md:text-base">✓</span>
                  <span className="text-sm md:text-base">4% Maximum daily loss limit</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-exodus-light-blue text-sm md:text-base">✓</span>
                  <span className="text-sm md:text-base">6% Max loss (static, not trailing)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-exodus-light-blue text-sm md:text-base">✓</span>
                  <span className="text-sm md:text-base">EAs, Bots, and News trading allowed</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-exodus-light-blue text-sm md:text-base">✓</span>
                  <span className="text-sm md:text-base">Hold positions over weekends</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-exodus-light-blue text-sm md:text-base">✓</span>
                  <span className="text-sm md:text-base">On-demand payouts in USDT (Tron)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-exodus-light-blue text-sm md:text-base">✓</span>
                  <span className="text-sm md:text-base">No time limits to pass</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-exodus-blue mb-4">
            Rules to Support Traders
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Our rules are clear, consistent, and focus on risk management.
          </p>

          <h3 className="text-3xl font-bold text-center text-exodus-dark mb-8">
            FREQUENTLY ASKED QUESTIONS
          </h3>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md border-2 border-transparent hover:border-exodus-light-blue/30 transition overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 flex justify-between items-center text-left"
                >
                  <span className="font-semibold text-exodus-dark text-lg">
                    {faq.question}
                  </span>
                  <span className="text-exodus-light-blue text-2xl">
                    {openFaq === index ? "−" : "+"}
                  </span>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-5 text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white rounded-xl shadow-lg p-8 border-l-4 border-exodus-light-blue">
            <h4 className="text-xl font-bold text-exodus-dark mb-2 italic">
              NEED MORE HELP?
            </h4>
            <p className="text-gray-600 mb-4">
              We have an in-house support team to assist with all inquiries.
            </p>
            <button className="bg-transparent border-2 border-exodus-light-blue text-exodus-blue hover:bg-exodus-light-blue hover:text-white px-6 py-2 rounded-lg font-semibold transition">
              CONTACT SUPPORT
            </button>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 md:py-20 px-4 bg-gradient-to-br from-exodus-blue to-exodus-dark">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Discord */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-6 md:p-8 shadow-xl">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4 italic">
                JOIN OUR DISCORD
              </h3>
              <p className="text-purple-100 mb-4 md:mb-6 text-sm md:text-base">
                Connect with our trader community for real-time updates, chart talk and 24/7 support.
              </p>
              <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/50 text-white px-5 md:px-6 py-2.5 md:py-3 rounded-lg font-semibold transition text-sm md:text-base w-full md:w-auto">
                JOIN OUR DISCORD
              </button>
            </div>

            {/* Newsletter */}
            <div className="bg-exodus-blue/50 backdrop-blur-sm border-2 border-exodus-light-blue rounded-2xl p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4 italic">
                JOIN OUR MAILING LIST
              </h3>
              <p className="text-gray-300 mb-4 md:mb-6 text-sm md:text-base">
                No fluff. Only important announcements, trading tips, and free educational content.
              </p>
              <div className="flex flex-col md:flex-row gap-2">
                <input
                  type="email"
                  placeholder="email@address.com"
                  className="flex-1 px-4 py-2.5 md:py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-exodus-light-blue text-sm md:text-base"
                />
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 md:px-6 py-2.5 md:py-3 rounded-lg font-semibold transition text-sm md:text-base">
                  SUBSCRIBE
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-exodus-dark py-12 px-4 border-t border-exodus-light-blue/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/logo.png"
                  alt="Exodus Logo"
                  width={40}
                  height={40}
                  className="h-10 w-auto"
                />
                <span className="text-xl font-bold text-white">exodus</span>
              </div>
              <p className="text-gray-400 text-sm">
                Trade forex without depositing your own money.
              </p>
              <p className="text-exodus-light-blue text-sm mt-2">
                support@exodusprop.com
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-exodus-light-blue transition">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-exodus-light-blue transition">
                    CONTACT
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link href="/terms" className="hover:text-exodus-light-blue transition">
                    TERMS AND CONDITIONS
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-exodus-light-blue transition">
                    PRIVACY POLICY
                  </Link>
                </li>
                <li>
                  <Link href="/refund" className="hover:text-exodus-light-blue transition">
                    REFUND POLICY
                  </Link>
                </li>
                <li>
                  <Link href="/program-rules" className="hover:text-exodus-light-blue transition">
                    PROGRAM RULES
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-exodus-light-blue transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-exodus-light-blue transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-exodus-light-blue transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            <p className="mb-4">
              © {new Date().getFullYear()} EXODUS TRADING LTD. All rights reserved.
            </p>
            <p className="text-xs max-w-4xl mx-auto leading-relaxed">
              Important Disclosures about Exodus, Forex Trading Ltd. ("Forex") and the Funded-Trader Program:
              Exodus evaluation program is intentionally designed to identify and test trading skill and strategy discipline before any 
              proprietary capital is allocated. Most applicants do not pass on their first attempt and there is no 
              guarantee that your performance will improve or that you will pass any future evaluations. Prospective traders should purchase an evaluation only if they are confident in their trading ability and accept the risk of not qualifying for a funded account. 
              Evaluation fees are non-refundable for each attempt.
              <br /><br />
              If you pass the evaluation phase and become a funded trader ("FT") with Exodus, as market-facing transactions, if any, are carried out exclusively by Exodus, for Exodus own principal account and at its sole discretion. FTs do not own any trading account or 
              position, and hold no beneficial or proprietary interest in Exodus accounts, assets or trades. When an FT submits a trade idea, Exodus may in its absolute discretion, either as an internal, administrative book entry or 
              record the idea as an internal administrative book entry only and calculate a 
              theoretical P&L accordingly without placing any corresponding real-money trade with any broker or exchange. In either case, P&L may be calculated at the same price-time intervals. Exodus may receive financial incentives from third parties based on trade ideas provided by FTs. Because such revenue is retained solely by Exodus and is not shared with FTs, conflicts of interest 
              may exist between Exodus and each FT, and there is no guarantee that Exodus earns fees each time an evaluation trader fails, and there is no guarantee that Exodus purchases an evaluation, conflicts of interest may also 
              exist between Exodus and each evaluation trader.
              <br /><br />
              Forex trading involves substantial risk of loss. Past performance is not indicative of future results. Please trade responsibly.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </main>
  );
}
