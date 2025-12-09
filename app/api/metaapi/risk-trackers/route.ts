import { NextRequest, NextResponse } from 'next/server';
import { auth as adminAuth } from '@/lib/firebase-admin';

// Import MetaAPI
const RiskManagement = require('metaapi.cloud-sdk').RiskManagement;

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const accountId = searchParams.get('accountId');
    const accountToken = searchParams.get('accountToken');
    const isAdmin = searchParams.get('isAdmin') === 'true';
    
    if (!accountId || !accountToken) {
      return NextResponse.json(
        { error: 'Missing required parameters: accountId and accountToken' },
        { status: 400 }
      );
    }
    
    // Verify admin access
    if (!isAdmin) {
      const authHeader = req.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const token = authHeader.split('Bearer ')[1];
      try {
        await adminAuth.verifyIdToken(token);
      } catch (error) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
    }

    // Get risk trackers
    const riskManagement = new RiskManagement(accountToken);
    const riskApi = riskManagement.riskManagementApi;
    
    const trackers = await riskApi.getTrackers(accountId);
    
    return NextResponse.json({
      trackers: trackers.map((tracker: any) => ({
        id: tracker.id,
        name: tracker.name,
        type: tracker.type,
        absoluteDrawdownThreshold: tracker.absoluteDrawdownThreshold,
        relativeDrawdownThreshold: tracker.relativeDrawdownThreshold,
        createdAt: tracker.createdAt,
        updatedAt: tracker.updatedAt
      }))
    });
    
  } catch (error: any) {
    console.error('Error fetching risk trackers:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch risk trackers' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { accountId, accountToken, trackerConfig, isAdmin } = body;
    
    if (!accountId || !accountToken || !trackerConfig) {
      return NextResponse.json(
        { error: 'Missing required parameters: accountId, accountToken, and trackerConfig' },
        { status: 400 }
      );
    }
    
    // Verify admin access
    if (!isAdmin) {
      const authHeader = req.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const token = authHeader.split('Bearer ')[1];
      try {
        await adminAuth.verifyIdToken(token);
      } catch (error) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
    }

    // Create risk tracker
    const riskManagement = new RiskManagement(accountToken);
    const riskApi = riskManagement.riskManagementApi;
    
    const tracker = await riskApi.createTracker(accountId, trackerConfig);
    
    return NextResponse.json({
      tracker: {
        id: tracker.id,
        name: tracker.name,
        type: tracker.type,
        absoluteDrawdownThreshold: tracker.absoluteDrawdownThreshold,
        relativeDrawdownThreshold: tracker.relativeDrawdownThreshold,
        createdAt: tracker.createdAt
      },
      message: 'Risk tracker created successfully'
    });
    
  } catch (error: any) {
    console.error('Error creating risk tracker:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create risk tracker' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const accountId = searchParams.get('accountId');
    const trackerId = searchParams.get('trackerId');
    const accountToken = searchParams.get('accountToken');
    const isAdmin = searchParams.get('isAdmin') === 'true';
    
    if (!accountId || !trackerId || !accountToken) {
      return NextResponse.json(
        { error: 'Missing required parameters: accountId, trackerId, and accountToken' },
        { status: 400 }
      );
    }
    
    // Verify admin access
    if (!isAdmin) {
      const authHeader = req.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const token = authHeader.split('Bearer ')[1];
      try {
        await adminAuth.verifyIdToken(token);
      } catch (error) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
    }

    // Delete risk tracker
    const riskManagement = new RiskManagement(accountToken);
    const riskApi = riskManagement.riskManagementApi;
    
    await riskApi.deleteTracker(accountId, trackerId);
    
    return NextResponse.json({
      message: 'Risk tracker deleted successfully'
    });
    
  } catch (error: any) {
    console.error('Error deleting risk tracker:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete risk tracker' },
      { status: 500 }
    );
  }
}

