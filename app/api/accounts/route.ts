import { NextRequest, NextResponse } from 'next/server';

// Mock response for development/testing
const MOCK_ACCOUNTS = {
  accounts: [
    {
      id: 'mock-account-1',
      type: 'Exodus Challenge (Phase 1)',
      balance: 100000,
      status: 'active',
      metrics: {
        equity: 102500,
        dailyDrawdown: 2.5,
        maxDrawdown: 4.8,
        profitTarget: 6.2,
        winRate: 65.2,
        profitFactor: 2.1,
        totalTrades: 42,
        averageWin: 350,
        averageLoss: 180
      },
      progress: {
        profitTarget: 62,
        maxDrawdown: 68,
        minTradingDays: 75
      }
    }
  ]
};

export async function GET(req: NextRequest) {
  try {
    // For now, just return mock data
    // In production, this would verify the token and fetch real account data
    return NextResponse.json(MOCK_ACCOUNTS);
  } catch (err: unknown) {
    console.error('Error in /api/accounts:', err);
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

