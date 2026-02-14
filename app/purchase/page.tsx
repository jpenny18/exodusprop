"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { trackViewContent, trackInitiateCheckout } from "@/lib/facebookPixel";

interface AccountConfig {
  platform: "MT4" | "MT5";
  planType: "onestep" | "elite";
  accountBalance: number;
}

export default function PurchasePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  // Single account configuration
  const [account, setAccount] = useState<AccountConfig>({
    platform: "MT4",
    planType: "onestep",
    accountBalance: 0
  });

  // Account size configurations with checkout links by plan type
  const accountSizeConfigs = {
    onestep: {
      10000: {
        size: "$10,000",
        label: "10K",
        price: 81,
        planId: "plan_hY7Q87XDJQ0ZH"
      },
      25000: {
        size: "$25,000",
        label: "25K",
        price: 128,
        planId: "plan_lYPlyXnR5FmWM"
      },
      50000: {
        size: "$50,000",
        label: "50K",
        price: 174,
        planId: "plan_VBWXWtNaq1pkz"
      },
      100000: {
        size: "$100,000",
        label: "100K",
        price: 336,
        planId: "plan_FLH1rPJ7IXESW"
      },
      200000: {
        size: "$200,000",
        label: "200K",
        price: 647,
        planId: "plan_O5TvrmzcT1FQn"
      }
    },
    elite: {
      10000: {
        size: "$10,000",
        label: "10K",
        price: 209,
        planId: "plan_J91P8oD10IGOr"
      },
      25000: {
        size: "$25,000",
        label: "25K",
        price: 599,
        planId: "plan_AqbdFzpY0Lfid"
      },
      50000: {
        size: "$50,000",
        label: "50K",
        price: 799,
        planId: "plan_8lQEle49ulWVT"
      },
      100000: {
        size: "$100,000",
        label: "100K",
        price: 1299,
        planId: "plan_oUoKhvNcTf6aV"
      },
      200000: {
        size: "$200,000",
        label: "200K",
        price: 2599,
        planId: "plan_3A4Ug4rs6JXE9"
      }
    }
  };

  const accountBalances = [
    { size: "$10,000", value: 10000, label: "10K" },
    { size: "$25,000", value: 25000, label: "25K" },
    { size: "$50,000", value: 50000, label: "50K" },
    { size: "$100,000", value: 100000, label: "100K" },
    { size: "$200,000", value: 200000, label: "200K" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAccountChange = (field: keyof AccountConfig, value: any) => {
    setAccount(prev => ({ ...prev, [field]: value }));
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
    
    const allCheckboxesChecked = 
      formData.agreeTerms &&
      formData.agreeProgramRules &&
      formData.agreeRefundPolicy;

    // Check that account has a valid balance selected
    const accountValid = account.accountBalance > 0;

    return allFieldsFilled && allCheckboxesChecked && accountValid;
  };

  // Handle "PAY WITH CARD" button - saves order to Firebase FIRST, then redirects to Whop checkout
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Generate a unique order ID for tracking
      const orderId = `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const accountConfig = accountSizeConfigs[account.planType][account.accountBalance as keyof typeof accountSizeConfigs.onestep];
      
      if (!accountConfig) {
        throw new Error('Invalid account size or plan type selected');
      }
      
      // Format account data for storage
      const accountData = {
        platform: account.platform,
        planType: account.planType === 'onestep' ? '1-Step' : 'Elite',
        accountBalance: accountConfig.size,
        accountBalanceValue: account.accountBalance
      };
      
      // Save pending order to Firebase BEFORE redirecting to payment
      const orderData = {
        orderId: orderId,
        email: formData.email,
        customerName: `${formData.firstName} ${formData.lastName}`,
        accountSize: accountConfig.size,
        accountPrice: accountConfig.price,
        platform: account.platform,
        planType: accountData.planType,
        planId: accountConfig.planId,
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
        status: 'pending', // Will be updated to 'completed' when Whop payment succeeds
        paymentMethod: 'card',
        source: 'checkout_form', // Track that this came from form submission
      };
      
      // Save to Firebase via API (bypasses client security rules)
      const saveResponse = await fetch('/api/card-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      
      if (!saveResponse.ok) {
        throw new Error('Failed to save order');
      }
      
      const savedOrder = await saveResponse.json();
      console.log('[Purchase] Pending order saved:', savedOrder.orderId, 'Plan Type:', accountData.planType, 'Account Size:', accountConfig.size);
      
      // Send admin notification email about the pending card order
      try {
        await fetch('/api/send-card-order-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...orderData,
            orderId: savedOrder.orderId,
          })
        });
        console.log('[Purchase] Admin notification sent for pending order');
      } catch (emailError) {
        console.error('[Purchase] Error sending admin email:', emailError);
        // Don't block the flow if email fails
      }
      
      // Track checkout initiation with Meta Pixel
      const trackInitiateCheckout = (await import("@/lib/facebookPixel")).trackInitiateCheckout;
      trackInitiateCheckout();
      
      // Redirect to the appropriate Whop checkout link based on account size
      const checkoutUrl = `https://whop.com/checkout/${accountConfig.planId}`;
      console.log('[Purchase] Redirecting to checkout:', checkoutUrl);
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('[Purchase] Error saving pending order:', error);
      alert('There was an error processing your request. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleCryptoPayment = () => {
    if (!isFormValid()) {
      alert('Please fill in all required fields before proceeding to payment.');
      return;
    }

    const accountConfig = accountSizeConfigs[account.planType][account.accountBalance as keyof typeof accountSizeConfigs.onestep];
    
    if (!accountConfig) {
      alert('Please select a valid account size and plan type.');
      return;
    }
    
    // Store challenge data in sessionStorage for the payment page
    const challengeData = {
      type: account.planType === 'onestep' ? '1-Step' : 'Elite',
      amount: accountConfig.size,
      platform: account.platform,
      formData: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: '', // Not collected in current form
        country: formData.country,
        discordUsername: ''
      },
      price: accountConfig.price,
      addOns: []
    };

    sessionStorage.setItem('challengeData', JSON.stringify(challengeData));
    window.location.href = '/purchase/payment';
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
            <span className="flex items-center justify-center cursor-default select-none">
              <Image
                src="/logo.png"
                alt="Exodus Logo"
                width={200}
                height={200}
                priority
                className="h-40 md:h-60 w-auto pointer-events-none select-none"
                draggable={false}
              />
            </span>
          </div>
        </div>
      </nav>

      {/* Purchase Container */}
      <div className="relative z-10 px-4 py-6 md:py-12 max-w-6xl mx-auto">

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

                {/* Account Configuration */}
                <div className="space-y-4 mb-6">
                  <div 
                    className="rounded-lg p-4 md:p-5 border border-white/10"
                    style={{
                      backgroundColor: 'color-mix(in oklab, white 3%, transparent)',
                    }}
                  >
                    {/* Plan Type */}
                    <div className="mb-4">
                      <label className="block text-white text-xs font-semibold mb-2">
                        Plan Type *
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleAccountChange('planType', 'onestep')}
                          className={`px-3 py-2 rounded-lg text-sm font-bold transition border ${
                            account.planType === "onestep"
                              ? "bg-exodus-light-blue border-exodus-light-blue text-white"
                              : "border-white/20 text-white hover:border-exodus-light-blue/50"
                          }`}
                          style={{
                            backgroundColor: account.planType === "onestep" ? undefined : 'color-mix(in oklab, white 5%, transparent)'
                          }}
                        >
                          1-Step
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAccountChange('planType', 'elite')}
                          className={`px-3 py-2 rounded-lg text-sm font-bold transition border ${
                            account.planType === "elite"
                              ? "bg-exodus-light-blue border-exodus-light-blue text-white"
                              : "border-white/20 text-white hover:border-exodus-light-blue/50"
                          }`}
                          style={{
                            backgroundColor: account.planType === "elite" ? undefined : 'color-mix(in oklab, white 5%, transparent)'
                          }}
                        >
                          Elite
                        </button>
                      </div>
                    </div>

                    {/* Platform Selection */}
                    <div className="mb-4">
                      <label className="block text-white text-xs font-semibold mb-2">
                        Trading Platform *
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleAccountChange('platform', 'MT4')}
                          className={`px-3 py-2 rounded-lg text-sm font-bold transition border ${
                            account.platform === "MT4"
                              ? "bg-exodus-light-blue border-exodus-light-blue text-white"
                              : "border-white/20 text-white hover:border-exodus-light-blue/50"
                          }`}
                          style={{
                            backgroundColor: account.platform === "MT4" ? undefined : 'color-mix(in oklab, white 5%, transparent)'
                          }}
                        >
                          MT4
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAccountChange('platform', 'MT5')}
                          className={`px-3 py-2 rounded-lg text-sm font-bold transition border ${
                            account.platform === "MT5"
                              ? "bg-exodus-light-blue border-exodus-light-blue text-white"
                              : "border-white/20 text-white hover:border-exodus-light-blue/50"
                          }`}
                          style={{
                            backgroundColor: account.platform === "MT5" ? undefined : 'color-mix(in oklab, white 5%, transparent)'
                          }}
                        >
                          MT5
                        </button>
                      </div>
                    </div>

                    {/* Account Balance Selection */}
                    <div>
                      <label className="block text-white text-xs font-semibold mb-2">
                        Account Size *
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {accountBalances.map((balance) => (
                          <button
                            key={balance.value}
                            type="button"
                            onClick={() => handleAccountChange('accountBalance', balance.value)}
                            className={`px-3 py-2 rounded-lg text-sm font-bold transition border ${
                              account.accountBalance === balance.value
                                ? "bg-exodus-light-blue border-exodus-light-blue text-white"
                                : "border-white/20 text-white hover:border-exodus-light-blue/50"
                            }`}
                            style={{
                              backgroundColor: account.accountBalance === balance.value ? undefined : 'color-mix(in oklab, white 5%, transparent)'
                            }}
                          >
                            {balance.label}
                          </button>
                        ))}
                      </div>
                    </div>
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
                      <span className="text-white font-semibold">
                        {account.accountBalance > 0 
                          ? accountSizeConfigs[account.planType][account.accountBalance as keyof typeof accountSizeConfigs.onestep]?.size 
                          : 'Not selected'}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Plan Type:</span>
                      <span className="text-white font-semibold">{account.planType === 'onestep' ? '1-Step' : 'Elite'}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Platform:</span>
                      <span className="text-white font-semibold">{account.platform}</span>
                    </div>
                    <div className="border-t border-white/20 my-3"></div>
                    <div className="flex justify-between text-white font-bold text-lg md:text-xl">
                      <span>Total:</span>
                      <span className="text-exodus-light-blue">
                        ${account.accountBalance > 0 
                          ? accountSizeConfigs[account.planType][account.accountBalance as keyof typeof accountSizeConfigs.onestep]?.price 
                          : 0}
                      </span>
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
                {/* Credit Card Payment - Enabled */}
                <button
                  type="submit"
                  disabled={!isFormValid() || isSubmitting}
                  className={`w-full mt-6 py-3 md:py-4 rounded-lg font-bold text-base md:text-lg transition shadow-lg ${
                    isFormValid() && !isSubmitting
                      ? "bg-exodus-light-blue hover:bg-blue-400 text-white shadow-exodus-light-blue/30 cursor-pointer"
                      : "bg-gray-600 text-gray-400 cursor-not-allowed opacity-50"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : isFormValid() ? (
                    `PAY WITH CREDIT/CARD VIA WHOP - $${account.accountBalance > 0 ? accountSizeConfigs[account.planType][account.accountBalance as keyof typeof accountSizeConfigs.onestep]?.price : 0}`
                  ) : (
                    "COMPLETE ALL FIELDS TO CONTINUE"
                  )}
                </button>

                <p className="text-center text-gray-400 text-xs mt-4">
                  Secure checkout • One-time payment
                </p>

                {/* Crypto Payment Button - Now Primary */}
                <button
                  type="button"
                  onClick={handleCryptoPayment}
                  disabled={!isFormValid()}
                  className={`w-full mt-6 py-3 md:py-4 rounded-lg font-bold text-base md:text-lg transition shadow-lg ${
                    isFormValid()
                      ? "bg-green-500 hover:bg-green-600 text-white shadow-green-500/30 cursor-pointer"
                      : "bg-gray-600 text-gray-400 cursor-not-allowed opacity-50"
                  }`}
                >
                  {isFormValid() ? `PAY WITH CRYPTO - $${account.accountBalance > 0 ? accountSizeConfigs[account.planType][account.accountBalance as keyof typeof accountSizeConfigs.onestep]?.price : 0}` : "COMPLETE ALL FIELDS TO CONTINUE"}
                </button>

                <p className="text-center text-gray-400 text-xs mt-4">
                  Supports BTC, ETH, USDT (TRC20), USDC (Solana) • One-time payment
                </p>
              </div>
            </div>

            {/* Card 2 Continued: Billing Address (moved to left column on mobile) */}
          </div>
        </form>

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
