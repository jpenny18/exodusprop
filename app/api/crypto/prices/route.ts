import { NextResponse } from 'next/server';

// In-memory cache for prices
let priceCache = {
  data: null as any,
  lastUpdated: 0
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fallback prices in case API is down
const FALLBACK_PRICES = {
  BTC: 95000,
  ETH: 3500,
  USDT: 1.00,
  USDC: 1.00
};

export async function GET() {
  const now = Date.now();

  // Return cached data if it's still fresh
  if (priceCache.data && (now - priceCache.lastUpdated) < CACHE_DURATION) {
    return NextResponse.json({
      ...priceCache.data,
      lastUpdated: priceCache.lastUpdated,
      cached: true
    });
  }

  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000; // 2 second delay between retries

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      // Using CoinGecko's free API (no key required)
      // Rate limit: 10-30 calls/minute on free tier
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,usd-coin&vs_currencies=usd&include_last_updated_at=true',
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Exodus-Prop-Firm/1.0'
          },
          next: { revalidate: 300 } // Cache for 5 minutes in Next.js
        }
      );
      
      if (!response.ok) {
        // If we get a rate limit response (429), wait longer before retrying
        if (response.status === 429) {
          console.log(`Rate limited on attempt ${attempt + 1}, waiting ${RETRY_DELAY * 2}ms`);
          await delay(RETRY_DELAY * 2);
          continue;
        }
        throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Validate that we got actual data
      if (!data.bitcoin?.usd || !data.ethereum?.usd) {
        throw new Error('Invalid data received from CoinGecko');
      }
      
      const prices = {
        BTC: data.bitcoin?.usd || FALLBACK_PRICES.BTC,
        ETH: data.ethereum?.usd || FALLBACK_PRICES.ETH,
        USDT: data.tether?.usd || FALLBACK_PRICES.USDT,
        USDC: data['usd-coin']?.usd || FALLBACK_PRICES.USDC,
        lastUpdated: now,
        source: 'coingecko',
        cached: false
      };

      // Update cache
      priceCache = {
        data: prices,
        lastUpdated: now
      };

      console.log('✅ Successfully fetched fresh crypto prices from CoinGecko');
      return NextResponse.json(prices);
      
    } catch (error) {
      console.error(`❌ Attempt ${attempt + 1}/${MAX_RETRIES} failed:`, error);
      
      // If this was our last attempt and we have cached data (even if expired), return it
      if (attempt === MAX_RETRIES - 1 && priceCache.data) {
        console.log('⚠️ Using expired cached prices');
        return NextResponse.json({
          ...priceCache.data,
          cached: true,
          stale: true
        });
      }
      
      // If this was our last attempt and we have no cached data, return fallback prices
      if (attempt === MAX_RETRIES - 1) {
        console.log('⚠️ Using hardcoded fallback prices');
        const fallbackResponse = {
          ...FALLBACK_PRICES,
          lastUpdated: now,
          source: 'fallback',
          cached: false
        };
        
        // Cache fallback prices so we don't hammer the API
        priceCache = {
          data: fallbackResponse,
          lastUpdated: now
        };
        
        return NextResponse.json(fallbackResponse);
      }
      
      // Wait before retrying
      await delay(RETRY_DELAY * (attempt + 1)); // Exponential backoff
    }
  }

  // Final fallback (should rarely be reached)
  console.log('⚠️ Final fallback to default prices');
  return NextResponse.json({
    ...FALLBACK_PRICES,
    lastUpdated: now,
    source: 'fallback',
    cached: false
  });
}

