import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { challengeData, cryptoDetails } = body;

    // Create crypto order in Firestore
    const orderRef = await db.collection('crypto-orders').add({
      status: 'PENDING',
      challengeStatus: 'PENDING', // PENDING, PROCESSING, CREDENTIALS_SENT
      cryptoType: cryptoDetails.type,
      cryptoAmount: cryptoDetails.amount.toString(),
      cryptoAddress: cryptoDetails.address,
      usdAmount: cryptoDetails.usdAmount,
      verificationPhrase: cryptoDetails.verificationPhrase,
      challengeType: challengeData.type,
      challengeAmount: challengeData.amount,
      platform: challengeData.platform,
      addOns: challengeData.addOns || [],
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
    });

    return NextResponse.json({ success: true, orderId: orderRef.id });
  } catch (error) {
    console.error('Error submitting crypto order:', error);
    return NextResponse.json(
      { error: 'Failed to submit order' },
      { status: 500 }
    );
  }
}

