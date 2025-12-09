'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { generate as generateWords } from 'random-words';
import { Check, Copy, RefreshCw } from 'lucide-react';

interface CryptoPaymentProps {
  challengeData: any;
  successRedirectPath: string;
  onProcessingStateChange: (state: boolean) => void;
  cryptoPrices: CryptoPrice;
}

interface CryptoPrice {
  BTC: number;
  ETH: number;
  USDT: number;
  USDC: number;
  lastUpdated?: number;
  source?: string;
  cached?: boolean;
  stale?: boolean;
}

interface CryptoAddress {
  BTC: string;
  ETH: string;
  USDT: string;
  USDC: string;
}

// These will be loaded from environment variables
const CRYPTO_ADDRESSES: CryptoAddress = {
  BTC: process.env.NEXT_PUBLIC_BTC_ADDRESS || '',
  ETH: process.env.NEXT_PUBLIC_ETH_ADDRESS || '',
  USDT: process.env.NEXT_PUBLIC_USDT_ADDRESS || '',
  USDC: process.env.NEXT_PUBLIC_USDC_ADDRESS || ''
};

export default function CryptoPayment({ challengeData, successRedirectPath, onProcessingStateChange, cryptoPrices }: CryptoPaymentProps) {
  const router = useRouter();
  const [selectedCrypto, setSelectedCrypto] = useState<'BTC' | 'ETH' | 'USDT' | 'USDC'>('BTC');
  const [cryptoAmount, setCryptoAmount] = useState<CryptoPrice>({ BTC: 0, ETH: 0, USDT: 0, USDC: 0 });
  const [verificationPhrase, setVerificationPhrase] = useState<string[]>([]);
  const [userPhrase, setUserPhrase] = useState('');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Generate verification phrase on mount
  useEffect(() => {
    const words = generateWords({ exactly: 10 });
    setVerificationPhrase(Array.isArray(words) ? words : [words]);
  }, []);

  // Calculate crypto amounts when prices or challenge data changes
  useEffect(() => {
    const usdAmount = challengeData.price;
    setCryptoAmount({
      BTC: usdAmount / cryptoPrices.BTC,
      ETH: usdAmount / cryptoPrices.ETH,
      USDT: usdAmount,
      USDC: usdAmount
    });
  }, [challengeData.price, cryptoPrices]);

  const handleCryptoSelect = (crypto: 'BTC' | 'ETH' | 'USDT' | 'USDC') => {
    setSelectedCrypto(crypto);
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(CRYPTO_ADDRESSES[selectedCrypto]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSubmit = async () => {
    if (userPhrase.toLowerCase() !== verificationPhrase.join(' ').toLowerCase()) {
      setError('Verification phrase does not match. Please try again.');
      return;
    }

    setIsLoading(true);
    onProcessingStateChange(true);

    try {
      const response = await fetch('/api/crypto/submit-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          challengeData,
          cryptoDetails: {
            type: selectedCrypto,
            amount: cryptoAmount[selectedCrypto],
            address: CRYPTO_ADDRESSES[selectedCrypto],
            verificationPhrase: verificationPhrase.join(' '),
            usdAmount: challengeData.price
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit order');
      }

      const { orderId } = await response.json();

      // Send order notification emails
      try {
        const emailResponse = await fetch('/api/send-crypto-emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: orderId,
            status: 'PENDING',
            cryptoType: selectedCrypto,
            cryptoAmount: cryptoAmount[selectedCrypto].toString(),
            cryptoAddress: CRYPTO_ADDRESSES[selectedCrypto],
            usdAmount: challengeData.price,
            verificationPhrase: verificationPhrase.join(' '),
            challengeType: challengeData.type,
            challengeAmount: challengeData.amount,
            platform: challengeData.platform,
            addOns: challengeData.addOns || [],
            customerEmail: challengeData.formData.email,
            customerName: `${challengeData.formData.firstName} ${challengeData.formData.lastName}`,
            customerPhone: challengeData.formData.phone,
            customerCountry: challengeData.formData.country,
            customerDiscordUsername: challengeData.formData.discordUsername,
            createdAt: new Date().toISOString()
          }),
        });

        if (!emailResponse.ok) {
          console.error('Failed to send order emails');
        }
      } catch (emailError) {
        console.error('Error sending order emails:', emailError);
      }

      router.push(successRedirectPath);
    } catch (error) {
      setError('Failed to submit order. Please try again.');
      setIsLoading(false);
      onProcessingStateChange(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Crypto Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(['BTC', 'ETH', 'USDT', 'USDC'] as const).map((crypto) => (
          <button
            key={crypto}
            onClick={() => handleCryptoSelect(crypto)}
            className={`p-4 rounded-xl border ${
              selectedCrypto === crypto
                ? 'border-[#60A5FA] bg-[#60A5FA]/10'
                : 'border-gray-700 hover:border-[#60A5FA]/50'
            } transition-colors`}
          >
            <div className="text-center">
              <div className="font-medium text-white">
                {crypto}
              </div>
              {crypto === 'USDT' && (
                <div className="text-xs text-gray-400">
                  (TRC20)
                </div>
              )}
              {crypto === 'USDC' && (
                <div className="text-xs text-gray-400">
                  (SOL)
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
        <div className="text-center mb-4">
          <div className="text-lg font-medium text-white">
            1 {selectedCrypto} = ${cryptoPrices[selectedCrypto].toLocaleString()}
          </div>
        </div>
        
        <div className="text-orange-500 text-sm text-center">
          {selectedCrypto === 'BTC' && 
            "Only send Bitcoin (BTC) assets to this address. Other assets will be lost forever."
          }
          {selectedCrypto === 'ETH' &&
            "Only send Ethereum (ETH) assets to this address. Other assets will be lost forever."
          }
          {selectedCrypto === 'USDT' &&
            "Only send Tether (TRC20) assets to this address. Other assets will be lost forever."
          }
          {selectedCrypto === 'USDC' &&
            "Only send USD Coin (SPL) assets to this address. Other assets will be lost forever."
          }
        </div>
      </div>

      {/* Payment Details */}
      <div className="space-y-4">
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
          <div className="text-center mb-4">
            <div className="text-sm text-gray-400 mb-1">Send exactly</div>
            <div className="text-2xl font-bold text-[#60A5FA]">
              {cryptoAmount[selectedCrypto].toFixed(selectedCrypto === 'USDC' || selectedCrypto === 'USDT' ? 2 : 8)} {selectedCrypto}
            </div>
            <div className="text-sm text-gray-400 mt-1">
              ≈ ${challengeData.price.toFixed(2)}
            </div>
          </div>

          <div className="flex justify-center mb-4">
            <QRCodeSVG
              value={
                selectedCrypto === 'USDT' 
                  ? `tron:${CRYPTO_ADDRESSES[selectedCrypto]}?amount=${cryptoAmount[selectedCrypto].toFixed(2)}`
                  : selectedCrypto === 'USDC'
                  ? `solana:${CRYPTO_ADDRESSES[selectedCrypto]}?amount=${(cryptoAmount[selectedCrypto] / 1000).toFixed(2)}&spl-token=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`
                  : selectedCrypto === 'BTC'
                  ? `bitcoin:${CRYPTO_ADDRESSES[selectedCrypto]}?amount=${cryptoAmount[selectedCrypto].toFixed(8)}`
                  : `ethereum:${CRYPTO_ADDRESSES[selectedCrypto]}?value=${(cryptoAmount[selectedCrypto] * 1e18).toFixed(0)}`
              }
              size={200}
              level="H"
              className="p-2 bg-white rounded-xl"
            />
          </div>

          <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-3">
            <div className="flex-1 font-mono text-sm truncate text-white">
              {CRYPTO_ADDRESSES[selectedCrypto]}
            </div>
            <button
              onClick={copyAddress}
              className="flex items-center gap-1 text-[#60A5FA] hover:text-[#60A5FA]/80"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Verification Phrase */}
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
          <div className="mb-4">
            <div className="text-sm text-gray-400 mb-2">Type this phrase to verify:</div>
            <div className="font-mono bg-gray-800 p-3 rounded-lg text-[#60A5FA] text-sm">
              {verificationPhrase.join(' ')}
            </div>
          </div>

          <input
            type="text"
            value={userPhrase}
            onChange={(e) => setUserPhrase(e.target.value)}
            onPaste={(e) => e.preventDefault()}
            placeholder="Type the verification phrase here"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#60A5FA]/50"
          />
          {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading || userPhrase.toLowerCase() !== verificationPhrase.join(' ').toLowerCase()}
          className="w-full bg-[#60A5FA] hover:bg-[#60A5FA]/90 disabled:bg-[#60A5FA]/50 disabled:cursor-not-allowed text-white font-medium py-4 rounded-xl transition-colors"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <RefreshCw className="animate-spin" size={16} />
              <span>Processing...</span>
            </div>
          ) : (
            "I've Sent the Payment"
          )}
        </button>
      </div>

      <div className="text-sm text-gray-400">
        <p className="mb-2">
          • The payment amount is locked in for 15 minutes. If you don't send the payment within this time, the price may be updated.
        </p>
        <p>
          • After sending the payment, click the button above and wait for confirmation. This may take up to 30 minutes depending on network conditions.
        </p>
      </div>
    </div>
  );
}

