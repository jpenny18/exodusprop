import { NextRequest, NextResponse } from 'next/server';
import { verifySessionCookie } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { session } = body;

    if (!session) {
      return NextResponse.json(
        { error: 'No session provided' },
        { status: 400 }
      );
    }

    // Verify the session
    const decodedClaims = await verifySessionCookie(session);
    
    // Check if the user has admin role
    const isAdmin = decodedClaims.admin === true;

    return NextResponse.json({ 
      isAdmin,
      uid: decodedClaims.uid,
      email: decodedClaims.email
    });
  } catch (error) {
    console.error('Error verifying session:', error);
    return NextResponse.json(
      { error: 'Invalid session' },
      { status: 401 }
    );
  }
}

