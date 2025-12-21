"use client";

import Image from "next/image";
import Link from "next/link";

export default function Resources() {
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
            Trading Resources
          </h1>
          <p className="text-lg md:text-2xl text-gray-200">
            Download MetaTrader for your platform
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          
          {/* Introduction */}
          <div className="text-center mb-12 md:mb-16">
            <p className="text-base md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
              Get started with our recommended trading platforms. Download MetaTrader 4 (MT4) or MetaTrader 5 (MT5) for your device.
            </p>
          </div>

          {/* MT4 Downloads */}
          <div className="mb-12 md:mb-16">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border-t-4 border-exodus-light-blue">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-exodus-dark mb-3">
                  MetaTrader 4 (MT4)
                </h2>
                <p className="text-base md:text-lg text-gray-600">
                  The world's most popular forex trading platform
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* iOS */}
                <a
                  href="https://apps.apple.com/us/app/metatrader-4/id496212596"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-br from-exodus-light-blue to-blue-600 hover:from-blue-600 hover:to-exodus-light-blue rounded-xl p-6 md:p-8 text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <div className="flex flex-col items-center text-center">
                    <svg className="w-16 h-16 md:w-20 md:h-20 mb-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                    </svg>
                    <h3 className="text-xl md:text-2xl font-bold mb-2">iOS</h3>
                    <p className="text-sm md:text-base mb-4 opacity-90">iPhone & iPad</p>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-sm font-semibold">
                      Download from App Store
                    </div>
                  </div>
                </a>

                {/* Android */}
                <a
                  href="https://play.google.com/store/apps/details?id=net.metaquotes.metatrader4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-br from-exodus-light-blue to-blue-600 hover:from-blue-600 hover:to-exodus-light-blue rounded-xl p-6 md:p-8 text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <div className="flex flex-col items-center text-center">
                    <svg className="w-16 h-16 md:w-20 md:h-20 mb-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.523 15.341l-.002-.001-3.677-6.37 2.53-4.378a.422.422 0 00-.731-.422l-2.655 4.598L10.332 4.17a.422.422 0 00-.73 0L6.947 8.767 4.292 4.17a.422.422 0 00-.731.421l2.53 4.379-3.677 6.37-.001.002a4.67 4.67 0 00.828 5.453 4.677 4.677 0 003.417 1.461 4.673 4.673 0 003.661-1.777l1.665-2.16 1.665 2.16a4.668 4.668 0 007.078.316 4.67 4.67 0 00.828-5.453h-.001zm-5.556.004L9.433 12.7l2.534-2.645 2.534 2.645-2.534 2.645z"/>
                    </svg>
                    <h3 className="text-xl md:text-2xl font-bold mb-2">Android</h3>
                    <p className="text-sm md:text-base mb-4 opacity-90">All Android Devices</p>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-sm font-semibold">
                      Download from Play Store
                    </div>
                  </div>
                </a>

                {/* Windows/Web */}
                <a
                  href="https://www.metatrader4.com/en/download"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-br from-exodus-light-blue to-blue-600 hover:from-blue-600 hover:to-exodus-light-blue rounded-xl p-6 md:p-8 text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <div className="flex flex-col items-center text-center">
                    <svg className="w-16 h-16 md:w-20 md:h-20 mb-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
                    </svg>
                    <h3 className="text-xl md:text-2xl font-bold mb-2">Desktop & Web</h3>
                    <p className="text-sm md:text-base mb-4 opacity-90">Windows, Mac, Linux</p>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-sm font-semibold">
                      Download for Desktop
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* MT5 Downloads */}
          <div className="mb-12 md:mb-16">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border-t-4 border-exodus-dark">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-exodus-dark mb-3">
                  MetaTrader 5 (MT5)
                </h2>
                <p className="text-base md:text-lg text-gray-600">
                  Advanced trading platform with enhanced features
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* iOS */}
                <a
                  href="https://apps.apple.com/us/app/metatrader-5/id413251709"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-br from-exodus-dark to-exodus-blue hover:from-exodus-blue hover:to-exodus-dark rounded-xl p-6 md:p-8 text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <div className="flex flex-col items-center text-center">
                    <svg className="w-16 h-16 md:w-20 md:h-20 mb-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                    </svg>
                    <h3 className="text-xl md:text-2xl font-bold mb-2">iOS</h3>
                    <p className="text-sm md:text-base mb-4 opacity-90">iPhone & iPad</p>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-sm font-semibold">
                      Download from App Store
                    </div>
                  </div>
                </a>

                {/* Android */}
                <a
                  href="https://play.google.com/store/apps/details?id=net.metaquotes.metatrader5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-br from-exodus-dark to-exodus-blue hover:from-exodus-blue hover:to-exodus-dark rounded-xl p-6 md:p-8 text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <div className="flex flex-col items-center text-center">
                    <svg className="w-16 h-16 md:w-20 md:h-20 mb-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.523 15.341l-.002-.001-3.677-6.37 2.53-4.378a.422.422 0 00-.731-.422l-2.655 4.598L10.332 4.17a.422.422 0 00-.73 0L6.947 8.767 4.292 4.17a.422.422 0 00-.731.421l2.53 4.379-3.677 6.37-.001.002a4.67 4.67 0 00.828 5.453 4.677 4.677 0 003.417 1.461 4.673 4.673 0 003.661-1.777l1.665-2.16 1.665 2.16a4.668 4.668 0 007.078.316 4.67 4.67 0 00.828-5.453h-.001zm-5.556.004L9.433 12.7l2.534-2.645 2.534 2.645-2.534 2.645z"/>
                    </svg>
                    <h3 className="text-xl md:text-2xl font-bold mb-2">Android</h3>
                    <p className="text-sm md:text-base mb-4 opacity-90">All Android Devices</p>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-sm font-semibold">
                      Download from Play Store
                    </div>
                  </div>
                </a>

                {/* Windows/Web */}
                <a
                  href="https://www.metatrader5.com/en/download"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-br from-exodus-dark to-exodus-blue hover:from-exodus-blue hover:to-exodus-dark rounded-xl p-6 md:p-8 text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <div className="flex flex-col items-center text-center">
                    <svg className="w-16 h-16 md:w-20 md:h-20 mb-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
                    </svg>
                    <h3 className="text-xl md:text-2xl font-bold mb-2">Desktop & Web</h3>
                    <p className="text-sm md:text-base mb-4 opacity-90">Windows, Mac, Linux</p>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-sm font-semibold">
                      Download for Desktop
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-gradient-to-br from-exodus-blue to-exodus-dark rounded-2xl shadow-xl p-6 md:p-10 text-white text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Need Help Getting Started?
            </h3>
            <p className="text-base md:text-lg text-gray-200 mb-6 max-w-2xl mx-auto">
              Once you purchase a challenge, you'll receive your login credentials via email. Use them to log in to your preferred MetaTrader platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/how-it-works"
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/50 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                How It Works
              </Link>
              <Link
                href="/purchase"
                className="bg-exodus-light-blue hover:bg-blue-400 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                Get Started
              </Link>
            </div>
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

