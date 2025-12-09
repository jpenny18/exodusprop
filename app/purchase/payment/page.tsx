'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bitcoin, Shield, RefreshCcw, HeadphonesIcon, Mail } from 'lucide-react';
import CryptoPayment from '@/components/CryptoPayment';

interface ChallengeData {
  type: string;
  amount: string;
  platform: string;
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    discordUsername?: string;
  };
  price: number;
  addOns?: string[];
  discount?: {
    id: string;
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
  };
}

interface CryptoPrice {
  BTC: number;
  ETH: number;
  USDT: number;
  USDC: number;
}

const PaymentProcessingOverlay = () => (
  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 rounded-2xl">
    <div className="text-center">
      <div className="w-12 h-12 border-2 border-[#60A5FA] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-white">Processing payment...</p>
    </div>
  </div>
);

export default function PaymentPage() {
  const router = useRouter();
  const [challengeData, setChallengeData] = useState<ChallengeData | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice>({ BTC: 0, ETH: 0, USDT: 1, USDC: 1 });
  const [pricesLoading, setPricesLoading] = useState(true);

  useEffect(() => {
    const storedData = sessionStorage.getItem('challengeData');
    if (!storedData) {
      router.push('/purchase');
      return;
    }
    
    const parsedData = JSON.parse(storedData);
    setChallengeData(parsedData);
  }, [router]);

  // Fetch crypto prices once on mount
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setPricesLoading(true);
        const response = await fetch('/api/crypto/prices');
        if (!response.ok) {
          throw new Error('Failed to fetch prices');
        }
        const data = await response.json();
        setCryptoPrices(data);
        console.log('✅ Crypto prices loaded:', data.source || 'coingecko');
      } catch (error) {
        console.error('❌ Error fetching crypto prices:', error);
        // Use fallback prices if fetch fails
        setCryptoPrices({
          BTC: 95000,
          ETH: 3500,
          USDT: 1,
          USDC: 1
        });
      } finally {
        setPricesLoading(false);
      }
    };

    fetchPrices(); // Fetch once on mount only
  }, []);

  if (!challengeData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-2 border-[#60A5FA] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Complete Your Payment</h1>

        {/* Payment Support Notice */}
        <div className="mb-8 bg-gray-800 rounded-xl border border-[#60A5FA]/30 overflow-hidden">
          <div className="px-4 py-3 bg-[#60A5FA]/10 border-b border-[#60A5FA]/20">
            <h3 className="text-[#60A5FA] font-medium">Having trouble with your payment?</h3>
          </div>
          <div className="p-4 flex items-start gap-3">
            <Mail className="text-[#60A5FA] w-5 h-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-300">
              If you encounter any payment issues, please email{' '}
              <a href="mailto:support@exodusprop.com" className="text-[#60A5FA] hover:underline">
                support@exodusprop.com
              </a>
              {' '}for alternative payment methods or assistance.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Payment Method */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-8">
              <h2 className="text-xl font-semibold mb-6">Cryptocurrency Payment</h2>

              {/* Crypto Payment */}
              <div className="mb-4">
                <div className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Bitcoin className="text-[#60A5FA] mr-3" size={20} />
                      <span className="font-medium">Cryptocurrency</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">${challengeData.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 rounded-xl border border-gray-700 relative">
                  {isProcessingPayment && <PaymentProcessingOverlay />}
                  {pricesLoading && cryptoPrices.BTC === 0 ? (
                    <div className="p-8 text-center">
                      <RefreshCcw className="w-6 h-6 text-[#60A5FA] animate-spin mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">Loading crypto prices...</p>
                    </div>
                  ) : (
                    <CryptoPayment
                      challengeData={challengeData}
                      successRedirectPath="/purchase/cryptopending"
                      onProcessingStateChange={setIsProcessingPayment}
                      cryptoPrices={cryptoPrices}
                    />
                  )}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-gray-900 rounded-xl p-4 text-center border border-gray-700 hover:border-[#60A5FA]/50 transition-colors group">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#60A5FA]/10 flex items-center justify-center group-hover:bg-[#60A5FA]/20 transition-colors">
                    <Shield className="text-[#60A5FA]" size={24} />
                  </div>
                  <div className="text-[#60A5FA] font-medium mb-1 text-xs">Secure Payment</div>
                  <div className="text-[0.5rem] text-gray-400 leading-relaxed">256-bit SSL encryption</div>
                </div>
                
                <div className="bg-gray-900 rounded-xl p-4 text-center border border-gray-700 hover:border-[#60A5FA]/50 transition-colors group">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#60A5FA]/10 flex items-center justify-center group-hover:bg-[#60A5FA]/20 transition-colors">
                    <RefreshCcw className="text-[#60A5FA]" size={24} />
                  </div>
                  <div className="text-[#60A5FA] font-medium mb-1 text-xs">Refund Policy</div>
                  <div className="text-[0.5rem] text-gray-400 leading-relaxed">Full refund on completion</div>
                </div>

                <div className="bg-gray-900 rounded-xl p-4 text-center border border-gray-700 hover:border-[#60A5FA]/50 transition-colors group">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#60A5FA]/10 flex items-center justify-center group-hover:bg-[#60A5FA]/20 transition-colors">
                    <HeadphonesIcon className="text-[#60A5FA]" size={24} />
                  </div>
                  <div className="text-[#60A5FA] font-medium mb-1 text-xs">24/7 Support</div>
                  <div className="text-[0.5rem] text-gray-400 leading-relaxed">Round-the-clock assistance</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 sticky top-8">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-white/70">Challenge Type:</span>
                  <span className="font-medium">{challengeData.type}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-white/70">Account Size:</span>
                  <span className="font-medium">{challengeData.amount}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-white/70">Platform:</span>
                  <span className="font-medium">{challengeData.platform}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-700 pt-4 mb-6">
                <div className="flex justify-between text-lg font-semibold mt-4">
                  <span>Total:</span>
                  <span className="text-[#60A5FA]">
                    ${challengeData.price.toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="text-sm text-white/60">
                <p className="mb-2">By completing this purchase, you agree to our Terms of Service and acknowledge that all sales are final.</p>
                <p>Need help? <a href="mailto:support@exodusprop.com" className="text-[#60A5FA] hover:underline">Contact Support</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

