import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { challengeData, cryptoDetails } = body;

    // Check if this is a subscription order (new structure) or legacy single account
    const isSubscriptionOrder = challengeData.subscriptionTier && challengeData.accounts;

    // Create crypto order in Firestore
    const orderData: any = {
      status: 'PENDING',
      challengeStatus: 'PENDING', // PENDING, PROCESSING, CREDENTIALS_SENT
      cryptoType: cryptoDetails.type,
      cryptoAmount: cryptoDetails.amount.toString(),
      cryptoAddress: cryptoDetails.address,
      usdAmount: cryptoDetails.usdAmount,
      verificationPhrase: cryptoDetails.verificationPhrase,
      customerEmail: challengeData.formData.email,
      customerName: `${challengeData.formData.firstName} ${challengeData.formData.lastName}`,
      customerPhone: challengeData.formData.phone,
      customerCountry: challengeData.formData.country,
      customerDiscordUsername: challengeData.formData.discordUsername || null,
      discountCode: challengeData.discount?.code || null,
      discountId: challengeData.discount?.id || null,
      originalAmount: challengeData.discount ? Math.round(challengeData.price / (1 - challengeData.discount.value / 100)) : challengeData.price,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add subscription-specific or legacy fields
    if (isSubscriptionOrder) {
      orderData.subscriptionTier = challengeData.subscriptionTier;
      orderData.subscriptionPrice = challengeData.subscriptionPrice;
      orderData.accountsCount = challengeData.accountsCount;
      orderData.accounts = challengeData.accounts;
      orderData.addOns = challengeData.addOns || [];
    } else {
      // Legacy single account structure
      orderData.challengeType = challengeData.type;
      orderData.challengeAmount = challengeData.amount;
      orderData.platform = challengeData.platform;
      orderData.addOns = challengeData.addOns || [];
    }

    const orderRef = await db.collection('crypto-orders').add(orderData);

    return NextResponse.json({ success: true, orderId: orderRef.id });
  } catch (error) {
    console.error('Error submitting crypto order:', error);
    return NextResponse.json(
      { error: 'Failed to submit order' },
      { status: 500 }
    );
  }
}

