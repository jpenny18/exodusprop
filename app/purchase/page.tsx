"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { WhopCheckoutEmbed } from "@whop/checkout/react";
import { auth } from "@/lib/firebase";
import { createUser, savePurchase, signIn } from "@/lib/auth-helpers";
import { onAuthStateChanged } from "firebase/auth";
import { trackViewContent, trackInitiateCheckout, trackPurchase } from "@/lib/facebookPixel";

export default function PurchasePage() {
  const [selectedAccount, setSelectedAccount] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<"MT4" | "MT5">("MT4"); // Default to MT4
  const [selectedPlanType, setSelectedPlanType] = useState<"onestep" | "elite">("onestep");
  const [formData, setFormData] = useState({
    // Billing Info
    firstName: "",
    lastName: "",
    email: "",
    // Billing Address
    streetAddress: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    // Checkboxes
    agreeTerms: false,
    agreeProgramRules: false,
    agreeRefundPolicy: false,
  });

  const accountConfigs = {
    onestep: [
      { size: "$10,000", price: 109, label: "10K", planId: "plan_ngeGzBF830xlL" },
      { size: "$25,000", price: 247, label: "25K", planId: "plan_FyRDLrDEd8ilp" },
      { size: "$50,000", price: 399, label: "50K", planId: "plan_XB7LYZSLzaljt" },
      { size: "$100,000", price: 699, label: "100K", planId: "plan_JJ9nO8LMXVsCD" },
      { size: "$200,000", price: 1499, label: "200K", planId: "plan_mDL1lFqScmlUK" },
    ],
    elite: [
      { size: "$10,000", price: 209, label: "10K", planId: "plan_TQL10iopYwgY5" },
      { size: "$25,000", price: 599, label: "25K", planId: "plan_unGvM5aTCqyU4" },
      { size: "$50,000", price: 799, label: "50K", planId: "plan_Mc0eXyrWMsN6w" },
      { size: "$100,000", price: 1299, label: "100K", planId: "plan_kfWFgzIVfrJ5d" },
      { size: "$200,000", price: 2599, label: "200K", planId: "plan_QtVFJl2muh80m" },
    ]
  };

  const accounts = accountConfigs[selectedPlanType];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Check if all required fields are filled
  const isFormValid = () => {
    const allFieldsFilled = 
      formData.firstName.trim() !== "" &&
      formData.lastName.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.streetAddress.trim() !== "" &&
      formData.city.trim() !== "" &&
      formData.state.trim() !== "" &&
      formData.country.trim() !== "" &&
      formData.postalCode.trim() !== "";
    // Note: selectedPlatform always has a value (defaults to MT4), so no need to validate
    
    const allCheckboxesChecked = 
      formData.agreeTerms &&
      formData.agreeProgramRules &&
      formData.agreeRefundPolicy;

    return allFieldsFilled && allCheckboxesChecked;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;
    
    // Show Whop payment embed
    setShowPayment(true);
  };

  const handleCryptoPayment = () => {
    if (!isFormValid()) {
      alert('Please fill in all required fields before proceeding to payment.');
      return;
    }

    // Store challenge data in sessionStorage for the payment page
    const challengeData = {
      type: selectedPlanType === 'onestep' ? '1-Step' : 'Elite',
      amount: accounts[selectedAccount].size,
      platform: selectedPlatform,
      formData: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: '', // Not collected in current form
        country: formData.country,
        discordUsername: ''
      },
      price: accounts[selectedAccount].price,
      addOns: []
    };

    sessionStorage.setItem('challengeData', JSON.stringify(challengeData));
    window.location.href = '/purchase/payment';
  };


  const handlePaymentComplete = async (planId: string, receiptId?: string) => {
    try {
      // Track successful purchase with Meta Pixel
      trackPurchase(accounts[selectedAccount].price, "USD");
      
      // Check if user is already authenticated
      const currentUser = auth.currentUser;
      let userId = currentUser?.uid;

      // Predetermined temporary password
      const TEMP_PASSWORD = "ExodusTemp2025!";

      // If not authenticated, create new account with temporary password
      if (!currentUser) {
        try {
          const newUser = await createUser({
            email: formData.email,
            password: TEMP_PASSWORD,
            displayName: `${formData.firstName} ${formData.lastName}`,
            country: formData.country,
            requiresPasswordChange: true, // Flag to force password change
          });
          userId = newUser.uid;
          
          console.log("New user created with temp password:", newUser.uid);
        } catch (error: any) {
          // User might already exist, try to sign them in
          console.log("User might already exist, attempting sign in:", error.message);
          try {
            await signIn(formData.email, TEMP_PASSWORD);
            const signedInUser = auth.currentUser;
            if (signedInUser) {
              userId = signedInUser.uid;
            }
          } catch (signInError) {
            console.error("Could not sign in existing user:", signInError);
            // User exists but has different password - they'll need to login manually
          }
        }
      }

      // Save purchase to Firebase
      if (userId) {
        await savePurchase({
          userId,
          email: formData.email,
          accountSize: accounts[selectedAccount].size,
          accountPrice: accounts[selectedAccount].price,
          platform: selectedPlatform as "MT4" | "MT5",
          planId,
          receiptId: receiptId || "N/A",
          billingInfo: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            streetAddress: formData.streetAddress,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            postalCode: formData.postalCode,
          },
          timestamp: new Date().toISOString(),
          status: 'completed',
          paymentMethod: 'card', // Whop card payment
        });

        // Create pending account (credentials will be added by admin)
        const { createTradingAccount } = await import("@/lib/auth-helpers");
        await createTradingAccount({
          userId,
          accountSize: accounts[selectedAccount].size,
          accountType: selectedPlanType === 'onestep' ? "1-Step" : "Elite",
          platform: selectedPlatform as "MT4" | "MT5",
          planId,
          receiptId: receiptId || "N/A",
        });

        // Send confirmation emails to customer and admin
        try {
          await fetch('/api/send-purchase-emails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              customerEmail: formData.email,
              customerName: `${formData.firstName} ${formData.lastName}`,
              accountSize: accounts[selectedAccount].size,
              platform: selectedPlatform,
              price: accounts[selectedAccount].price,
              paymentMethod: 'card'
            })
          });
        } catch (emailError) {
          console.error('Error sending confirmation emails:', emailError);
          // Don't block the flow if email fails
        }
      }

      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error processing purchase:", error);
      alert("Purchase completed but there was an error setting up your account. Please contact support.");
      window.location.href = "/dashboard";
    }
  };

  const countries = [
    "United States", "United Kingdom", "Canada", "Australia", "Germany",
    "France", "Spain", "Italy", "Netherlands", "Brazil", "Mexico",
    "India", "China", "Japan", "South Korea", "Singapore", "UAE",
    "South Africa", "Nigeria", "Other"
  ];

  // Track ViewContent and InitiateCheckout when landing on purchase page
  useEffect(() => {
    trackViewContent({ page: "purchase" });
    trackInitiateCheckout();
  }, []);

  return (
    <main className="min-h-screen bg-exodus-dark relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-exodus-light-blue rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <nav className="relative z-10 border-b border-exodus-light-blue/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16 md:h-20 mt-4 md:mt-8">
            <Link href="/" className="flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Exodus Logo"
                width={200}
                height={200}
                priority
                className="h-40 md:h-60 w-auto"
              />
            </Link>
          </div>
        </div>
      </nav>

      {/* Purchase Container */}
      <div className="relative z-10 px-4 py-6 md:py-12 max-w-6xl mx-auto">

        {!showPayment ? (
          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
            {/* Card 1: Billing Information */}
            <div className="space-y-6">
              {/* Billing Info Section */}
              <div 
                className="rounded-2xl p-5 md:p-8 shadow-2xl"
                style={{
                  backgroundColor: 'color-mix(in oklab, white 4%, transparent)',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: 'color-mix(in oklab, white 8%, transparent)'
                }}
              >
                <h2 className="text-xl md:text-2xl font-bold text-white mb-5 md:mb-6 flex items-center gap-2">
                  <span className="bg-exodus-light-blue w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                  Billing Information
                </h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-white text-sm font-semibold mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2.5 md:py-3 rounded-lg border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-exodus-light-blue transition text-sm md:text-base"
                        style={{ backgroundColor: 'color-mix(in oklab, white 5%, transparent)' }}
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-white text-sm font-semibold mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2.5 md:py-3 rounded-lg border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-exodus-light-blue transition text-sm md:text-base"
                        style={{ backgroundColor: 'color-mix(in oklab, white 5%, transparent)' }}
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-white text-sm font-semibold mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 md:py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-exodus-light-blue transition text-sm md:text-base"
                      placeholder="john.doe@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Billing Address Section */}
              <div 
                className="rounded-2xl p-5 md:p-8 shadow-2xl"
                style={{
                  backgroundColor: 'color-mix(in oklab, white 4%, transparent)',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: 'color-mix(in oklab, white 8%, transparent)'
                }}
              >
                <h2 className="text-xl md:text-2xl font-bold text-white mb-5 md:mb-6 flex items-center gap-2">
                  <span className="bg-exodus-light-blue w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                  Billing Address
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="streetAddress" className="block text-white text-sm font-semibold mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      id="streetAddress"
                      name="streetAddress"
                      value={formData.streetAddress}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 md:py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-exodus-light-blue transition text-sm md:text-base"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-white text-sm font-semibold mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2.5 md:py-3 rounded-lg border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-exodus-light-blue transition text-sm md:text-base"
                        style={{ backgroundColor: 'color-mix(in oklab, white 5%, transparent)' }}
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-white text-sm font-semibold mb-2">
                        State/Province *
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2.5 md:py-3 rounded-lg border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-exodus-light-blue transition text-sm md:text-base"
                        style={{ backgroundColor: 'color-mix(in oklab, white 5%, transparent)' }}
                        placeholder="NY"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="country" className="block text-white text-sm font-semibold mb-2">
                        Country *
                      </label>
                      <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2.5 md:py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-exodus-light-blue transition appearance-none cursor-pointer text-sm md:text-base"
                      >
                        <option value="" className="bg-exodus-dark">Select country</option>
                        {countries.map((country) => (
                          <option key={country} value={country} className="bg-exodus-dark">
                            {country}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="postalCode" className="block text-white text-sm font-semibold mb-2">
                        Postal/Zip Code *
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2.5 md:py-3 rounded-lg border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-exodus-light-blue transition text-sm md:text-base"
                        style={{ backgroundColor: 'color-mix(in oklab, white 5%, transparent)' }}
                        placeholder="10001"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Order Information */}
            <div className="space-y-6">
              <div 
                className="rounded-2xl p-5 md:p-8 shadow-2xl"
                style={{
                  backgroundColor: 'color-mix(in oklab, white 4%, transparent)',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: 'color-mix(in oklab, white 8%, transparent)'
                }}
              >
                <h2 className="text-xl md:text-2xl font-bold text-white mb-5 md:mb-6 flex items-center gap-2">
                  <span className="bg-exodus-light-blue w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                  Order Information
                </h2>

                {/* Plan Type Selection */}
                <div className="mb-6">
                  <label className="block text-white text-sm font-semibold mb-3">
                    Plan Type *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedPlanType("onestep")}
                      className={`px-4 py-3 rounded-lg font-bold transition border-2 ${
                        selectedPlanType === "onestep"
                          ? "bg-exodus-light-blue border-exodus-light-blue text-white shadow-lg shadow-exodus-light-blue/30"
                          : "border-white/20 text-white hover:border-exodus-light-blue/50"
                      }`}
                      style={{
                        backgroundColor: selectedPlanType === "onestep" ? undefined : 'color-mix(in oklab, white 5%, transparent)'
                      }}
                    >
                      Exodus 1-Step
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPlanType("elite")}
                      className={`px-4 py-3 rounded-lg font-bold transition border-2 ${
                        selectedPlanType === "elite"
                          ? "bg-exodus-light-blue border-exodus-light-blue text-white shadow-lg shadow-exodus-light-blue/30"
                          : "border-white/20 text-white hover:border-exodus-light-blue/50"
                      }`}
                      style={{
                        backgroundColor: selectedPlanType === "elite" ? undefined : 'color-mix(in oklab, white 5%, transparent)'
                      }}
                    >
                      Exodus Elite
                    </button>
                  </div>
                </div>

                {/* Platform Selection */}
                <div className="mb-6">
                  <label className="block text-white text-sm font-semibold mb-3">
                    Trading Platform *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedPlatform("MT4")}
                      className={`px-4 py-3 rounded-lg font-bold transition border-2 ${
                        selectedPlatform === "MT4"
                          ? "bg-exodus-light-blue border-exodus-light-blue text-white shadow-lg shadow-exodus-light-blue/30"
                          : "border-white/20 text-white hover:border-exodus-light-blue/50"
                      }`}
                      style={{
                        backgroundColor: selectedPlatform === "MT4" ? undefined : 'color-mix(in oklab, white 5%, transparent)'
                      }}
                    >
                      MetaTrader 4
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPlatform("MT5")}
                      className={`px-4 py-3 rounded-lg font-bold transition border-2 ${
                        selectedPlatform === "MT5"
                          ? "bg-exodus-light-blue border-exodus-light-blue text-white shadow-lg shadow-exodus-light-blue/30"
                          : "border-white/20 text-white hover:border-exodus-light-blue/50"
                      }`}
                      style={{
                        backgroundColor: selectedPlatform === "MT5" ? undefined : 'color-mix(in oklab, white 5%, transparent)'
                      }}
                    >
                      MetaTrader 5
                    </button>
                  </div>
                </div>

                {/* Account Balance Selection */}
                <div className="mb-6">
                  <label className="block text-white text-sm font-semibold mb-3">
                    Account Balance *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {accounts.map((account, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedAccount(index)}
                        className={`px-4 py-3 rounded-lg font-bold transition border-2 ${
                          index === selectedAccount
                            ? "bg-exodus-light-blue border-exodus-light-blue text-white shadow-lg shadow-exodus-light-blue/30"
                            : "border-white/20 text-white hover:border-exodus-light-blue/50"
                        }`}
                        style={{
                          backgroundColor: index === selectedAccount ? undefined : 'color-mix(in oklab, white 5%, transparent)'
                        }}
                      >
                        <div className="text-lg md:text-xl">{account.label}</div>
                        <div className="text-xs text-gray-300 mt-1">{account.size}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div 
                  className="rounded-lg p-4 md:p-5 mb-6"
                  style={{
                    backgroundColor: 'color-mix(in oklab, white 3%, transparent)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'color-mix(in oklab, white 8%, transparent)'
                  }}
                >
                  <h3 className="text-white font-semibold mb-3 text-base md:text-lg">Order Summary</h3>
                  <div className="space-y-2 text-sm md:text-base">
                    <div className="flex justify-between text-gray-300">
                      <span>Account Size:</span>
                      <span className="text-white font-semibold">{accounts[selectedAccount].size}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Evaluation Type:</span>
                      <span className="text-white font-semibold">{selectedPlanType === 'onestep' ? 'Exodus 1-Step' : 'Exodus Elite'}</span>
                    </div>
                    <div className="border-t border-white/20 my-3"></div>
                    <div className="flex justify-between text-white font-bold text-lg md:text-xl">
                      <span>Total:</span>
                      <span className="text-exodus-light-blue">${accounts[selectedAccount].price}</span>
                    </div>
                  </div>
                </div>

                {/* Agreement Checkboxes */}
                <div className="space-y-3 mb-6">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                      required
                      className="mt-1 w-5 h-5 rounded border-2 border-white/20 bg-white/10 checked:bg-exodus-light-blue checked:border-exodus-light-blue focus:outline-none focus:ring-2 focus:ring-exodus-light-blue/50 transition cursor-pointer shrink-0"
                    />
                    <span className="text-white text-xs md:text-sm leading-tight group-hover:text-exodus-light-blue transition">
                      I agree to the{" "}
                      <Link href="/terms" className="text-exodus-light-blue hover:underline font-semibold">
                        Terms of Use
                      </Link>
                      {", "}
                      <Link href="/privacy" className="text-exodus-light-blue hover:underline font-semibold">
                        Privacy Policy
                      </Link>
                      {" "}and confirm I am over 18 years of age
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="agreeProgramRules"
                      checked={formData.agreeProgramRules}
                      onChange={handleInputChange}
                      required
                      className="mt-1 w-5 h-5 rounded border-2 border-white/20 bg-white/10 checked:bg-exodus-light-blue checked:border-exodus-light-blue focus:outline-none focus:ring-2 focus:ring-exodus-light-blue/50 transition cursor-pointer shrink-0"
                    />
                    <span className="text-white text-xs md:text-sm leading-tight group-hover:text-exodus-light-blue transition">
                      I have read, understood, and agree to the{" "}
                      <Link href="/program-rules" className="text-exodus-light-blue hover:underline font-semibold">
                        Program Rules
                      </Link>
                      {" "}and{" "}
                      <Link href="/evaluation-agreement" className="text-exodus-light-blue hover:underline font-semibold">
                        Evaluation Agreement
                      </Link>
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="agreeRefundPolicy"
                      checked={formData.agreeRefundPolicy}
                      onChange={handleInputChange}
                      required
                      className="mt-1 w-5 h-5 rounded border-2 border-white/20 bg-white/10 checked:bg-exodus-light-blue checked:border-exodus-light-blue focus:outline-none focus:ring-2 focus:ring-exodus-light-blue/50 transition cursor-pointer shrink-0"
                    />
                    <span className="text-white text-xs md:text-sm leading-tight group-hover:text-exodus-light-blue transition">
                      I agree to the{" "}
                      <Link href="/refund" className="text-exodus-light-blue hover:underline font-semibold">
                        Refund Policy
                      </Link>
                      {" "}and{" "}
                      <Link href="/chargeback-policy" className="text-exodus-light-blue hover:underline font-semibold">
                        Chargeback Policy
                      </Link>
                    </span>
                  </label>
                </div>

                {/* Purchase Buttons */}
                <button
                  type="submit"
                  disabled={!isFormValid()}
                  className={`w-full mt-6 py-3 md:py-4 rounded-lg font-bold text-base md:text-lg transition shadow-lg ${
                    isFormValid()
                      ? "bg-exodus-light-blue hover:bg-blue-400 text-white shadow-exodus-light-blue/30 cursor-pointer"
                      : "bg-gray-600 text-gray-400 cursor-not-allowed opacity-50"
                  }`}
                >
                  {isFormValid() ? `PAY WITH CARD - $${accounts[selectedAccount].price}` : "COMPLETE ALL FIELDS TO CONTINUE"}
                </button>

                <p className="text-center text-gray-400 text-xs mt-4">
                  Secure checkout
                </p>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span 
                      className="px-4 text-gray-400"
                      style={{ backgroundColor: 'color-mix(in oklab, white 5%, transparent)' }}
                    >
                      OR
                    </span>
                  </div>
                </div>

                {/* Crypto Payment Button */}
                <button
                  type="button"
                  onClick={handleCryptoPayment}
                  disabled={!isFormValid()}
                  className={`w-full py-3 md:py-4 rounded-lg font-bold text-base md:text-lg transition shadow-lg border-2 ${
                    isFormValid()
                      ? "border-green-500 bg-green-500/10 hover:bg-green-500/20 text-green-400 cursor-pointer"
                      : "border-gray-600 bg-gray-600/10 text-gray-400 cursor-not-allowed opacity-50"
                  }`}
                >
                  {isFormValid() ? `PAY WITH CRYPTO - $${accounts[selectedAccount].price}` : "COMPLETE ALL FIELDS TO CONTINUE"}
                </button>

                <p className="text-center text-gray-400 text-xs mt-4">
                  Supports BTC, ETH, USDT (TRC20), USDC (Solana)
                </p>
              </div>
            </div>

            {/* Card 2 Continued: Billing Address (moved to left column on mobile) */}
          </div>
        </form>
        ) : (
          /* Payment Step with Whop Embed */
          <div className="max-w-3xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => setShowPayment(false)}
              className="mb-6 text-white hover:text-exodus-light-blue transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to billing information
            </button>

            {/* Order Summary Card */}
            <div 
              className="rounded-2xl p-5 md:p-8 shadow-2xl mb-6"
              style={{
                backgroundColor: 'color-mix(in oklab, white 4%, transparent)',
                borderWidth: '2px',
                borderStyle: 'solid',
                borderColor: 'color-mix(in oklab, white 8%, transparent)'
              }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 text-center">
                Complete Your Payment
              </h2>
              
              <div 
                className="rounded-lg p-4 mb-6"
                style={{
                  backgroundColor: 'color-mix(in oklab, white 3%, transparent)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'color-mix(in oklab, white 8%, transparent)'
                }}
              >
                <div className="space-y-2 text-sm md:text-base">
                  <div className="flex justify-between text-gray-300">
                    <span>Account Size:</span>
                    <span className="text-white font-semibold">{accounts[selectedAccount].size}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Evaluation Type:</span>
                    <span className="text-white font-semibold">{selectedPlanType === 'onestep' ? 'Exodus 1-Step' : 'Exodus Elite'}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Email:</span>
                    <span className="text-white font-semibold">{formData.email}</span>
                  </div>
                  <div className="border-t border-white/20 my-3"></div>
                  <div className="flex justify-between text-white font-bold text-lg md:text-xl">
                    <span>Total:</span>
                    <span className="text-exodus-light-blue">${accounts[selectedAccount].price}</span>
                  </div>
                </div>
              </div>

              {/* Whop Payment Embed */}
              <div className="min-h-[400px] rounded-lg overflow-hidden">
                <WhopCheckoutEmbed
                  planId={accounts[selectedAccount].planId}
                  theme="dark"
                  hideAddressForm={true}
                  hideEmail={false}
                  prefill={{
                    email: formData.email,
                    address: {
                      name: `${formData.firstName} ${formData.lastName}`,
                      country: formData.country === "United States" ? "US" : 
                               formData.country === "United Kingdom" ? "GB" :
                               formData.country === "Canada" ? "CA" :
                               formData.country,
                      line1: formData.streetAddress,
                      city: formData.city,
                      state: formData.state,
                      postalCode: formData.postalCode,
                    }
                  }}
                  onComplete={handlePaymentComplete}
                  fallback={
                    <div className="flex items-center justify-center h-96">
                      <div className="text-white text-lg">Loading payment form...</div>
                    </div>
                  }
                />
              </div>

              <p className="text-center text-gray-400 text-xs mt-6">
                Secure checkout
              </p>
            </div>
          </div>
        )}

        {/* Security Badges */}
        <div className="mt-8 md:mt-12 text-center">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-gray-400 text-xs md:text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-exodus-light-blue" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-exodus-light-blue" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-exodus-light-blue" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
              </svg>
              <span>Instant Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

