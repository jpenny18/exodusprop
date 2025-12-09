import { NextRequest, NextResponse } from 'next/server';
import { setAdminRole, auth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Get user by email
    const userRecord = await auth.getUserByEmail(email);
    
    // Set admin role
    await setAdminRole(userRecord.uid);

    // Create custom token with admin claim
    const customToken = await auth.createCustomToken(userRecord.uid, {
      admin: true
    });

    return NextResponse.json({ 
      success: true, 
      message: `User ${email} has been granted admin privileges`,
      customToken
    });
  } catch (error: any) {
    console.error('Error setting admin role:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to set admin role' },
      { status: 500 }
    );
  }
}

