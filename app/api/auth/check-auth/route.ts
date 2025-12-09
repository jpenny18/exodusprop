import { NextRequest, NextResponse } from 'next/server';
import { verifySessionCookie } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    
    if (!sessionCookie) {
      return NextResponse.json({ 
        authenticated: false,
        isAdmin: false
      });
    }

    // Verify the session cookie
    const decodedClaims = await verifySessionCookie(sessionCookie.value);
    
    return NextResponse.json({ 
      authenticated: true,
      isAdmin: decodedClaims.admin === true,
      uid: decodedClaims.uid,
      email: decodedClaims.email
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ 
      authenticated: false,
      isAdmin: false,
      error: 'Failed to check authentication status' 
    });
  }
}

