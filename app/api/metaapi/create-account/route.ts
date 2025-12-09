import { NextRequest, NextResponse } from 'next/server';

// MetaAPI auth token - you'll need to set this to your actual token
const METAAPI_AUTH_TOKEN = process.env.METAAPI_AUTH_TOKEN || 'your-metaapi-auth-token-here';
const BASE_URL = 'https://mt-provisioning-api-v1.agiliumtrade.agiliumtrade.ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { login, password, name, server, platform, magic = 0, keywords = [], transactionId } = body;

    // Validation
    if (!login || !password || !name || !server || !platform || !transactionId) {
      return NextResponse.json(
        { error: 'Missing required parameters: login, password, name, server, platform, and transactionId are required' },
        { status: 400 }
      );
    }

    // Check if MetaAPI token is configured
    if (METAAPI_AUTH_TOKEN === 'your-metaapi-auth-token-here') {
      console.log('MetaAPI token not configured, returning mock response for development');
      
      // For development purposes, return a mock response
      // Replace this with actual MetaAPI integration once token is configured
      const mockAccountId = `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      return NextResponse.json({
        accountId: mockAccountId,
        message: 'Mock account created successfully (MetaAPI token not configured)',
        warning: 'This is a mock response. Please configure METAAPI_AUTH_TOKEN environment variable for production use.'
      });
    }

    const url = `${BASE_URL}/users/current/accounts`;
    
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'auth-token': METAAPI_AUTH_TOKEN,
      'transaction-id': transactionId
    };
    
    const requestBody = {
      login: login.toString(),
      password,
      name,
      server,
      platform,
      magic,
      keywords,
      metastatsApiEnabled: true,  // Enable MetaStats API for metrics
      riskManagementApiEnabled: true,  // Enable Risk Management API for advanced features
      reliability: 'high'  // Set high reliability for better performance (recommended for production)
    };

    console.log('Creating MetaAPI account:', {
      login,
      server,
      platform,
      name,
      transactionId: transactionId.substring(0, 8) + '...'
    });

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (parseError) {
        // If response isn't JSON, get text content
        const textResponse = await response.text();
        errorData = { message: textResponse, raw: textResponse };
      }
      
      console.error('MetaAPI create account error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      
      // Provide more specific error messages based on status code
      let errorMessage = errorData.message || `MetaAPI request failed with status ${response.status}`;
      
      if (response.status === 401) {
        errorMessage = 'MetaAPI authentication failed. Please check if your METAAPI_AUTH_TOKEN is valid and has the correct permissions.';
      } else if (response.status === 403) {
        errorMessage = 'MetaAPI access forbidden. Your token may not have permission to create accounts.';
      } else if (response.status === 429) {
        errorMessage = 'MetaAPI rate limit exceeded. Please try again later.';
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          details: errorData,
          status: response.status
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('MetaAPI account created successfully:', {
      accountId: data.id,
      login
    });

    return NextResponse.json({
      accountId: data.id,
      message: 'Account created successfully with MetaStats API, Risk Management API, and high reliability enabled'
    });

  } catch (error: any) {
    console.error('Error creating MetaAPI account:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

