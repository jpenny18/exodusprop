// Facebook Pixel configuration and utility functions
export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || "";

// Global window extension for fbq
declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: (...args: any[]) => void;
  }
}

/**
 * Type-safe wrapper for Facebook Pixel events
 * Only runs on client-side when fbq is available
 */
export const fbq = (...args: any[]) => {
  if (typeof window === "undefined") return;
  if (!window.fbq) return;
  window.fbq(...args);
};

/**
 * Track a PageView event
 * This is called automatically by the base pixel script
 */
export const trackPageView = () => {
  fbq("track", "PageView");
};

/**
 * Track when a user views content on key funnel pages
 * @param data - Optional metadata about the page
 */
export const trackViewContent = (data?: { page?: string; [key: string]: any }) => {
  fbq("track", "ViewContent", data);
};

/**
 * Track when a user initiates checkout
 * Call this when user clicks CTA or lands on purchase page
 */
export const trackInitiateCheckout = () => {
  fbq("track", "InitiateCheckout");
};

/**
 * Track a completed purchase
 * @param value - The order total
 * @param currency - The currency code (default: USD)
 */
export const trackPurchase = (value: number, currency: string = "USD") => {
  fbq("track", "Purchase", {
    value,
    currency,
  });
};
