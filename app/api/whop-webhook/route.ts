import { NextRequest, NextResponse } from 'next/server';
import { db as adminDb } from '@/lib/firebase-admin';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Whop webhook secret for verification
const WHOP_WEBHOOK_SECRET = process.env.WHOP_WEBHOOK_SECRET;

// Map plan IDs to account configurations
const planConfigs: Record<string, { size: string; price: number; type: string }> = {
  // One-Step Plans
  'plan_ngeGzBF830xlL': { size: '$10,000', price: 109, type: '1-Step' },
  'plan_FyRDLrDEd8ilp': { size: '$25,000', price: 247, type: '1-Step' },
  'plan_XB7LYZSLzaljt': { size: '$50,000', price: 399, type: '1-Step' },
  'plan_JJ9nO8LMXVsCD': { size: '$100,000', price: 699, type: '1-Step' },
  'plan_mDL1lFqScmlUK': { size: '$200,000', price: 1499, type: '1-Step' },
  // Elite Plans
  'plan_TQL10iopYwgY5': { size: '$10,000', price: 209, type: 'Elite' },
  'plan_unGvM5aTCqyU4': { size: '$25,000', price: 599, type: 'Elite' },
  'plan_Mc0eXyrWMsN6w': { size: '$50,000', price: 799, type: 'Elite' },
  'plan_kfWFgzIVfrJ5d': { size: '$100,000', price: 1299, type: 'Elite' },
  'plan_QtVFJl2muh80m': { size: '$200,000', price: 2599, type: 'Elite' },
};

// Verify Whop webhook signature
function verifyWhopSignature(payload: string, signature: string | null): boolean {
  if (!WHOP_WEBHOOK_SECRET || !signature) {
    console.warn('[WhopWebhook] No webhook secret configured or no signature provided');
    // In development, allow unsigned webhooks
    if (process.env.NODE_ENV !== 'production') {
      return true;
    }
    return false;
  }

  try {
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', WHOP_WEBHOOK_SECRET)
      .update(payload)
      .digest('hex');
    
    return signature === expectedSignature || signature === `sha256=${expectedSignature}`;
  } catch (error) {
    console.error('[WhopWebhook] Error verifying signature:', error);
    return false;
  }
}

// Send admin notification email
async function sendAdminNotification(data: {
  customerEmail: string;
  customerName: string;
  accountSize: string;
  platform: string;
  price: number;
  receiptId: string;
}) {
  const adminHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 30px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px;">
          <tr>
            <td style="background-color: #dc2626; padding: 25px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px;">🔔 New Whop Payment (Webhook)</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px; background-color: #ffffff;">
              <p style="color: #000000; font-size: 16px; font-weight: bold; margin: 0 0 20px 0;">New challenge purchase confirmed via Whop webhook!</p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border: 2px solid #60A5FA; border-radius: 8px; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 20px; background-color: #f8fafc;">
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="color: #475569; font-size: 13px; font-weight: 600; background-color: #f8fafc;">Customer:</td>
                        <td style="color: #000000; font-size: 14px; font-weight: 600; text-align: right; background-color: #f8fafc;">${data.customerName}</td>
                      </tr>
                      <tr>
                        <td style="color: #475569; font-size: 13px; font-weight: 600; background-color: #f8fafc;">Email:</td>
                        <td style="color: #000000; font-size: 14px; text-align: right; background-color: #f8fafc;">${data.customerEmail}</td>
                      </tr>
                      <tr>
                        <td style="color: #475569; font-size: 13px; font-weight: 600; background-color: #f8fafc;">Account Size:</td>
                        <td style="color: #1e40af; font-size: 18px; font-weight: bold; text-align: right; background-color: #f8fafc;">${data.accountSize}</td>
                      </tr>
                      <tr>
                        <td style="color: #475569; font-size: 13px; font-weight: 600; background-color: #f8fafc;">Platform:</td>
                        <td style="color: #000000; font-size: 14px; font-weight: 600; text-align: right; background-color: #f8fafc;">${data.platform}</td>
                      </tr>
                      <tr>
                        <td style="color: #475569; font-size: 13px; font-weight: 600; background-color: #f8fafc;">Receipt ID:</td>
                        <td style="color: #000000; font-size: 12px; text-align: right; background-color: #f8fafc;">${data.receiptId}</td>
                      </tr>
                      <tr style="border-top: 2px solid #60A5FA;">
                        <td style="color: #475569; font-size: 13px; font-weight: 600; padding-top: 12px; background-color: #f8fafc;">Amount:</td>
                        <td style="color: #16a34a; font-size: 20px; font-weight: bold; text-align: right; padding-top: 12px; background-color: #f8fafc;">$${data.price}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; border-left: 4px solid #1e40af;">
                <p style="color: #1e3a8a; font-size: 13px; margin: 0; font-weight: 600;">
                  ⚡ Action Required: Set up trading account and send credentials to customer
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 11px; margin: 0;">Whop Webhook Notification - Exodus</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  try {
    await resend.emails.send({
      from: 'support@exodusprop.com',
      to: 'support@exodusprop.com',
      subject: `🔔 New Whop Payment: ${data.accountSize} - ${data.customerName}`,
      html: adminHtml,
    });
    console.log('[WhopWebhook] Admin notification email sent');
  } catch (error) {
    console.error('[WhopWebhook] Error sending admin email:', error);
  }
}

