import { NextRequest, NextResponse } from 'next/server';

// MetaAPI auth token
const METAAPI_AUTH_TOKEN = process.env.METAAPI_AUTH_TOKEN || 'your-metaapi-auth-token-here';
const BASE_URL = 'https://mt-provisioning-api-v1.agiliumtrade.agiliumtrade.ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { accountId } = body;

    // Validation
    if (!accountId) {
      return NextResponse.json(
        { error: 'Missing required parameter: accountId is required' },
        { status: 400 }
      );
    }

    // Check if MetaAPI token is configured
    if (METAAPI_AUTH_TOKEN === 'your-metaapi-auth-token-here') {
      return NextResponse.json({
        success: true,
        message: 'Mock: Features would be enabled (MetaAPI token not configured)',
        warning: 'This is a mock response. Please configure METAAPI_AUTH_TOKEN environment variable for production use.'
      });
    }

    const url = `${BASE_URL}/users/current/accounts/${accountId}/enable-account-features`;
    
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'auth-token': METAAPI_AUTH_TOKEN
    };
    
    const requestBody = {
      metastatsApiEnabled: true,
      riskManagementApiEnabled: true,
      reliabilityIncreased: true  // Also increase reliability for better performance
    };

    console.log('Enabling MetaStats and Risk Management APIs for account:', accountId);

    const response = await fetch(url, {
      method: 'POST',  // Changed from PUT to POST as per documentation
      headers,
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('MetaAPI enable features error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      
      return NextResponse.json(
        { 
          error: errorData.message || `MetaAPI request failed with status ${response.status}`,
          details: errorData
        },
        { status: response.status }
      );
    }

    console.log('MetaStats, Risk Management APIs, and reliability enabled successfully for account:', accountId);

    return NextResponse.json({
      success: true,
      message: 'MetaStats API, Risk Management API, and increased reliability enabled successfully. The account may be temporarily stopped during this process.',
      accountId,
      note: 'Please wait 2-3 minutes for the changes to take effect.'
    });

  } catch (error: any) {
    console.error('Error enabling MetaAPI features:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

