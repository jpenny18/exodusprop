'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, LayoutDashboard } from 'lucide-react';

export default function CryptoPendingPage() {
  const router = useRouter();

  // Clear challenge data from session storage
  useEffect(() => {
    sessionStorage.removeItem('challengeData');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto">
              <Loader2 className="w-16 h-16 text-[#60A5FA] animate-spin" />
            </div>
            
            <h1 className="text-3xl font-bold text-white">Payment Pending</h1>
            
            <div className="max-w-lg mx-auto space-y-4 text-gray-300">
              <p>
                We are waiting to receive your crypto payment. This process may take up to 30 minutes depending on network conditions.
              </p>
              <p>
                Once we confirm your payment, we will process your challenge and send you an email with your account details.
              </p>
              <p>
                You can safely close this page. We'll notify you via email once everything is ready.
              </p>
            </div>

            <div className="pt-6 border-t border-gray-700 space-y-4">
              <p className="text-sm text-gray-400">
                Having issues? Contact our support at{' '}
                <a href="mailto:support@exodusprop.com" className="text-[#60A5FA] hover:underline">
                  support@exodusprop.com
                </a>
              </p>
              
              <button
                onClick={() => router.push('/dashboard')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#60A5FA]/10 hover:bg-[#60A5FA]/20 text-[#60A5FA] rounded-xl transition-colors"
              >
                <LayoutDashboard size={18} />
                <span>Go to Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

