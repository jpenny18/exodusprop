/**
 * A utility library for Bitcoin payment processing
 */

export interface BitcoinPaymentInfo {
  bitcoinAddress: string;
  btcAmount: number;
  formattedBTCAmount: string;
  bitcoinURI: string;
  qrCodeUrl: string;
  usdAmount: number;
  btcPrice: number;
}

/**
 * Generate a Bitcoin payment URI with amount and message
 * @param address Bitcoin address
 * @param amountBTC Amount in BTC
 * @param message Optional message/label for the payment
 * @returns Bitcoin URI string
 */
export function generateBitcoinURI(
  address: string,
  amountBTC: number,
  message?: string
): string {
  // Base URI
  let uri = `bitcoin:${address}`;
  
  // Add parameters
  const params: string[] = [];
  
  if (amountBTC) {
    params.push(`amount=${amountBTC}`);
  }
  
  if (message) {
    params.push(`message=${encodeURIComponent(message)}`);
  }
  
  // Append parameters if any
  if (params.length > 0) {
    uri += '?' + params.join('&');
  }
  
  return uri;
}

/**
 * Calculate USD to BTC conversion (for display purposes only)
 * Note: In a production environment, you should use a real exchange rate API
 * @param usdAmount Amount in USD
 * @param btcPrice Current BTC price in USD
 * @returns Equivalent amount in BTC
 */
export function convertUSDtoBTC(usdAmount: number, btcPrice: number): number {
  if (!btcPrice || btcPrice <= 0) {
    throw new Error('Invalid BTC price');
  }
  
  return usdAmount / btcPrice;
}

/**
 * Generate a simple Bitcoin QR code URL using a third-party service
 * In production, you might want to generate QR codes on your own server
 * @param bitcoinURI Bitcoin URI to encode
 * @returns URL for the QR code image
 */
export function generateQRCodeUrl(bitcoinURI: string): string {
  return `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${encodeURIComponent(
    bitcoinURI
  )}&choe=UTF-8`;
}

/**
 * Format Bitcoin amount with proper decimal places
 * @param btcAmount Amount in BTC
 * @returns Formatted BTC amount string
 */
export function formatBTCAmount(btcAmount: number): string {
  return btcAmount.toFixed(8);
}

/**
 * Get current Bitcoin price in USD (mock implementation)
 * In production, replace with a real API call to get the current price
 * @returns Promise that resolves to the current BTC price in USD
 */
export async function getCurrentBTCPrice(): Promise<number> {
  try {
    // In production, replace with a real API call
    // e.g., to CoinGecko, Coinbase, or another crypto price API
    
    // For now, we'll use a mock price for testing
    // In production environment, implement a proper API call
    return 60000; // Mock price: $60,000 per BTC
  } catch (error) {
    console.error('Error fetching BTC price:', error);
    throw error;
  }
}

/**
 * Get the Bitcoin address from environment variables
 * @returns The Bitcoin address
 */
export function getBitcoinAddress(): string {
  const bitcoinAddress = process.env.NEXT_PUBLIC_BTC_ADDRESS;
  
  if (!bitcoinAddress) {
    throw new Error('Bitcoin address not configured. Please check your environment variables.');
  }
  
  return bitcoinAddress;
}

/**
 * Generate complete Bitcoin payment information
 * @param usdAmount Amount in USD
 * @param orderReference Order reference or ID
 * @returns Object containing Bitcoin payment details
 */
export async function generateBitcoinPaymentInfo(
  usdAmount: number,
  orderReference: string
): Promise<BitcoinPaymentInfo> {
  try {
    // Get Bitcoin address from environment variables
    const bitcoinAddress = getBitcoinAddress();
    
    // Get current BTC price
    const btcPrice = await getCurrentBTCPrice();
    
    // Convert USD to BTC
    const btcAmount = convertUSDtoBTC(usdAmount, btcPrice);
    
    // Format BTC amount
    const formattedBTCAmount = formatBTCAmount(btcAmount);
    
    // Generate payment message
    const paymentMessage = `Order #${orderReference} - Exodus`;
    
    // Generate Bitcoin URI
    const bitcoinURI = generateBitcoinURI(bitcoinAddress, btcAmount, paymentMessage);
    
    // Generate QR code URL
    const qrCodeUrl = generateQRCodeUrl(bitcoinURI);
    
    return {
      bitcoinAddress,
      btcAmount,
      formattedBTCAmount,
      bitcoinURI,
      qrCodeUrl,
      usdAmount,
      btcPrice,
    };
  } catch (error: unknown) {
    console.error('Error generating Bitcoin payment info:', error);
    throw error;
  }
}