// Check if purchase already exists to prevent duplicates
async function purchaseExists(receiptId: string): Promise<boolean> {
  try {
    const purchasesRef = adminDb.collection('purchases');
    const snapshot = await purchasesRef.where('receiptId', '==', receiptId).get();
    return !snapshot.empty;
  } catch (error) {
    console.error('[WhopWebhook] Error checking existing purchase:', error);
    return false;
  }
}

// Get or create user
async function getOrCreateUser(email: string, name: string): Promise<string | null> {
  try {
    const usersRef = adminDb.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();
    
    if (!snapshot.empty) {
      return snapshot.docs[0].id;
    }
    
    // Create new user with temp password
    // Note: This creates the Firestore document, but the Firebase Auth user
    // should be created when they first sign in
    const newUserRef = await usersRef.add({
      email,
      displayName: name,
      country: 'Unknown',
      createdAt: new Date(),
      accounts: [],
      kycStatus: 'pending',
      isAdmin: false,
      requiresPasswordChange: true,
    });
    
    return newUserRef.id;
  } catch (error) {
    console.error('[WhopWebhook] Error getting/creating user:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  console.log('[WhopWebhook] Received webhook event');
  
  try {
    const payload = await request.text();
    const signature = request.headers.get('whop-signature') || request.headers.get('x-whop-signature');
    
    // Verify signature
    if (!verifyWhopSignature(payload, signature)) {
      console.error('[WhopWebhook] Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    
    const event = JSON.parse(payload);
    console.log('[WhopWebhook] Event type:', event.action || event.type);
    
    // Handle different webhook event types
    // Whop sends events like: membership.went_valid, payment.succeeded, etc.
    const eventType = event.action || event.type;
    
    // Handle payment success events
    if (eventType === 'payment.succeeded' || 
        eventType === 'membership.went_valid' || 
        eventType === 'membership.created' ||
        eventType === 'checkout.completed') {
      
      const data = event.data;
      
      // Extract relevant information
      const receiptId = data.id || data.receipt_id || data.payment_id || `whop_${Date.now()}`;
      const planId = data.plan?.id || data.product?.plan_id || data.plan_id;
      const email = data.email || data.user?.email || data.customer_email;
      const customerName = data.name || data.user?.name || data.customer_name || email?.split('@')[0] || 'Customer';
      
      // Get platform from metadata if available, default to MT4
      const platform = data.metadata?.platform || 'MT4';
      
      // Get billing info if available
      const billingInfo = {
        firstName: data.billing_info?.first_name || customerName.split(' ')[0] || 'N/A',
        lastName: data.billing_info?.last_name || customerName.split(' ').slice(1).join(' ') || 'N/A',
        streetAddress: data.billing_info?.address || data.billing_info?.line1 || 'N/A',
        city: data.billing_info?.city || 'N/A',
        state: data.billing_info?.state || 'N/A',
        country: data.billing_info?.country || 'N/A',
        postalCode: data.billing_info?.postal_code || data.billing_info?.zip || 'N/A',
      };
      
      if (!email) {
        console.error('[WhopWebhook] No email found in webhook data');
        return NextResponse.json({ error: 'Missing email' }, { status: 400 });
      }
      
      // Check for duplicate
      if (await purchaseExists(receiptId)) {
        console.log('[WhopWebhook] Purchase already exists, skipping:', receiptId);
        return NextResponse.json({ received: true, message: 'Already processed' });
      }
      
      // Get plan configuration
      const planConfig = planConfigs[planId] || { 
        size: data.product?.name || 'Unknown', 
        price: data.final_amount || data.amount || 0,
        type: '1-Step'
      };
      
      // Get or create user
      const userId = await getOrCreateUser(email, customerName);
      
      if (!userId) {
        console.error('[WhopWebhook] Could not get or create user');
        return NextResponse.json({ error: 'User creation failed' }, { status: 500 });
      }
      
      // Save purchase to Firebase
      const purchaseData = {
        userId,
        email,
        accountSize: planConfig.size,
        accountPrice: planConfig.price,
        platform,
        planId: planId || 'unknown',
        receiptId,
        billingInfo,
        timestamp: new Date().toISOString(),
        status: 'completed',
        paymentMethod: 'card',
        source: 'whop_webhook', // Mark as from webhook for tracking
      };
      
      const purchaseRef = await adminDb.collection('purchases').add(purchaseData);
      console.log('[WhopWebhook] Purchase saved:', purchaseRef.id);
      
      // Create pending trading account
      const accountData = {
        userId,
        accountSize: planConfig.size,
        accountType: planConfig.type,
        platform,
        status: 'pending',
        balance: parseInt(planConfig.size.replace(/[$,]/g, '')),
        profit: 0,
        startDate: new Date(),
        credentials: null,
        planId: planId || 'unknown',
        receiptId,
      };
      
      const accountRef = await adminDb.collection('accounts').add(accountData);
      console.log('[WhopWebhook] Account created:', accountRef.id);
      
      // Update user's accounts array
      const userRef = adminDb.collection('users').doc(userId);
      const userDoc = await userRef.get();
      if (userDoc.exists) {
        const currentAccounts = userDoc.data()?.accounts || [];
        await userRef.update({
          accounts: [...currentAccounts, accountRef.id]
        });
      }
      
      // Send admin notification email
      await sendAdminNotification({
        customerEmail: email,
        customerName,
        accountSize: planConfig.size,
        platform,
        price: planConfig.price,
        receiptId,
      });
      
      // Also send customer confirmation email
      try {
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://exodusprop.com'}/api/send-purchase-emails`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerEmail: email,
            customerName,
            accountSize: planConfig.size,
            platform,
            price: planConfig.price,
            paymentMethod: 'card'
          })
        });
      } catch (emailError) {
        console.error('[WhopWebhook] Error sending customer email:', emailError);
      }
      
      console.log('[WhopWebhook] Successfully processed payment for:', email);
      return NextResponse.json({ received: true, purchaseId: purchaseRef.id });
    }
    
    // Handle other event types
    console.log('[WhopWebhook] Unhandled event type:', eventType);
    return NextResponse.json({ received: true });
    
  } catch (error: any) {
    console.error('[WhopWebhook] Error processing webhook:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, whop-signature, x-whop-signature',
    },
  });
}

