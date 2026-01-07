"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { trackViewContent, trackInitiateCheckout } from "@/lib/facebookPixel";

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openLearnDropdown, setOpenLearnDropdown] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const toggleTooltip = (id: string) => {
    setActiveTooltip(activeTooltip === id ? null : id);
  };

  // Track ViewContent on main landing page
  useEffect(() => {
    trackViewContent({ page: "home" });
  }, []);

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

  // Pricing Configuration
  const [currentPlan, setCurrentPlan] = useState<'onestep' | 'elite'>('onestep');
  const [selectedMobileAccount, setSelectedMobileAccount] = useState(100000);

  const challengeConfigs = {
    onestep: {
      name: "Exodus 1-Step",
      accounts: [10000, 25000, 50000, 100000, 200000] as const,
      prices: { 10000: 109, 25000: 247, 50000: 399, 100000: 699, 200000: 1499 } as Record<number, number>,
      profitTarget: "8%",
      maxDailyLoss: "4%",
      maxDrawdown: "6% (Static)",
      leverage: "Up to 1:100",
      minTradingDays: "No minimum"
    },
    elite: {
      name: "Exodus Elite",
      accounts: [10000, 25000, 50000, 100000, 200000] as const,
      prices: { 10000: 209, 25000: 599, 50000: 799, 100000: 1299, 200000: 2599 } as Record<number, number>,
      profitTarget: "10%",
      maxDailyLoss: "10% (Trailing EOD)",
      maxDrawdown: "None",
      leverage: "Up to 1:100",
      minTradingDays: "No minimum"
    }
  };

  const currentConfig = challengeConfigs[currentPlan];
  const bestValueIndex = 2; // 100k is best value

  const pricingFeatures = [
    { 
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      ), 
      label: 'Profit Target',
      getValue: () => currentConfig.profitTarget
    },
    { 
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      ), 
      label: 'Max. Daily Loss', 
      getValue: () => currentConfig.maxDailyLoss 
    },
    { 
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M8 15l4 4 4-4" />
        </svg>
      ), 
      label: 'Max. Drawdown', 
      getValue: () => currentConfig.maxDrawdown 
    },
    { 
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ), 
      label: 'Min. trading days', 
      getValue: () => currentConfig.minTradingDays 
    },
    { 
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12h18M12 3v18" />
        </svg>
      ), 
      label: 'Leverage', 
      getValue: () => currentConfig.leverage 
    }
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
      <nav className="fixed top-0 w-full bg-white/5 backdrop-blur-md z-50 border-b border-white/10">
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
                      <Link
                        href="/how-we-pay"
                        className="block px-4 py-2 text-exodus-dark hover:bg-gray-100 text-sm"
                      >
                        How We Pay Traders
                      </Link>
                      <Link
                        href="/rules"
                        className="block px-4 py-2 text-exodus-dark hover:bg-gray-100 text-sm"
                      >
                        Rules & Objectives
                      </Link>
                      <Link
                        href="/how-it-works"
                        className="block px-4 py-2 text-exodus-dark hover:bg-gray-100 text-sm"
                      >
                        How It Works
                      </Link>
                      <Link
                        href="/resources"
                        className="block px-4 py-2 text-exodus-dark hover:bg-gray-100 text-sm"
                      >
                        Resources
                      </Link>
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
                <Link href="/how-we-pay" className="text-white hover:text-exodus-light-blue transition py-2">
                  How We Pay Traders
                </Link>
                <Link href="/rules" className="text-white hover:text-exodus-light-blue transition py-2">
                  Rules & Objectives
                </Link>
                <Link href="/how-it-works" className="text-white hover:text-exodus-light-blue transition py-2">
                  How It Works
                </Link>
                <Link href="/resources" className="text-white hover:text-exodus-light-blue transition py-2">
                  Resources
                </Link>
                <a href="#faq" className="text-white hover:text-exodus-light-blue transition py-2">
                  Faq
                </a>
                <a href="#pricing" className="text-white hover:text-exodus-light-blue transition py-2">
                  Pricing
                </a>
                <a href="#contact" className="text-white hover:text-exodus-light-blue transition py-2">
                  Contact
                </a>
                <a href="/auth" className="bg-exodus-light-blue hover:bg-blue-400 text-white px-5 py-2.5 rounded-lg font-semibold transition text-left block">
                  Sign up
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="relative z-10 px-6 pt-24 md:pt-28 pb-12 md:pb-10 text-center overflow-hidden"
        style={{
          background: "linear-gradient(to bottom, #000 0%, #000 55%, #091827 100%)"
        }}
      >
        <div className="max-w-5xl mx-auto">
          
          {/* Main Hero Image */}
          <div className="relative mb-6 md:mb-8 md:-mt-[200px] -mt-[75px] md:-mt-[200px]">
            <div className="relative w-full max-w-4xl mx-auto aspect-[16/9]">
              <Image
                src="/exodushero.png"
                alt="Exodus Trading"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 100vw, 1200px"
              />
            </div>
          </div>

          {/* Title */}
          <div className="relative -mt-[30px] md:-mt-[150px]">
            <h1
              className="text-4xl md:text-6xl lg:text-7xl mb-4 md:mb-6 font-extrabold drop-shadow-[0_4px_24px_rgba(34,211,238,0.45)] bg-gradient-to-b from-cyan-400 via-cyan-300 to-white text-transparent bg-clip-text"
              style={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                backgroundImage: "linear-gradient(to bottom, #22d3ee 10%, #a5f3fc 30%, #fff 100%)"
              }}
            >
              We Monetize <br /> Promising Traders
            </h1>
            
            {/* Description */}
            <p className="text-gray-300 max-w-3xl mx-auto text-sm md:text-2xl mb-8 md:mb-10">
              Trade on our simulated platform and earn rewards.
            </p>

            {/* CTA Button */}
            <div className="mb-10 md:mb-12">
              <a 
                href="/purchase" 
                onClick={() => trackInitiateCheckout()}
                className="bg-exodus-light-blue hover:bg-blue-400 text-white px-10 md:px-12 py-4 md:py-5 rounded-lg font-semibold text-lg md:text-xl transition shadow-lg shadow-exodus-light-blue/30 inline-block hover:scale-105"
              >
                START TRADING
              </a>
            </div>
          </div>

          {/* Trustpilot Card */}
          <div className="max-w-md mx-auto mb-8 md:mb-12 pb-2" style={{ transform: "scale(0.7)" }}>
            <a 
              href="https://www.trustpilot.com/review/exodusprop.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 md:gap-4 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-lg hover:scale-105 transition-transform duration-300"
            >
              {/* "Great" Text */}
              <span className="text-sm md:text-lg font-bold text-white">Great</span>
              
              {/* Star Rating */}
              <div className="w-20 md:w-24">
                <Image
                  src="/stars-4.svg"
                  alt="4 stars"
                  width={96}
                  height={18}
                  className="w-full h-auto"
                />
              </div>
              
              {/* Trustpilot Logo and Text */}
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#00B67A]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
                <span className="text-sm md:text-lg font-bold text-white">Trustpilot</span>
              </div>
            </a>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 px-2 md:px-0 mb-10">
            {/* Card 1 - 1-Step Funding */}
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/20 overflow-hidden">
              {/* Static Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-exodus-light-blue/0 to-exodus-light-blue/0"></div>
              
              {/* Icon */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-3">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-exodus-light-blue/10 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 md:w-7 md:h-7 text-exodus-light-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-sm md:text-lg font-bold text-white text-center">
                  1-Step Funding
                </p>
              </div>
            </div>

            {/* Card 2 - Static Drawdowns */}
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/20 overflow-hidden">
              {/* Static Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-exodus-light-blue/0 to-exodus-light-blue/0"></div>
              
              {/* Icon */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-3">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-exodus-light-blue/10 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 md:w-7 md:h-7 text-exodus-light-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-sm md:text-lg font-bold text-white text-center">
                  Static Drawdowns
                </p>
              </div>
            </div>

            {/* Card 3 - On Demand Payouts */}
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/20 overflow-hidden">
              {/* Static Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-exodus-light-blue/0 to-exodus-light-blue/0"></div>
              
              {/* Icon */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-3">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-exodus-light-blue/10 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 md:w-7 md:h-7 text-exodus-light-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm md:text-lg font-bold text-white text-center">
                  On Demand Payouts
                </p>
              </div>
            </div>

            {/* Card 4 - 15min Avg Payout */}
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/20 overflow-hidden">
              {/* Static Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-exodus-light-blue/0 to-exodus-light-blue/0"></div>
              
              {/* Icon */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-3">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-exodus-light-blue/10 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 md:w-7 md:h-7 text-exodus-light-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm md:text-lg font-bold text-white text-center">
                  15min Avg Payout
                </p>
              </div>
            </div>
          </div>

        
        </div>
      </section>

        {/* Partnership Banner */}
        <section className="py-4 md:py-6 px-2 md:px-4 bg-exodus-dark">
          <div className="max-w-6xl mx-auto">
            {/* 3 Divs in Row Layout (horizontal on all widths) */}
            <div
              className="rounded-2xl"
              style={{
                backgroundColor: 'color-mix(in oklab, white 3%, transparent)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'color-mix(in oklab, white 8%, transparent)'
              }}
            >
              <div className="flex flex-row md:grid md:grid-cols-3 gap-2 md:gap-8 items-center justify-center">
                {/* Div 1 - Exodus Logo */}
                <div className="flex items-center justify-center h-[60px] w-[60px] md:w-auto md:h-[100px]">
                  <Image
                    src="/exodus.png"
                    alt="Exodus"
                    width={48}
                    height={48}
                    className="w-10 h-10 md:w-20 md:h-20 object-contain drop-shadow-lg"
                  />
                </div>

                {/* Div 2 - Whop Logo */}
                <div className="flex items-center justify-center h-[60px] w-[70px] md:w-auto md:h-[100px]">
                  <Image
                    src="/whop.png"
                    alt="Whop"
                    width={60}
                    height={36}
                    className="w-16 h-8 md:w-32 md:h-20 object-contain drop-shadow-lg"
                  />
                </div>

                {/* Div 3 - Learn More Button */}
                <div
                  className="flex items-center justify-center h-[60px] md:h-[100px] cursor-pointer"
                  onClick={() => setShowPartnerModal(true)}
                >
                  <span className="text-white font-semibold text-[80%] md:text-base flex items-center gap-1 md:gap-2" style={{ fontSize: undefined }}>
                    Learn More
                    <svg xmlns="http://www.w3.org/2000/svg" className="inline-block w-3 h-3 md:w-5 md:h-5 text-exodus-light-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>

        {/* Popup Modal */}
        {showPartnerModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60" onClick={() => setShowPartnerModal(false)}>
            <div className="bg-exodus-dark rounded-2xl p-8 max-w-md w-full mx-4 text-center shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setShowPartnerModal(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl"
                aria-label="Close modal"
              >
                &times;
              </button>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex flex-row items-center gap-3 mb-2">
                  <Image
                    src="/whop.png"
                    alt="Whop"
                    width={60}
                    height={36}
                    className="w-12 h-8 object-contain"
                  />
                  <span className="text-white font-bold text-xl">Powered by Whop</span>
                </div>
                <p className="text-gray-200 text-base">
                  Exodus is powered by <span className="text-exodus-light-blue font-semibold">Whop</span> for payments.
                </p>
                <p className="text-gray-300 text-sm">
                  This allows us to provide lightning fast, secure payments for our traders, so you can access your funds instantly and without hassle.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Features Section - Bento Box */}
      <section id="features" className="py-20 px-4 bg-exodus-dark">
        <div className="max-w-7xl mx-auto">
          {/* Bento Grid Layout */}
          <div className="space-y-4 px-4 md:px-0 mb-12">
            {/* Large Hero Card - Full Width */}
            <div className="relative bg-gradient-to-br from-exodus-blue via-exodus-blue to-exodus-dark rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl overflow-hidden group">
              {/* Background decorative elements */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-10 right-10 w-96 h-96 bg-exodus-light-blue rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
              </div>
              
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 md:mb-6">
                  Why Traders Choose <span className="text-exodus-light-blue">Exodus</span>
                </h2>
                <p className="text-lg md:text-2xl text-gray-200 max-w-3xl">
                  Trade with confidence using our trader-friendly platform
                </p>
              </div>
            </div>

            {/* Four Cards - Desktop: 1 row, Mobile: 1-2-1 layout */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Card 1 - 1-Step Funding */}
              <div
                className="col-span-2 md:col-span-1 rounded-2xl group transition-all duration-300 border border-gray-700/60 hover:border-exodus-light-blue/80 shadow-xl hover:shadow-2xl"
                style={{
                  backgroundColor: 'color-mix(in oklab, white 3%, transparent)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'color-mix(in oklab, white 8%, transparent)',
                }}
              >
                <div className="flex flex-col items-start p-6 md:p-8 h-full">
                  <div className="bg-exodus-light-blue/10 rounded-full w-12 h-12 md:w-14 md:h-14 flex items-center justify-center mb-4 group-hover:bg-exodus-light-blue/15 transition-colors">
                    <svg className="w-6 h-6 md:w-7 md:h-7 text-exodus-light-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">1-Step Funding</h3>
                  <p className="text-gray-300 text-sm md:text-base">
                    One evaluation, instant funding - no second phase
                  </p>
                </div>
              </div>

              {/* Card 2 - Static Drawdowns */}
              <div
                className="col-span-1 rounded-2xl group transition-all duration-300 border border-gray-700/60 hover:border-exodus-light-blue/80 shadow-xl hover:shadow-2xl"
                style={{
                  backgroundColor: 'color-mix(in oklab, white 3%, transparent)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'color-mix(in oklab, white 8%, transparent)',
                }}
              >
                <div className="flex flex-col items-start p-6 md:p-8 h-full">
                  <div className="bg-exodus-light-blue/10 rounded-full w-12 h-12 md:w-14 md:h-14 flex items-center justify-center mb-4 group-hover:bg-exodus-light-blue/15 transition-colors">
                    <svg className="w-6 h-6 md:w-7 md:h-7 text-exodus-light-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">Static Drawdowns</h3>
                  <p className="text-gray-300 text-sm md:text-base">
                    Non-trailing drawdown for maximum flexibility
                  </p>
                </div>
              </div>

              {/* Card 3 - On Demand Payouts */}
              <div
                className="col-span-1 rounded-2xl group transition-all duration-300 border border-gray-700/60 hover:border-exodus-light-blue/80 shadow-xl hover:shadow-2xl"
                style={{
                  backgroundColor: 'color-mix(in oklab, white 3%, transparent)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'color-mix(in oklab, white 8%, transparent)',
                }}
              >
                <div className="flex flex-col items-start p-6 md:p-8 h-full">
                  <div className="bg-exodus-light-blue/10 rounded-full w-12 h-12 md:w-14 md:h-14 flex items-center justify-center mb-4 group-hover:bg-exodus-light-blue/15 transition-colors">
                    <svg className="w-6 h-6 md:w-7 md:h-7 text-exodus-light-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">On Demand Payouts</h3>
                  <p className="text-gray-300 text-sm md:text-base">
                    Withdraw anytime, multiple times daily
                  </p>
                </div>
              </div>

              {/* Card 4 - 15min Avg Payout */}
              <div
                className="col-span-2 md:col-span-1 rounded-2xl group transition-all duration-300 border border-gray-700/60 hover:border-exodus-light-blue/80 shadow-xl hover:shadow-2xl"
                style={{
                  backgroundColor: 'color-mix(in oklab, white 3%, transparent)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'color-mix(in oklab, white 8%, transparent)',
                }}
              >
                <div className="flex flex-col items-start p-6 md:p-8 h-full">
                  <div className="bg-exodus-light-blue/10 rounded-full w-12 h-12 md:w-14 md:h-14 flex items-center justify-center mb-4 group-hover:bg-exodus-light-blue/15 transition-colors">
                    <svg className="w-6 h-6 md:w-7 md:h-7 text-exodus-light-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">15min Avg Payout</h3>
                  <p className="text-gray-300 text-sm md:text-base">
                    Lightning-fast processing in just 15 minutes
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <a 
              href="/purchase" 
              onClick={() => trackInitiateCheckout()}
              className="bg-exodus-light-blue hover:bg-blue-400 text-white px-8 py-4 rounded-lg font-semibold text-lg transition shadow-lg inline-block"
            >
              CHOOSE YOUR ACCOUNT SIZE
            </a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-exodus-dark">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center text-white mb-4">
            How It Works
          </h2>
          <p className="text-center text-gray-300 mb-16 text-lg md:text-xl">
            Start earning rewards. All it takes is three focused steps.
          </p>

          {/* Mobile: Horizontal Scroll */}
          <div className="md:hidden relative overflow-hidden -mx-4 mb-8">
            {/* Gradient overlays for scroll hint */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-exodus-dark to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-exodus-dark to-transparent z-10 pointer-events-none"></div>
            
            {/* Scrolling Container */}
            <div className="flex gap-4 overflow-x-auto px-4 pb-4 snap-x snap-mandatory scrollbar-hide">
              {/* Card 1 */}
              <div className="flex-shrink-0 w-[85vw] snap-center">
                <div 
                  className="rounded-lg p-6 h-full transition-colors"
                  style={{
                    backgroundColor: 'color-mix(in oklab, white 4%, transparent)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'color-mix(in oklab, white 8%, transparent)'
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-500 text-xs font-medium flex items-center gap-1">
                      Start
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <div className="text-gray-600 text-2xl">→</div>
                  </div>
                  
                  <div className="flex items-start gap-2 mb-4">
                    <span className="text-6xl font-bold text-white">1</span>
                    <div className="bg-exodus-light-blue rounded-lg p-1.5">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">
                    Exodus Challenge
                  </h3>
                  <p className="text-gray-400 mb-4 text-sm">
                    The Exodus Challenge develops trading skills through structured objectives.
                  </p>

                  <ul className="space-y-1.5 mb-4">
                    <li className="flex items-start gap-1.5 text-gray-300 text-sm">
                      <svg className="w-3.5 h-3.5 text-gray-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Follow trading objectives</span>
                    </li>
                    <li className="flex items-start gap-1.5 text-gray-300 text-sm">
                      <svg className="w-3.5 h-3.5 text-gray-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Prove your trading strategy</span>
                    </li>
                  </ul>

                  <a 
                    href="#pricing"
                    className="block w-full bg-exodus-light-blue hover:bg-blue-400 text-white text-center py-2 rounded-lg font-semibold transition text-sm"
                  >
                    Start Exodus Challenge
                  </a>
                </div>
              </div>

              {/* Card 2 */}
              <div className="flex-shrink-0 w-[85vw] snap-center">
                <div 
                  className="rounded-lg p-6 h-full transition-colors"
                  style={{
                    backgroundColor: 'color-mix(in oklab, white 4%, transparent)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'color-mix(in oklab, white 8%, transparent)'
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-500 text-xs font-medium flex items-center gap-1">
                      Verify
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <div className="text-gray-600 text-2xl">→</div>
                  </div>
                  
                  <div className="flex items-start gap-2 mb-4">
                    <span className="text-6xl font-bold text-white">2</span>
                    <div className="bg-exodus-light-blue rounded-lg p-1.5">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">
                    Pass Evaluation
                  </h3>
                  <p className="text-gray-400 mb-4 text-sm">
                    Complete the 1-step challenge by hitting the 8% profit target.
                  </p>

                  <ul className="space-y-1.5">
                    <li className="flex items-start gap-1.5 text-gray-300 text-sm">
                      <svg className="w-3.5 h-3.5 text-gray-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>8% profit target</span>
                    </li>
                    <li className="flex items-start gap-1.5 text-gray-300 text-sm">
                      <svg className="w-3.5 h-3.5 text-gray-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>No time limits</span>
                    </li>
                    <li className="flex items-start gap-1.5 text-gray-300 text-sm">
                      <svg className="w-3.5 h-3.5 text-gray-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Trader-friendly rules</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Card 3 */}
              <div className="flex-shrink-0 w-[85vw] snap-center">
                <div 
                  className="rounded-lg p-6 h-full shadow-xl shadow-exodus-light-blue/20"
                  style={{
                    background: 'linear-gradient(to bottom, #4FB8E7 0%, #4FB8E7 3%, color-mix(in oklab, white 4%, transparent) 15%, color-mix(in oklab, white 4%, transparent) 100%)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'color-mix(in oklab, white 8%, transparent)'
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-blue-100 text-xs font-medium flex items-center gap-1">
                      Get Real-Money Rewards
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                  
                  <div className="flex items-start gap-2 mb-4">
                    <span className="text-6xl font-bold text-white opacity-40">3</span>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-1.5">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">
                    Exodus Account
                  </h3>
                  <p className="text-blue-50 mb-4 text-sm">
                    Pass the Exodus Challenge and progress toward the Funded Account.
                  </p>

                  <ul className="space-y-1.5">
                    <li className="flex items-start gap-1.5 text-white text-sm">
                      <svg className="w-3.5 h-3.5 text-blue-200 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Up to 90% profit share</span>
                    </li>
                    <li className="flex items-start gap-1.5 text-white text-sm">
                      <svg className="w-3.5 h-3.5 text-blue-200 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Up to $200,000 account</span>
                    </li>
                    <li className="flex items-start gap-1.5 text-white text-sm">
                      <svg className="w-3.5 h-3.5 text-blue-200 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>On-demand payouts</span>
                    </li>
                    <li className="flex items-start gap-1.5 text-white text-sm">
                      <svg className="w-3.5 h-3.5 text-blue-200 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Account scaling available</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop: Grid Layout */}
          <div className="hidden md:grid md:grid-cols-3 gap-4 px-6 md:px-0">
            {/* Card 1 - Start */}
            <div className="relative">
              <div 
                className="rounded-lg p-4 md:p-6 h-full transition-colors"
                style={{
                  backgroundColor: 'color-mix(in oklab, white 4%, transparent)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'color-mix(in oklab, white 8%, transparent)'
                }}
              >
                {/* Header with label */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-500 text-xs font-medium flex items-center gap-1">
                    Start
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </span>
                  {/* Arrow on card */}
                  <div className="hidden md:block text-gray-600 text-2xl">→</div>
                </div>
                
                <div className="flex items-start gap-2 mb-4">
                  <span className="text-4xl md:text-6xl font-bold text-white">1</span>
                  <div className="bg-exodus-light-blue rounded-lg p-1.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>

                <h3 className="text-lg md:text-2xl font-bold text-white mb-2">
                  Exodus Challenge
                </h3>
                <p className="text-gray-400 mb-4 text-xs md:text-sm">
                  The Exodus Challenge develops trading skills through structured objectives.
                </p>

                {/* Bullet points */}
                <ul className="space-y-1.5 mb-4">
                  <li className="flex items-start gap-1.5 text-gray-300 text-xs md:text-sm">
                    <svg className="w-3.5 h-3.5 text-gray-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Follow trading objectives</span>
                  </li>
                  <li className="flex items-start gap-1.5 text-gray-300 text-xs md:text-sm">
                    <svg className="w-3.5 h-3.5 text-gray-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Prove your trading strategy</span>
                  </li>
                </ul>

                {/* CTA Button */}
                <a 
                  href="#pricing"
                  className="block w-full bg-exodus-light-blue hover:bg-blue-400 text-white text-center py-2 rounded-lg font-semibold transition text-xs md:text-sm"
                >
                  Start Exodus Challenge
                </a>
              </div>
            </div>

            {/* Card 2 - Verify */}
            <div className="relative">
              <div 
                className="rounded-lg p-4 md:p-6 h-full transition-colors"
                style={{
                  backgroundColor: 'color-mix(in oklab, white 4%, transparent)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'color-mix(in oklab, white 8%, transparent)'
                }}
              >
                {/* Header with label */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-500 text-xs font-medium flex items-center gap-1">
                    Verify
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </span>
                  {/* Arrow on card */}
                  <div className="hidden md:block text-gray-600 text-2xl">→</div>
                </div>
                
                <div className="flex items-start gap-2 mb-4">
                  <span className="text-4xl md:text-6xl font-bold text-white">2</span>
                  <div className="bg-exodus-light-blue rounded-lg p-1.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>

                <h3 className="text-lg md:text-2xl font-bold text-white mb-2">
                  Pass Evaluation
                </h3>
                <p className="text-gray-400 mb-4 text-xs md:text-sm">
                  Complete the 1-step challenge by hitting the 8% profit target.
                </p>

                {/* Bullet points */}
                <ul className="space-y-1.5">
                  <li className="flex items-start gap-1.5 text-gray-300 text-xs md:text-sm">
                    <svg className="w-3.5 h-3.5 text-gray-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>8% profit target</span>
                  </li>
                  <li className="flex items-start gap-1.5 text-gray-300 text-xs md:text-sm">
                    <svg className="w-3.5 h-3.5 text-gray-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>No time limits</span>
                  </li>
                  <li className="flex items-start gap-1.5 text-gray-300 text-xs md:text-sm">
                    <svg className="w-3.5 h-3.5 text-gray-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Trader-friendly rules</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 3 - Get Funded (Highlighted) */}
            <div className="relative">
              <div 
                className="rounded-lg p-4 md:p-6 h-full shadow-xl shadow-exodus-light-blue/20"
                style={{
                  background: 'linear-gradient(to bottom, #4FB8E7 0%, #4FB8E7 3%, color-mix(in oklab, white 4%, transparent) 15%, color-mix(in oklab, white 4%, transparent) 100%)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'color-mix(in oklab, white 8%, transparent)'
                }}
              >
                {/* Header with label */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-blue-100 text-xs font-medium flex items-center gap-1">
                    Get Real-Money Rewards
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </span>
                </div>
                
                <div className="flex items-start gap-2 mb-4">
                  <span className="text-4xl md:text-6xl font-bold text-white opacity-40">3</span>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-1.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>

                <h3 className="text-lg md:text-2xl font-bold text-white mb-2">
                  Exodus Account
                </h3>
                <p className="text-blue-50 mb-4 text-xs md:text-sm">
                  Pass the Exodus Challenge and progress toward the Funded Account.
                </p>

                {/* Bullet points */}
                <ul className="space-y-1.5">
                  <li className="flex items-start gap-1.5 text-white text-xs md:text-sm">
                    <svg className="w-3.5 h-3.5 text-blue-200 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Up to 90% profit share</span>
                  </li>
                  <li className="flex items-start gap-1.5 text-white text-xs md:text-sm">
                    <svg className="w-3.5 h-3.5 text-blue-200 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Up to $200,000 account</span>
                  </li>
                  <li className="flex items-start gap-1.5 text-white text-xs md:text-sm">
                    <svg className="w-3.5 h-3.5 text-blue-200 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>On-demand payouts</span>
                  </li>
                  <li className="flex items-start gap-1.5 text-white text-xs md:text-sm">
                    <svg className="w-3.5 h-3.5 text-blue-200 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Account scaling available</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-exodus-dark">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-5xl font-bold text-center text-white mb-8">
            Choose Your Account Size
          </h2>

          {/* Plan Type Selection */}
          <div className="flex justify-center mb-8">
            <div className="flex flex-wrap items-center justify-center gap-2 rounded-full border px-3 py-2"
              style={{
                backgroundColor: 'color-mix(in oklab, white 4%, transparent)',
                borderColor: 'color-mix(in oklab, white 8%, transparent)'
              }}
            >
              <button
                type="button"
                onClick={() => setCurrentPlan('onestep')}
                className={`flex items-center justify-center rounded-full text-xs md:text-sm px-3 md:px-5 py-1.5 md:py-2 font-bold transition-all duration-300 ${
                  currentPlan === 'onestep' 
                    ? 'bg-exodus-light-blue text-white border border-exodus-light-blue' 
                    : 'bg-transparent text-white/80 border border-white/20 hover:bg-exodus-light-blue/10'
                }`}
              >
                Exodus 1-Step
              </button>
              <button
                type="button"
                onClick={() => setCurrentPlan('elite')}
                className={`flex items-center justify-center rounded-full text-xs md:text-sm px-3 md:px-5 py-1.5 md:py-2 font-bold transition-all duration-300 ${
                  currentPlan === 'elite' 
                    ? 'bg-exodus-light-blue text-white border border-exodus-light-blue' 
                    : 'bg-transparent text-white/80 border border-white/20 hover:bg-exodus-light-blue/10'
                }`}
              >
                Exodus Elite
              </button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:block max-w-[1400px] mx-auto px-4 overflow-x-auto pt-4">
            <div className="flex gap-0 min-w-fit">
              {/* Left Column - Feature Labels */}
              <div className="flex-shrink-0 w-40 pt-[80px]">
                {pricingFeatures.map((feature, idx) => (
                  <div 
                    key={idx} 
                    className="h-[44px] flex items-center gap-2 px-2"
                  >
                    <span className="text-gray-400">{feature.icon}</span>
                    <span className="text-white text-[11px] font-medium">{feature.label}</span>
                  </div>
                ))}
              </div>

              {/* Account Cards */}
              <div className="flex gap-1.5 flex-1 justify-center">
                {currentConfig.accounts.map((account, cardIndex) => {
                  const isBestValue = cardIndex === bestValueIndex;
                  
                  return (
                    <div 
                      key={account} 
                      className={`flex-shrink-0 w-[140px] relative ${isBestValue ? 'z-10' : ''}`}
                    >
                      {/* Best Value Badge */}
                      {isBestValue && (
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20">
                          <div className="bg-exodus-light-blue text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                            Best value
                          </div>
                        </div>
                      )}
                      
                      <div 
                        className={`rounded-lg overflow-hidden ${
                          isBestValue 
                            ? 'border-2 border-exodus-light-blue/50' 
                            : 'border'
                        }`}
                        style={{
                          backgroundColor: isBestValue 
                            ? 'color-mix(in oklab, white 6%, transparent)' 
                            : 'color-mix(in oklab, white 4%, transparent)',
                          borderColor: isBestValue 
                            ? undefined 
                            : 'color-mix(in oklab, white 8%, transparent)'
                        }}
                      >
                        {/* Account Size Header */}
                        <div className={`p-3 text-center ${isBestValue ? 'pt-4' : ''}`}>
                          <div className="text-gray-400 text-[9px] font-medium mb-0.5">Account</div>
                          <div className="text-white text-lg font-bold">
                            ${account >= 1000 ? `${account / 1000}K` : account}
                          </div>
                        </div>

                        {/* Feature Values */}
                        <div className="flex flex-col">
                          {pricingFeatures.map((feature, idx) => {
                            const value = feature.getValue();
                            
                            return (
                              <div 
                                key={idx} 
                                className="h-[44px] flex items-center justify-center px-1.5"
                                style={{
                                  borderTop: '1px solid',
                                  borderColor: 'color-mix(in oklab, white 8%, transparent)'
                                }}
                              >
                                <span className="text-white text-[11px] font-medium text-center">{value}</span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Pricing */}
                        <div 
                          className="p-3 pt-2"
                          style={{
                            borderTop: '1px solid',
                            borderColor: 'color-mix(in oklab, white 8%, transparent)'
                          }}
                        >
                          <div className="flex items-center justify-center gap-1.5 mb-3">
                            <span className="text-exodus-light-blue text-lg font-bold">${currentConfig.prices[account]}</span>
                          </div>
                          
                          <button
                            onClick={() => {
                              trackInitiateCheckout();
                              window.location.href = '/purchase';
                            }}
                            className="w-full bg-exodus-light-blue hover:bg-blue-400 text-white font-bold py-1.5 px-2 rounded-md transition-all duration-300 hover:scale-105 text-xs"
                          >
                            Start now
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden px-4">
            {/* Mobile Account Selector */}
            <div className="flex justify-center gap-1.5 mb-5 flex-wrap">
              {currentConfig.accounts.map((account) => (
                <button
                  key={account}
                  onClick={() => setSelectedMobileAccount(account)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all duration-300 ${
                    selectedMobileAccount === account
                      ? 'bg-exodus-light-blue text-white'
                      : 'text-white border'
                  }`}
                  style={{
                    backgroundColor: selectedMobileAccount === account ? undefined : 'color-mix(in oklab, white 4%, transparent)',
                    borderColor: 'color-mix(in oklab, white 8%, transparent)'
                  }}
                >
                  ${account >= 1000 ? `${account / 1000}K` : account}
                </button>
              ))}
            </div>

            {/* Mobile Card */}
            <div className="max-w-sm mx-auto">
              <div 
                className="border rounded-xl overflow-hidden"
                style={{
                  backgroundColor: 'color-mix(in oklab, white 4%, transparent)',
                  borderColor: 'color-mix(in oklab, white 8%, transparent)'
                }}
              >
                {/* Header */}
                <div 
                  className="p-5 text-center"
                  style={{
                    borderBottom: '1px solid',
                    borderColor: 'color-mix(in oklab, white 8%, transparent)'
                  }}
                >
                  <div className="text-gray-400 text-xs font-medium mb-1">Account</div>
                  <div className="text-white text-3xl font-bold">${selectedMobileAccount.toLocaleString()}</div>
                </div>

                {/* Features */}
                <div className="divide-y" style={{ borderColor: 'color-mix(in oklab, white 8%, transparent)' }}>
                  {pricingFeatures.map((feature, idx) => {
                    const value = feature.getValue();
                    
                    return (
                      <div key={idx} className="flex items-center justify-between px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">{feature.icon}</span>
                          <span className="text-white text-sm">{feature.label}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-white text-sm font-medium">{value}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pricing */}
                <div 
                  className="p-5"
                  style={{
                    borderTop: '1px solid',
                    borderColor: 'color-mix(in oklab, white 8%, transparent)'
                  }}
                >
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="text-exodus-light-blue text-2xl font-bold">${currentConfig.prices[selectedMobileAccount]}</span>
                  </div>
                  
                  <button
                    onClick={() => {
                      trackInitiateCheckout();
                      window.location.href = '/purchase';
                    }}
                    className="w-full bg-exodus-light-blue hover:bg-blue-400 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 text-base"
                  >
                    Start now
                  </button>
                </div>
              </div>
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
                  <span className="text-sm md:text-base">Single-phase (1-step) evaluation</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-exodus-light-blue text-sm md:text-base">✓</span>
                  <span className="text-sm md:text-base">Up to 1:100 Leverage on all pairs</span>
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
                  <span className="text-sm md:text-base">Up to 90% profit share</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-exodus-light-blue text-sm md:text-base">✓</span>
                  <span className="text-sm md:text-base">No time limits to pass</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-exodus-light-blue text-sm md:text-base">✓</span>
                  <span className="text-sm md:text-base">Account scaling available</span>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Support Section */}
          <div className="mt-16 md:mt-20">
            <div className="max-w-6xl mx-auto">
              {/* Mobile Layout */}
              <div className="md:hidden flex flex-col items-center gap-8">
                {/* Platform Image */}
                <div className="w-full px-4">
                  <Image
                    src="/platforms.png"
                    alt="Trading Platforms - MT4, MT5, cTrader, DXtrade"
                    width={600}
                    height={600}
                    className="w-full h-auto object-contain"
                  />
                </div>

                {/* Text Content */}
                <div className="text-center px-4">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    We Support Major Platforms
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-md mx-auto">
                    At Exodus, we want to give you options. That's why we offer the flexibility to tailor your experience and choose between MT4 and MT5. Pick the professional trading platform that suits you best.
                  </p>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:grid md:grid-cols-2 gap-16 items-center">
                {/* Left - Text Content */}
                <div>
                  <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                    We Support Major Platforms
                  </h3>
                  <p className="text-gray-300 text-base leading-relaxed mb-6">
                    At Exodus, we want to give you options. That's why we offer the flexibility to tailor your experience and choose between MT4 and MT5. Pick the professional trading platform that suits you best.
                  </p>
                </div>

                {/* Right - Platform Image */}
                <div className="w-full">
                  <Image
                    src="/platforms.png"
                    alt="Trading Platforms - MT4, MT5, cTrader, DXtrade"
                    width={800}
                    height={800}
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 bg-exodus-dark">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-4">
            Rules to Support Traders
          </h2>
          <p className="text-center text-gray-300 mb-12 text-lg">
            Our rules are clear, consistent, and focus on risk management.
          </p>

          <h3 className="text-3xl font-bold text-center text-exodus-light-blue mb-8">
            FREQUENTLY ASKED QUESTIONS
          </h3>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-900 rounded-xl shadow-md border-2 border-gray-800 hover:border-exodus-light-blue/30 transition overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 flex justify-between items-center text-left"
                >
                  <span className="font-semibold text-white text-lg">
                    {faq.question}
                  </span>
                  <span className="text-exodus-light-blue text-2xl">
                    {openFaq === index ? "−" : "+"}
                  </span>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-5 text-gray-300">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gray-900 rounded-xl shadow-lg p-8 border-l-4 border-exodus-light-blue">
            <h4 className="text-xl font-bold text-white mb-2 italic">
              NEED MORE HELP?
            </h4>
            <p className="text-gray-300 mb-4">
              We have an in-house support team to assist with all inquiries.
            </p>
            <button className="bg-transparent border-2 border-exodus-light-blue text-exodus-light-blue hover:bg-exodus-light-blue hover:text-white px-6 py-2 rounded-lg font-semibold transition">
              CONTACT SUPPORT
            </button>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 md:py-20 px-4 bg-exodus-dark">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Discord */}
            <div className="hidden">
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
              Disclaimer: Exodus Trading Ltd. provides access to simulated trading environments strictly for educational and evaluative purposes. No live trading occurs, and no real funds are invested, traded, or managed. All activities are demo-based using virtual balances with no cash value. Participation in our challenges does not constitute a financial service or investment opportunity. We do not offer financial advice or facilitate real-market trading. Payments are for platform access only and are non-refundable. Use of our services is subject to our Terms & Conditions and Privacy Policy.
              <br /><br />
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
              may exist between Exodus and each FT, Exodus earns fees each time an evaluation trader fails, conflicts of interest may also exist between Exodus and each evaluation trader.
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
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  );
}
