"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { userDashboardNavItems } from "@/lib/dashboard-nav";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function FAQPage() {
  const [userEmail, setUserEmail] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email || "");
      }
    });
    return () => unsubscribe();
  }, []);

  const faqs = [
    { q: "How do I start trading?", a: "After purchasing an account and completing KYC, you'll receive your trading credentials via email within 24 hours." },
    { q: "What are the profit targets?", a: "Our 1-Step evaluation requires an 8% profit target before you can move to a funded account." },
    { q: "What happens if I breach the rules?", a: "If you exceed the daily loss limit (4%) or max drawdown (6%), your account will be terminated. You can purchase a new account anytime." },
    { q: "Can I use EAs and bots?", a: "Yes! We allow EAs, trading bots, news trading, and holding positions over weekends." },
    { q: "How long does KYC take?", a: "KYC verification typically takes 24-48 hours. Ensure all documents are clear and meet our requirements." },
    { q: "What is the maximum leverage?", a: "All accounts come with up to 1:100 leverage." },
    { q: "Can I have multiple accounts?", a: "Yes, you can purchase and trade multiple accounts simultaneously." },
    { q: "How do payouts work?", a: "Once you are funded, you can request a payout at any time after hitting the minimum withdrawal threshold. Payouts are processed within 24hrs and are sent via USDT on the Tron network." },
  ];

  return (
    <DashboardLayout navItems={userDashboardNavItems} userEmail={userEmail}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Frequently Asked Questions</h1>
          <p className="text-gray-300">Find answers to common questions</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-lg border-2 border-exodus-light-blue/30 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5 transition"
              >
                <h3 className="text-white font-semibold text-lg pr-4">{faq.q}</h3>
                <svg 
                  className={`w-6 h-6 text-exodus-light-blue transform transition-transform shrink-0 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-300 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white/10 backdrop-blur-lg border-2 border-exodus-light-blue rounded-2xl p-6 md:p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Still have questions?</h3>
          <p className="text-gray-300 mb-4">Contact our support team for assistance</p>
          <a href="/dashboard/support" className="inline-block bg-exodus-light-blue hover:bg-blue-400 text-white px-6 py-3 rounded-lg font-semibold transition">
            Contact Support
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
}

