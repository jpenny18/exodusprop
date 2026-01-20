import { NextRequest, NextResponse } from 'next/server';
import { auth as adminAuth, db as adminDb } from '@/lib/firebase-admin';

// For now, we'll use mock data to test the system
// Once MetaAPI connectivity is resolved, we can switch back
const USE_MOCK_DATA = false;

// Import MetaAPI only on server side
const MetaApiClass = USE_MOCK_DATA ? null : require('metaapi.cloud-sdk').default;
const MetaStats = USE_MOCK_DATA ? null : require('metaapi.cloud-sdk').MetaStats;
const RiskManagement = USE_MOCK_DATA ? null : require('metaapi.cloud-sdk').RiskManagement;

// Get the main MetaAPI auth token
const METAAPI_AUTH_TOKEN = process.env.METAAPI_AUTH_TOKEN || 'your-metaapi-auth-token-here';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { accountId, accountToken, accountType, accountSize, step, isAdmin } = body;
    
    console.log('Request body:', { 
      accountId, 
      hasToken: !!accountToken, 
      accountType, 
      accountSize,
      step 
    });
    
    // Validate required parameters
    if (!accountId || !accountToken) {
      return NextResponse.json(
        { error: 'Missing required parameters: accountId and accountToken are required' },
        { status: 400 }
      );
    }
    
    // Determine which auth token to use
    // If accountToken is 'main-token', use the main METAAPI_AUTH_TOKEN
    const authTokenToUse = (accountToken === 'main-token') ? METAAPI_AUTH_TOKEN : accountToken;
    
    console.log('Using auth token:', authTokenToUse === METAAPI_AUTH_TOKEN ? 'main-token' : 'account-specific-token');
    
    // Skip user auth check if admin
    let userId = null;
    if (!isAdmin) {
      // Verify user is authenticated
      const authHeader = req.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const token = authHeader.split('Bearer ')[1];
      try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        userId = decodedToken.uid;
        console.log('Authenticated user:', userId);
      } catch (error) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
    } else {
      console.log('Admin access - skipping user authentication');
    }

    // Verify user has access to this account
    try {
      // Only check for user's account ownership if not admin
      if (!isAdmin && userId) {
        const accountsRef = adminDb.collection('userMetaApiAccounts');
        const snapshot = await accountsRef
          .where('userId', '==', userId)
          .where('accountId', '==', accountId)
          .get();
        
        if (snapshot.empty) {
          return NextResponse.json({ error: 'Account not found or access denied' }, { status: 403 });
        }

        // Check account status
        const accountDoc = snapshot.docs[0].data();
        const accountStatus = accountDoc.status;
        
        // If account is failed, return cached metrics only
        if (accountStatus === 'failed') {
          console.log('Account is failed, returning cached metrics only');
          
          // Get cached metrics
          const cachedMetricsRef = adminDb.collection('cachedMetrics').doc(accountId);
          const cachedMetricsDoc = await cachedMetricsRef.get();
          
          if (!cachedMetricsDoc.exists) {
            return NextResponse.json({ 
              error: 'No cached metrics available for failed account',
              accountStatus: 'failed'
            }, { status: 404 });
          }
          
          const cachedData = cachedMetricsDoc.data();
          if (!cachedData) {
            return NextResponse.json({ 
              error: 'Invalid cached metrics data',
              accountStatus: 'failed'
            }, { status: 500 });
          }
          
          // Return cached data in the expected format
          return NextResponse.json({
            metrics: {
              balance: cachedData.balance || 0,
              equity: cachedData.equity || 0,
              averageProfit: cachedData.averageProfit || 0,
              averageLoss: cachedData.averageLoss || 0,
              numberOfTrades: cachedData.numberOfTrades || 0,
              wonTrades: cachedData.wonTrades || 0,
              lostTrades: cachedData.lostTrades || 0,
              averageRRR: cachedData.averageRRR || 0,
              lots: cachedData.lots || 0,
              expectancy: cachedData.expectancy || 0,
              winRate: cachedData.winRate || 0,
              profitFactor: cachedData.profitFactor || 0,
              maxDrawdown: cachedData.maxDrawdown || 0,
              dailyDrawdown: cachedData.dailyDrawdown || 0,
              trades: cachedData.numberOfTrades || 0,
              avgRRR: cachedData.averageRRR || 0
            },
            accountInfo: {
              accountId,
              name: cachedData.accountName || 'Failed Account',
              broker: cachedData.broker || 'Unknown',
              server: cachedData.server || 'Unknown',
              balance: cachedData.balance || 0,
              equity: cachedData.equity || 0,
              currency: 'USD',
              leverage: 100,
              type: 'ACCOUNT_TRADE_MODE_DEMO',
              platform: accountDoc.platform || 'mt5',
              state: 'FAILED',
              connectionStatus: 'DISCONNECTED'
            },
            trades: cachedData.lastTrades || [],
            equityChart: cachedData.lastEquityChart || [],
            objectives: cachedData.lastObjectives || calculateTradingObjectives(
              {
                balance: cachedData.balance || 0,
                maxDrawdown: cachedData.maxDrawdown || 0,
                dailyDrawdown: cachedData.dailyDrawdown || 0,
                trades: cachedData.numberOfTrades || 0,
                tradingDays: cachedData.tradingDays || 0
              },
              accountType,
              accountSize,
              step || 1,
              undefined,
              undefined,
              undefined,
              undefined,
              cachedData.maxDailyDrawdown // Pass the cached max daily drawdown
            ),
            riskEvents: cachedData.lastRiskEvents || [],
            periodStats: cachedData.lastPeriodStats || [],
            accountStatus: 'failed'
          });
        }
      }
    } catch (error) {
      console.error('Database query error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Use mock data for testing
    if (USE_MOCK_DATA) {
      const mockResponse = generateMockData(accountId, accountType, accountSize, step);
      return NextResponse.json(mockResponse);
    }

    // Real MetaAPI implementation - HYBRID APPROACH
    const metaApi = new MetaApiClass(authTokenToUse);
    const metaStats = new MetaStats(authTokenToUse);
    const riskManagement = new RiskManagement(authTokenToUse);
    
    console.log('MetaAPI initialized with token:', authTokenToUse === METAAPI_AUTH_TOKEN ? 'main-token' : authTokenToUse.substring(0, 20) + '...');
    console.log('Processing request for account:', accountId);

    // Initialize response data
    let accountData = null;
    let tradesData: any[] = [];
    let equityData: any[] = [];
    let riskEvents: any[] = [];
    let periodStats: any[] = [];
    let trackers: any[] = [];
    let metricsFromStats: any = null;

    try {
      // 1. Fetch account info first to ensure connection
      accountData = await fetchAccountInfo(metaApi, accountId);
    } catch (error) {
      console.error('Error fetching account info:', error);
      // Continue with other data fetching
    }

    // 2. Get core metrics using MetaStats (original working approach)
    try {
      const startDate = '2020-01-01 00:00:00.000';
      const endDate = new Date().toISOString().slice(0, 19).replace('T', ' ') + '.000';
      
      console.log(`Fetching MetaStats metrics for account ${accountId}`);
      
      // Fetch metrics using the correct MetaStats API method
      metricsFromStats = await metaStats.getMetrics(accountId);
      console.log('MetaStats metrics received:', {
        balance: metricsFromStats?.balance,
        equity: metricsFromStats?.equity,
        trades: metricsFromStats?.trades,
        profitFactor: metricsFromStats?.profitFactor
      });
    } catch (error: any) {
      console.error('Error fetching MetaStats metrics:', error.message);
      
      // Check if this is a MetaStats API not enabled error
      if (error.message && error.message.includes('metastats API you need enable it')) {
        console.log('MetaStats API is not enabled for this account');
        
        // Return helpful error response for admin
        if (isAdmin) {
          return NextResponse.json({
            error: 'MetaStats API is not enabled for this account',
            solution: 'Please enable MetaStats API in the MetaAPI web UI or recreate the account with MetaStats enabled',
            accountId,
            webUIUrl: `https://app.metaapi.cloud/accounts/${accountId}/enable-account-features`
          }, { status: 400 });
        }
        
        // For non-admin users, provide a more user-friendly message
        return NextResponse.json({
          error: 'Account metrics are currently unavailable. Please contact support.',
          accountStatus: 'configuration_required'
        }, { status: 503 });
      }
    }

    // 3. Fetch trades using MetaStats
    try {
      const startDate = '2020-01-01 00:00:00.000';
      const endDate = new Date().toISOString().slice(0, 19).replace('T', ' ') + '.000';
      
      console.log(`Fetching trades for account ${accountId} from ${startDate} to ${endDate}`);
      
      // Fetch both historical trades and open trades
      const [historicalTrades, openTrades] = await Promise.all([
        metaStats.getAccountTrades(accountId, startDate, endDate).catch(() => []),
        metaStats.getAccountOpenTrades ? metaStats.getAccountOpenTrades(accountId).catch(() => []) : Promise.resolve([])
      ]);
      
      // Combine historical and open trades
      tradesData = [...(historicalTrades || []), ...(openTrades || [])];
      console.log(`Retrieved ${tradesData.length} total trades (${historicalTrades?.length || 0} historical, ${openTrades?.length || 0} open)`);
      
      // Filter out balance operations and non-trading deals
      const beforeFilterCount = tradesData.length;
      tradesData = tradesData.filter((trade: any) => {
        // Check if it's a real trade
        const isRealTrade = trade.type && 
               !trade.type.includes('DEAL_TYPE_BALANCE') &&
               !trade.type.includes('DEAL_TYPE_CREDIT') &&
               !trade.type.includes('DEAL_TYPE_CHARGE') &&
               !trade.type.includes('DEAL_TYPE_CORRECTION') &&
               !trade.type.includes('DEAL_TYPE_BONUS') &&
               !trade.type.includes('DEAL_TYPE_COMMISSION') &&
               trade.symbol; // Must have a symbol to be a real trade
        
        return isRealTrade;
      });
      
      console.log(`Filtered from ${beforeFilterCount} to ${tradesData.length} actual trades`);
    } catch (error: any) {
      console.error('Error fetching trades:', error.message);
    }

    // 4. Fetch equity data using MetaStats
    try {
      // Check if getAccountEquityChart method exists
      if (typeof metaStats.getAccountEquityChart === 'function') {
        equityData = await metaStats.getAccountEquityChart(accountId);
      console.log(`Retrieved ${equityData.length} equity data points`);
      
      // Log sample equity data to understand structure
      if (equityData.length > 0) {
        console.log('Sample equity data:', JSON.stringify(equityData[0], null, 2));
        }
      } else {
        console.log('getAccountEquityChart method not available in this SDK version');
      }
    } catch (error: any) {
      console.error('Error fetching equity chart:', error.message);
    }

    // 5. Enhanced features: Try Risk Management API for advanced features
    let riskApi = null;
    try {
      riskApi = riskManagement.riskManagementApi;
      
      // If we didn't get equity data from MetaStats, try Risk Management API
      if ((!equityData || equityData.length === 0) && riskApi) {
        console.log('Trying to get equity data from Risk Management API as fallback');
        try {
          equityData = await riskApi.getEquityChart(accountId);
          console.log(`Retrieved ${equityData.length} equity data points from Risk Management API`);
        } catch (riskError: any) {
          console.log('Risk Management equity chart also not available:', riskError.message);
        }
      }
    } catch (error: any) {
      console.log('Risk Management API not available:', error.message);
    }

    if (riskApi) {
      try {
        // Setup risk trackers for automated monitoring (enhanced feature)
        // Only attempt setup if we don't already have sufficient trackers
        const existingTrackers = await riskApi.getTrackers(accountId);
        const needsSetup = existingTrackers.length < 2; // We expect 2 trackers (max drawdown + daily drawdown)
        
        if (needsSetup) {
          console.log(`Account has ${existingTrackers.length} trackers, setting up automated risk monitoring...`);
          trackers = await setupRiskTrackers(riskApi, accountId, accountType, accountSize, step);
          console.log(`Risk tracker setup completed: ${trackers.length} active trackers`);
        } else {
          console.log(`Account already has ${existingTrackers.length} trackers configured`);
          trackers = existingTrackers;
        }
      } catch (error: any) {
        console.error('Error with risk tracker management:', error.message);
        // Fallback: try to get existing trackers even if setup failed
        try {
          trackers = await riskApi.getTrackers(accountId);
        } catch (fallbackError: any) {
          console.error('Could not retrieve any trackers:', fallbackError.message);
          trackers = [];
        }
      }

      try {
        // Get tracker events (breach notifications) - enhanced feature
        riskEvents = await riskApi.getTrackerEvents(accountId, null, null, 100);
        console.log(`Retrieved ${riskEvents.length} risk events`);
      } catch (error: any) {
        console.error('Error fetching tracker events:', error.message);
      }

      try {
        // Try to get period statistics - enhanced feature (may not exist)
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30); // Last 30 days
        
        if (typeof riskApi.getPeriodStatistics === 'function') {
          periodStats = await riskApi.getPeriodStatistics(
            accountId,
            startDate.toISOString(),
            endDate.toISOString(),
            'day'
          );
          console.log(`Retrieved ${periodStats.length} period statistics`);
        } else {
          console.log('Period statistics not available in this SDK version');
        }
      } catch (error: any) {
        console.error('Error fetching period statistics:', error.message);
      }
    } else {
      console.log('Risk Management API not available - skipping enhanced features');
    }

    // 6. Process and combine data
    // Use MetaStats data as primary source, enhanced by Risk Management where available
    const combinedMetrics = {
      balance: metricsFromStats?.balance || accountData?.balance || 0,
      equity: metricsFromStats?.equity || accountData?.equity || 0,
      margin: metricsFromStats?.margin || 0,
      freeMargin: metricsFromStats?.freeMargin || 0,
      profit: metricsFromStats?.profit || 0,
      credit: metricsFromStats?.credit || 0,
      trades: metricsFromStats?.trades || 0,
      wonTrades: metricsFromStats?.wonTrades || 0,
      lostTrades: metricsFromStats?.lostTrades || 0,
      averageWin: metricsFromStats?.averageWin || 0,
      averageLoss: metricsFromStats?.averageLoss || 0,
      expectancy: metricsFromStats?.expectancy || 0,
      profitFactor: metricsFromStats?.profitFactor || 0,
      absoluteDrawdown: metricsFromStats?.absoluteDrawdown || 0,
      maxDrawdown: metricsFromStats?.maxDrawdown || 0,
      relativeDrawdown: metricsFromStats?.relativeDrawdown || 0,
      lots: metricsFromStats?.lots || 0,
      commissions: metricsFromStats?.commissions || 0
    };

    // Calculate additional metrics
    const winRate = combinedMetrics.trades > 0 ? (combinedMetrics.wonTrades / combinedMetrics.trades) * 100 : 0;
    const avgRRR = combinedMetrics.averageLoss !== 0 ? Math.abs(combinedMetrics.averageWin / combinedMetrics.averageLoss) : 0;

    // Calculate daily drawdown from equity data
    const calculatedDailyDrawdown = equityData && equityData.length > 0 
      ? calculateDailyDrawdown(equityData)
      : combinedMetrics.relativeDrawdown || 0;

    // Calculate trading objectives with enhanced data
    const objectives = calculateTradingObjectives(
      combinedMetrics, 
      accountType, 
      accountSize, 
      step || 1,
      equityData, 
      tradesData, 
      riskEvents,
      periodStats,
      await getCachedMaxDailyDrawdown(accountId)
    );

    // Format response with hybrid data approach
    const response = {
      metrics: {
        ...combinedMetrics,
        winRate,
        avgRRR,
        dailyDrawdown: calculatedDailyDrawdown
      },
      accountInfo: accountData || {
        accountId,
        name: 'Unknown Account',
        broker: 'Unknown',
        server: 'Unknown',
        balance: combinedMetrics.balance,
        equity: combinedMetrics.equity,
        currency: 'USD',
        leverage: 100,
        type: 'ACCOUNT_TRADE_MODE_DEMO',
        platform: 'mt5',
        state: 'UNKNOWN',
        connectionStatus: 'UNKNOWN'
      },
      trades: tradesData.map((trade: any) => ({
        id: trade._id || trade.id || `trade_${Date.now()}_${Math.random()}`,
        symbol: trade.symbol || 'Unknown',
        type: mapTradeType(trade.type),
        volume: parseFloat(trade.volume || trade.lots) || 0,
        openPrice: parseFloat(trade.openPrice || trade.priceOpen || trade.price) || 0,
        closePrice: trade.closePrice != null ? parseFloat(trade.closePrice || trade.priceClose) : null,
        profit: parseFloat(trade.profit || trade.gain) || 0,
        openTime: trade.openTime || trade.time || new Date().toISOString(),
        closeTime: trade.closeTime || null,
        commission: parseFloat(trade.commission || trade.commissions) || 0,
        swap: parseFloat(trade.swap || trade.swaps) || 0,
        state: trade.state || (trade.closeTime ? 'closed' : 'opened')
      })),
      equityChart: formatEquityChart(equityData),
      objectives,
      riskEvents: riskEvents.map(event => ({
        id: event.id,
        type: event.exceededThresholdType,
        accountId: event.accountId,
        sequenceNumber: event.sequenceNumber,
        brokerTime: event.brokerTime,
        absoluteDrawdown: event.absoluteDrawdown,
        relativeDrawdown: event.relativeDrawdown,
        exceededThresholdType: event.exceededThresholdType
      })),
      periodStats: periodStats.map(stat => ({
        period: stat.period,
        startBrokerTime: stat.startBrokerTime,
        endBrokerTime: stat.endBrokerTime,
        balance: stat.balance,
        equity: stat.equity,
        maxDrawdown: stat.maxDrawdown,
        maxDailyDrawdown: stat.maxDailyDrawdown,
        profit: stat.profit,
        trades: stat.trades,
        tradingDays: stat.tradingDays
      })),
      trackers: trackers.map(tracker => {
        // Clean object by removing undefined values
        const cleanTracker: any = {
          id: tracker.id || `tracker_${tracker.name}_${Date.now()}`,
          name: tracker.name || 'Unknown Tracker',
          period: tracker.period || 'day'
        };
        
        // Only add fields if they have actual values
        if (tracker.type !== undefined) cleanTracker.type = tracker.type;
        if (tracker.absoluteDrawdownThreshold !== undefined) cleanTracker.absoluteDrawdownThreshold = tracker.absoluteDrawdownThreshold;
        if (tracker.relativeDrawdownThreshold !== undefined) cleanTracker.relativeDrawdownThreshold = tracker.relativeDrawdownThreshold;
        if (tracker.absoluteProfitThreshold !== undefined) cleanTracker.absoluteProfitThreshold = tracker.absoluteProfitThreshold;
        if (tracker.relativeProfitThreshold !== undefined) cleanTracker.relativeProfitThreshold = tracker.relativeProfitThreshold;
        if (tracker.startBrokerTime !== undefined) cleanTracker.startBrokerTime = tracker.startBrokerTime;
        if (tracker.endBrokerTime !== undefined) cleanTracker.endBrokerTime = tracker.endBrokerTime;
        
        return cleanTracker;
      })
    };
    
    console.log(`Returning ${response.trades.length} trades, ${response.equityChart.length} equity points, ${response.riskEvents.length} risk events`);
    console.log(`Daily Drawdown: ${calculatedDailyDrawdown.toFixed(2)}%, Risk Trackers: ${trackers.length}`);

    // Save enhanced data to Firebase cache
    if (!USE_MOCK_DATA) {
      try {
        // Get existing cached metrics to check for max daily drawdown
        let maxDailyDrawdown = calculatedDailyDrawdown;
        try {
          const existingCached = await adminDb.collection('cachedMetrics').doc(accountId).get();
          if (existingCached.exists) {
            const existingData = existingCached.data();
            // Keep the higher value between current and previously recorded max daily drawdown
            maxDailyDrawdown = Math.max(
              calculatedDailyDrawdown,
              existingData?.maxDailyDrawdown || 0
            );
          }
        } catch (err) {
          // If no existing cache, use current value
          console.log('No existing cache found, using current daily drawdown');
        }
        
        const metricsToCache = {
          accountId,
          balance: response.metrics.balance,
          equity: response.metrics.equity,
          averageProfit: response.metrics.averageWin,
          averageLoss: response.metrics.averageLoss,
          numberOfTrades: response.metrics.trades,
          wonTrades: response.metrics.wonTrades,
          lostTrades: response.metrics.lostTrades,
          averageRRR: response.metrics.avgRRR,
          lots: response.metrics.lots,
          expectancy: response.metrics.expectancy,
          winRate: response.metrics.winRate,
          profitFactor: response.metrics.profitFactor,
          maxDrawdown: response.metrics.maxDrawdown,
          dailyDrawdown: calculatedDailyDrawdown,
          maxDailyDrawdown,
          currentProfit: response.metrics.profit,
          tradingDays: response.objectives.minTradingDays.current,
          accountName: response.accountInfo.name,
          broker: response.accountInfo.broker,
          server: response.accountInfo.server,
          lastTrades: response.trades,
          lastEquityChart: response.equityChart,
          lastObjectives: response.objectives,
          lastRiskEvents: response.riskEvents,
          lastPeriodStats: response.periodStats,
          lastTrackers: response.trackers,
          lastUpdated: new Date()
        };

        await adminDb.collection('cachedMetrics').doc(accountId).set(metricsToCache);
        console.log('Enhanced metrics cached to Firebase for account:', accountId);
        console.log(`Max Daily Drawdown recorded: ${maxDailyDrawdown.toFixed(2)}%, Risk Events: ${response.riskEvents.length}`);
      } catch (cacheError) {
        console.error('Error caching metrics to Firebase:', cacheError);
        // Don't fail the request if caching fails
      }
    }

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}

// Enhanced function to set up automated risk trackers
async function setupRiskTrackers(riskApi: any, accountId: string, accountType: '1-step' | 'elite', accountSize: number, step: number = 1) {
  try {
    // Check if riskApi is available
    if (!riskApi) {
      console.log('Risk API not available - cannot set up trackers');
      return [];
    }

    // Get existing trackers
    const existingTrackers = await riskApi.getTrackers(accountId);
    console.log(`Found ${existingTrackers.length} existing trackers`);
    
    // Define the trackers we need based on challenge type and step
    const isFunded = step === 3;
    const requiredTrackers: any[] = [];
    
    if (accountType === '1-step') {
      // 1-STEP CHALLENGE RULES:
      // - 8% profit target
      // - 4% max daily loss
      // - 6% max drawdown (STATIC - from initial balance)
      // Funded 1-step accounts have slightly relaxed rules
      const targetDrawdown = isFunded ? 8 : 6; // 6% static max DD for challenge, 8% for funded
      const targetDailyDrawdown = isFunded ? 4 : 4; // 4% daily for challenge, 4% for funded
      
      requiredTrackers.push({
        name: isFunded ? '1-Step Funded Max Drawdown Monitor' : '1-Step Max Drawdown Monitor',
        period: 'day',
        relativeDrawdownThreshold: targetDrawdown / 100,
        absoluteDrawdownThreshold: (accountSize * targetDrawdown) / 100
      });
      
      requiredTrackers.push({
        name: isFunded ? '1-Step Funded Daily Loss Monitor' : '1-Step Daily Loss Monitor',
        period: 'day',
        relativeDrawdownThreshold: targetDailyDrawdown / 100,
        absoluteDrawdownThreshold: (accountSize * targetDailyDrawdown) / 100
      });
    } else if (accountType === 'elite') {
      // ELITE CHALLENGE RULES:
      // - 10% profit target
      // - 10% max daily loss (TRAILING end of day)
      // - NO max drawdown limit
      // Elite funded accounts have the same daily loss limit
      const targetDailyDrawdown = 10; // 10% trailing daily loss limit for both challenge and funded
      
      // Elite has NO max drawdown tracker - only daily loss tracker
      requiredTrackers.push({
        name: isFunded ? 'Elite Funded Daily Loss Monitor (Trailing)' : 'Elite Daily Loss Monitor (Trailing)',
        period: 'day',
        relativeDrawdownThreshold: targetDailyDrawdown / 100,
        absoluteDrawdownThreshold: (accountSize * targetDailyDrawdown) / 100
      });
      
      // Add profit target tracker for Elite (10%)
      const targetProfit = 10;
      requiredTrackers.push({
        name: isFunded ? 'Elite Funded Profit Monitor' : 'Elite Profit Monitor',
        period: 'day',
        relativeProfitThreshold: targetProfit / 100,
        absoluteProfitThreshold: (accountSize * targetProfit) / 100
      });
    }
    
    // Check if trackers already exist and create missing ones
    for (const requiredTracker of requiredTrackers) {
      const existingTracker = existingTrackers.find((t: any) => t.name === requiredTracker.name);
      
      if (!existingTracker) {
        console.log(`Creating tracker: ${requiredTracker.name}`);
        try {
          await riskApi.createTracker(accountId, requiredTracker);
          console.log(`Successfully created tracker: ${requiredTracker.name}`);
        } catch (createError: any) {
          console.error(`Failed to create tracker ${requiredTracker.name}:`, createError.message);
          // Continue with other trackers even if one fails
        }
      } else {
        console.log(`Tracker already exists: ${requiredTracker.name}`);
      }
    }
    
    // Return updated list of trackers
    const updatedTrackers = await riskApi.getTrackers(accountId);
    console.log(`Final tracker count: ${updatedTrackers.length}`);
    return updatedTrackers;
  } catch (error) {
    console.error('Error setting up risk trackers:', error);
    return [];
  }
}

// Enhanced function to format equity chart data
function formatEquityChart(equityData: any[]): any[] {
  const chartPoints: any[] = [];
  
  equityData.forEach((point: any) => {
    // Handle different data structures from Risk Management API
    if (point.startBrokerTime && point.endBrokerTime) {
      // Add start point
      chartPoints.push({
        date: point.startBrokerTime,
        equity: parseFloat(point.startEquity || point.averageEquity || 0),
        balance: parseFloat(point.startBalance || point.averageBalance || 0)
      });
      
      // Add end point
      chartPoints.push({
        date: point.endBrokerTime,
        equity: parseFloat(point.lastEquity || point.averageEquity || point.equity || 0),
        balance: parseFloat(point.lastBalance || point.averageBalance || point.balance || 0)
      });
    } else {
      // Single point data
      chartPoints.push({
        date: point.brokerTime || point.date || new Date().toISOString(),
        equity: parseFloat(point.equity || point.averageEquity || 0),
        balance: parseFloat(point.balance || point.averageBalance || 0)
      });
    }
  });
  
  // Sort by date and filter out invalid points
  return chartPoints
    .filter((point: any) => point.equity > 0 || point.balance > 0)
    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

async function fetchAccountInfo(metaApi: any, accountId: string) {
  try {
    const account = await metaApi.metatraderAccountApi.getAccount(accountId);
    
    // First get basic account info from the account object
    const accountData = {
      accountId: account.id,
      name: account.name,
      broker: account.broker || 'Unknown',
      server: account.server || 'Unknown',
      type: account.type,
      platform: account.platform || 'mt5',
      state: account.state,
      connectionStatus: account.connectionStatus,
      // Default values that will be updated if we can connect
      balance: 0,
      equity: 0,
      currency: 'USD',
      leverage: 100
    };
    
    try {
      // Deploy account if needed
      if (account.state !== 'DEPLOYED') {
        console.log(`Deploying account ${accountId}. State: ${account.state}`);
        await account.deploy();
        console.log('Waiting for deployment...');
        // Wait a bit for deployment
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
      
      // Wait for connection if not connected
      if (account.connectionStatus !== 'CONNECTED') {
        console.log(`Waiting for account ${accountId} to connect. Status: ${account.connectionStatus}`);
        await account.waitConnected({ timeoutInSeconds: 30 });
      }
      
      // After account is connected, get account information
      // Based on the SDK, we need to create a connection to get real-time data
      const connection = account.getRPCConnection();
      
      try {
        await connection.connect();
        await connection.waitSynchronized({ timeoutInSeconds: 10 });
        
        // Get account information
        const accountInfo = await connection.getAccountInformation();
        if (accountInfo) {
          accountData.balance = accountInfo.balance || 0;
          accountData.equity = accountInfo.equity || 0;
          accountData.currency = accountInfo.currency || 'USD';
          accountData.leverage = accountInfo.leverage || 100;
          accountData.broker = accountInfo.broker || account.broker || 'Unknown';
          accountData.server = accountInfo.server || account.server || 'Unknown';
        }
        
        // Close connection after getting data
        if (connection.close) {
          connection.close();
        }
      } catch (connectionError: any) {
        console.error('Error with RPC connection:', connectionError.message);
        // Try streaming connection as fallback
        try {
          const streamingConnection = account.getStreamingConnection();
          await streamingConnection.connect();
          await streamingConnection.waitSynchronized({ timeoutInSeconds: 10 });
          
          // Check terminal state for account information
          if (streamingConnection.terminalState && streamingConnection.terminalState.accountInformation) {
            const info = streamingConnection.terminalState.accountInformation;
            accountData.balance = info.balance || 0;
            accountData.equity = info.equity || 0;
            accountData.currency = info.currency || 'USD';
            accountData.leverage = info.leverage || 100;
            accountData.broker = info.broker || account.broker || 'Unknown';
            accountData.server = info.server || account.server || 'Unknown';
          }
          
          if (streamingConnection.close) {
            streamingConnection.close();
          }
        } catch (streamingError: any) {
          console.error('Error with streaming connection:', streamingError.message);
        }
      }
      
    } catch (deploymentError: any) {
      console.error('Error deploying/connecting account:', deploymentError.message);
      // Return the basic account data we have
    }
    
    return accountData;
  } catch (error) {
    console.error('Error fetching account info:', error);
    throw error;
  }
}

// Helper function to calculate daily drawdown from equity data
function calculateDailyDrawdown(equityData: any[]): number {
  if (!equityData || equityData.length === 0) return 0;
  
  let maxDailyDrawdown = 0;
  
  // Group equity data by day
  const dailyData: { [key: string]: any[] } = {};
  
  equityData.forEach(point => {
    const date = new Date(point.brokerTime || point.endBrokerTime || point.date);
    const dayKey = date.toISOString().slice(0, 10); // YYYY-MM-DD
    
    if (!dailyData[dayKey]) {
      dailyData[dayKey] = [];
    }
    dailyData[dayKey].push(point);
  });
  
  // Calculate max drawdown for each day
  Object.values(dailyData).forEach(dayPoints => {
    let dayHighBalance = 0;
    let dayHighEquity = 0;
    let maxDayDrawdown = 0;
    
    dayPoints.forEach(point => {
      // Track highest balance/equity for the day
      const balance = parseFloat(point.balance || point.lastBalance || point.maxBalance || 0);
      const equity = parseFloat(point.equity || point.lastEquity || point.maxEquity || 0);
      
      dayHighBalance = Math.max(dayHighBalance, balance);
      dayHighEquity = Math.max(dayHighEquity, equity);
      
      // Calculate current drawdown from day's high
      const currentEquity = parseFloat(point.lastEquity || point.equity || point.minEquity || 0);
      const drawdownFromHigh = dayHighEquity > 0 ? ((dayHighEquity - currentEquity) / dayHighEquity) * 100 : 0;
      
      maxDayDrawdown = Math.max(maxDayDrawdown, drawdownFromHigh);
    });
    
    // Track the worst daily drawdown across all days
    maxDailyDrawdown = Math.max(maxDailyDrawdown, maxDayDrawdown);
  });
  
  return maxDailyDrawdown;
}

// Helper function to get cached max daily drawdown
async function getCachedMaxDailyDrawdown(accountId: string): Promise<number | undefined> {
  try {
    const cachedDoc = await adminDb.collection('cachedMetrics').doc(accountId).get();
    if (cachedDoc.exists) {
      const data = cachedDoc.data();
      return data?.maxDailyDrawdown;
    }
  } catch (error) {
    console.error('Error fetching cached max daily drawdown:', error);
  }
  return undefined;
}

function calculateTradingObjectives(
  metrics: any,
  challengeType: '1-step' | 'elite',
  accountStartBalance: number,
  step: number = 1,
  equityData?: any[],
  tradesData?: any[],
  riskEvents?: any[],
  periodStats?: any[],
  cachedMaxDailyDrawdown?: number
) {
  const currentBalance = metrics.balance || 0;
  const isFunded = step === 3;
  
  // STATIC DRAWDOWN CALCULATION (for 1-step)
  // Static drawdown is measured from INITIAL BALANCE, not from peak equity
  // Example: $100k account, current balance $95k = 5% static drawdown
  let staticDrawdown = 0;
  if (accountStartBalance > 0 && currentBalance < accountStartBalance) {
    staticDrawdown = ((accountStartBalance - currentBalance) / accountStartBalance) * 100;
  }
  
  // TRAILING DRAWDOWN CALCULATION (for elite)
  // Trailing drawdown is measured from PEAK EQUITY
  const trailingDrawdown = metrics.maxDrawdown || 0;
  
  // Enhanced daily drawdown calculation using multiple sources
  let maxDailyDrawdown = 0;
  
  // Priority 1: Use period statistics (most accurate)
  if (periodStats && periodStats.length > 0) {
    maxDailyDrawdown = Math.max(...periodStats.map(p => p.maxDailyDrawdown || 0));
  }
  // Priority 2: Check risk events for daily drawdown breaches
  else if (riskEvents && riskEvents.length > 0) {
    const dailyDDEvents = riskEvents.filter(e => e.exceededThresholdType === 'dailyDrawdown');
    if (dailyDDEvents.length > 0) {
      maxDailyDrawdown = Math.max(...dailyDDEvents.map(e => e.relativeDrawdown || 0));
    }
  }
  // Priority 3: Use detailed calculation from equity data
  else if (equityData && equityData.length > 0) {
    maxDailyDrawdown = calculateDailyDrawdown(equityData);
  }
  // Priority 4: Use cached max daily drawdown
  else if (cachedMaxDailyDrawdown !== undefined) {
    maxDailyDrawdown = cachedMaxDailyDrawdown;
  }
  // Priority 5: Fallback to metrics data
  else {
    maxDailyDrawdown = Math.max(
      metrics.dailyDrawdown || 0,
      metrics.relativeDrawdown || 0,
      metrics.maxDailyDrawdown || 0,
      metrics.maxRelativeDrawdown || 0
    );
  }
  
  const profitPercentage = accountStartBalance > 0 
    ? ((currentBalance - accountStartBalance) / accountStartBalance) * 100 
    : 0;
  
  // EXODUS CHALLENGE RULES
  // Two challenge types: 1-step and elite
  const targets = {
    '1-step': {
      minTradingDays: 0, // No minimum trading days
      maxDrawdown: 6, // 6% STATIC max drawdown from initial balance
      maxDailyDrawdown: 4, // 4% daily loss limit
      profitTarget: 8 // 8% profit target
    },
    '1-step-funded': {
      minTradingDays: 5, // 5 days with 0.5% gain for payout eligibility
      maxDrawdown: 8, // 8% max drawdown for funded
      maxDailyDrawdown: 5, // 5% daily drawdown for funded
      profitTarget: 0 // No profit target for funded
    },
    'elite': {
      minTradingDays: 0, // No minimum trading days
      maxDrawdown: null, // NO max drawdown for elite
      maxDailyDrawdown: 10, // 10% TRAILING daily loss (end of day)
      profitTarget: 10 // 10% profit target
    },
    'elite-funded': {
      minTradingDays: 5, // 5 days with 0.5% gain for payout eligibility
      maxDrawdown: null, // NO max drawdown for elite funded
      maxDailyDrawdown: 10, // 10% trailing daily loss
      profitTarget: 0 // No profit target for funded
    }
  };
  
  // Select the appropriate target based on account type and funded status
  const targetKey = isFunded ? `${challengeType}-funded` : challengeType;
  const target = targets[targetKey as keyof typeof targets];
  
  // Trading days calculation
  let tradingDays = 0;
  
  if (isFunded && periodStats && periodStats.length > 0) {
    // For funded accounts: count days with 0.5% gain from starting balance
    const gainThreshold = accountStartBalance * 0.005;
    periodStats.forEach(stat => {
      if (stat.profit >= gainThreshold) {
        tradingDays++;
      }
    });
  } else if (periodStats && periodStats.length > 0) {
    const latestStat = periodStats[periodStats.length - 1];
    tradingDays = latestStat.tradingDays || 0;
  } else if (tradesData && tradesData.length > 0) {
    const tradesByDay: { [key: string]: number } = {};
    tradesData.forEach(trade => {
      const tradeDate = trade.openTime || trade.time || trade.date;
      if (tradeDate) {
        const date = new Date(tradeDate);
        const dayKey = date.toISOString().slice(0, 10);
        if (!tradesByDay[dayKey]) tradesByDay[dayKey] = 0;
        tradesByDay[dayKey]++;
      }
    });
    Object.values(tradesByDay).forEach(tradesCount => {
      if (tradesCount >= 1) tradingDays++;
    });
  } else if (metrics.tradingDays) {
    tradingDays = metrics.tradingDays;
  } else if (metrics.trades > 0) {
    tradingDays = Math.min(Math.floor(metrics.trades / 2), 30);
  }
  
  // Check for recent breaches in risk events
  const recentBreaches = {
    maxDrawdown: false,
    dailyDrawdown: false
  };
  
  if (riskEvents && riskEvents.length > 0) {
    const recentEvents = riskEvents.filter(e => {
      const eventTime = new Date(e.brokerTime);
      const dayAgo = new Date();
      dayAgo.setDate(dayAgo.getDate() - 1);
      return eventTime > dayAgo;
    });
    recentBreaches.maxDrawdown = recentEvents.some(e => e.exceededThresholdType === 'drawdown');
    recentBreaches.dailyDrawdown = recentEvents.some(e => e.exceededThresholdType === 'dailyDrawdown');
  }
  
  // Build objectives based on challenge type
  if (challengeType === '1-step') {
    // 1-STEP CHALLENGE: 8% profit, 4% daily loss, 6% static max DD
    if (isFunded) {
      return {
        minTradingDays: {
          target: target.minTradingDays,
          current: tradingDays,
          passed: tradingDays >= target.minTradingDays
        },
        maxDrawdown: {
          target: target.maxDrawdown,
          current: staticDrawdown,
          passed: staticDrawdown <= (target.maxDrawdown as number),
          recentBreach: recentBreaches.maxDrawdown,
          isStatic: true
        },
        maxDailyDrawdown: {
          target: target.maxDailyDrawdown,
          current: maxDailyDrawdown,
          passed: maxDailyDrawdown <= target.maxDailyDrawdown,
          recentBreach: recentBreaches.dailyDrawdown
        },
        profitTarget: {
          target: 0,
          current: profitPercentage,
          passed: true
        },
        fundedStatus: true,
        tradingDaysWithGain: tradingDays,
        fundedPayoutEligible: tradingDays >= target.minTradingDays
      };
    }
    
    // Challenge (not funded)
    return {
      minTradingDays: {
        target: target.minTradingDays,
        current: tradingDays,
        passed: tradingDays >= target.minTradingDays
      },
      maxDrawdown: {
        target: target.maxDrawdown,
        current: staticDrawdown,
        passed: staticDrawdown <= (target.maxDrawdown as number),
        recentBreach: recentBreaches.maxDrawdown,
        isStatic: true,
        trailingDrawdown: trailingDrawdown
      },
      maxDailyDrawdown: {
        target: target.maxDailyDrawdown,
        current: maxDailyDrawdown,
        passed: maxDailyDrawdown <= target.maxDailyDrawdown,
        recentBreach: recentBreaches.dailyDrawdown
      },
      profitTarget: {
        target: target.profitTarget,
        current: profitPercentage,
        passed: profitPercentage >= target.profitTarget
      }
    };
  } else {
    // ELITE CHALLENGE: 10% profit, 10% trailing daily loss, NO max DD
    if (isFunded) {
      return {
        minTradingDays: {
          target: target.minTradingDays,
          current: tradingDays,
          passed: tradingDays >= target.minTradingDays
        },
        maxDrawdown: {
          target: null, // No max drawdown for elite
          current: trailingDrawdown,
          passed: true, // Always passes since there's no limit
          recentBreach: false,
          isStatic: false,
          noLimit: true
        },
        maxDailyDrawdown: {
          target: target.maxDailyDrawdown,
          current: maxDailyDrawdown,
          passed: maxDailyDrawdown <= target.maxDailyDrawdown,
          recentBreach: recentBreaches.dailyDrawdown,
          isTrailing: true // Elite uses trailing end-of-day
        },
        profitTarget: {
          target: 0,
          current: profitPercentage,
          passed: true
        },
        fundedStatus: true,
        tradingDaysWithGain: tradingDays,
        fundedPayoutEligible: tradingDays >= target.minTradingDays
      };
    }
    
    // Elite Challenge (not funded)
    return {
      minTradingDays: {
        target: target.minTradingDays,
        current: tradingDays,
        passed: tradingDays >= target.minTradingDays
      },
      maxDrawdown: {
        target: null, // No max drawdown for elite
        current: trailingDrawdown,
        passed: true, // Always passes since there's no limit
        recentBreach: false,
        isStatic: false,
        noLimit: true
      },
      maxDailyDrawdown: {
        target: target.maxDailyDrawdown,
        current: maxDailyDrawdown,
        passed: maxDailyDrawdown <= target.maxDailyDrawdown,
        recentBreach: recentBreaches.dailyDrawdown,
        isTrailing: true // Elite uses trailing end-of-day
      },
      profitTarget: {
        target: target.profitTarget,
        current: profitPercentage,
        passed: profitPercentage >= target.profitTarget
      }
    };
  }
}

function generateMockData(accountId: string, accountType: string, accountSize: number, step: number = 1) {
  const balance = accountSize * 1.05; // 5% profit
  const equity = balance - 150; // Small floating loss
  const trades = 47;
  const wonTrades = 28;
  const lostTrades = 19;
  const winRate = (wonTrades / trades) * 100;
  
  return {
    metrics: {
      balance,
      equity,
      margin: 250,
      freeMargin: equity - 250,
      profit: balance - accountSize,
      credit: 0,
      trades,
      wonTrades,
      lostTrades,
      averageWin: 125.50,
      averageLoss: -65.25,
      expectancy: 35.75,
      profitFactor: 1.85,
      absoluteDrawdown: 450,
      maxDrawdown: 4.5,
      relativeDrawdown: 2.3,
      dailyGrowth: 0.25,
      monthlyGrowth: 5.2,
      lots: 15.75,
      commissions: -125,
      winRate,
      avgRRR: 1.92
    },
    accountInfo: {
      accountId,
      name: 'Exodus Challenge Account',
      broker: 'MetaQuotes Software Corp.',
      server: 'MetaQuotes-Demo',
      balance,
      equity,
      currency: 'USD',
      leverage: 100,
      type: 'ACCOUNT_TRADE_MODE_DEMO',
      platform: 'mt5',
      state: 'DEPLOYED',
      connectionStatus: 'CONNECTED'
    },
    trades: generateMockTrades(),
    equityChart: generateMockEquityChart(accountSize),
    objectives: calculateMockObjectives(accountType, accountSize, balance, step, [], undefined),
    riskEvents: generateMockRiskEvents(),
    periodStats: generateMockPeriodStats(),
    trackers: generateMockTrackers(accountType, accountSize, step)
  };
}

function generateMockTrades() {
  const symbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'XAUUSD'];
  const trades = [];
  
  for (let i = 0; i < 20; i++) {
    const isWin = Math.random() > 0.4;
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const type = Math.random() > 0.5 ? 'buy' : 'sell';
    const volume = (Math.random() * 0.5 + 0.1).toFixed(2);
    const openPrice = 1.0500 + Math.random() * 0.01;
    const profit = isWin ? Math.random() * 200 : -(Math.random() * 100);
    
    trades.push({
      id: `trade_${i}`,
      symbol,
      type,
      volume: parseFloat(volume),
      openPrice,
      closePrice: openPrice + (profit > 0 ? 0.001 : -0.0005),
      profit,
      openTime: new Date(Date.now() - i * 3600000).toISOString(),
      closeTime: i < 10 ? new Date(Date.now() - i * 1800000).toISOString() : null,
      commission: -2.5,
      swap: -0.5,
      state: i < 10 ? 'closed' : 'opened'
    });
  }
  
  return trades;
}

function generateMockEquityChart(startBalance: number) {
  const points = [];
  let currentBalance = startBalance;
  let currentEquity = startBalance;
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Simulate gradual growth with some volatility
    const dailyChange = (Math.random() - 0.3) * 0.005 * currentBalance;
    currentBalance += dailyChange;
    currentEquity = currentBalance + (Math.random() - 0.5) * 100;
    
    points.push({
      date: date.toISOString(),
      balance: currentBalance,
      equity: currentEquity
    });
  }
  
  return points;
}

function generateMockRiskEvents() {
  return [
    {
      id: 'event1',
      type: 'warning',
      accountId: 'mock-account',
      sequenceNumber: 1,
      brokerTime: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      absoluteDrawdown: 250,
      relativeDrawdown: 2.5,
      exceededThresholdType: 'drawdown'
    }
  ];
}

function generateMockPeriodStats() {
  const stats = [];
  for (let i = 7; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    stats.push({
      period: 'day',
      startBrokerTime: new Date(date.getTime()).toISOString(),
      endBrokerTime: new Date(date.getTime() + 86400000).toISOString(),
      balance: 10000 + (Math.random() - 0.5) * 500,
      equity: 10000 + (Math.random() - 0.5) * 500,
      maxDrawdown: Math.random() * 3,
      maxDailyDrawdown: Math.random() * 2,
      profit: (Math.random() - 0.5) * 100,
      trades: Math.floor(Math.random() * 5),
      tradingDays: i < 5 ? 1 : 0
    });
  }
  return stats;
}

function generateMockTrackers(accountType: string, accountSize: number, step: number = 1) {
  const isFunded = step === 3;
  const trackers: any[] = [];
  
  if (accountType === '1-step') {
    // 1-STEP: 6% static max DD, 4% daily loss (8% and 5% for funded)
    const maxDD = isFunded ? 8 : 6;
    const dailyDD = isFunded ? 5 : 4;
    
    trackers.push({
      id: 'tracker_max_dd',
      name: isFunded ? '1-Step Funded Max Drawdown Monitor' : '1-Step Max Drawdown Monitor',
      period: 'day',
      relativeDrawdownThreshold: maxDD / 100,
      absoluteDrawdownThreshold: (accountSize * maxDD) / 100
    });
    
    trackers.push({
      id: 'tracker_daily_dd',
      name: isFunded ? '1-Step Funded Daily Loss Monitor' : '1-Step Daily Loss Monitor',
      period: 'day',
      relativeDrawdownThreshold: dailyDD / 100,
      absoluteDrawdownThreshold: (accountSize * dailyDD) / 100
    });
  } else if (accountType === 'elite') {
    // ELITE: NO max DD, 10% trailing daily loss
    const dailyDD = 10;
    
    // Only daily loss tracker for elite (no max DD)
    trackers.push({
      id: 'tracker_daily_dd',
      name: isFunded ? 'Elite Funded Daily Loss Monitor (Trailing)' : 'Elite Daily Loss Monitor (Trailing)',
      period: 'day',
      relativeDrawdownThreshold: dailyDD / 100,
      absoluteDrawdownThreshold: (accountSize * dailyDD) / 100
    });
    
    // Profit tracker for elite
    if (!isFunded) {
      trackers.push({
        id: 'tracker_profit',
        name: 'Elite Profit Monitor',
        period: 'day',
        relativeProfitThreshold: 0.10,
        absoluteProfitThreshold: (accountSize * 10) / 100
      });
    }
  }
  
  return trackers;
}

function calculateMockObjectives(accountType: string, accountSize: number, currentBalance: number, step: number = 1, equityData?: any[], cachedMaxDailyDrawdown?: number) {
  const profitPercent = ((currentBalance - accountSize) / accountSize) * 100;
  const isFunded = step === 3;
  
  // Static drawdown calculation (from initial balance)
  let staticDrawdown = 0;
  if (currentBalance < accountSize) {
    staticDrawdown = ((accountSize - currentBalance) / accountSize) * 100;
  }
  
  const dailyDrawdown = cachedMaxDailyDrawdown || 2.3; // Mock value
  const tradingDays = 12; // Mock value
  
  if (accountType === '1-step') {
    // 1-STEP: 8% profit, 4% daily, 6% static max DD
    if (isFunded) {
      return {
        minTradingDays: { target: 5, current: tradingDays, passed: tradingDays >= 5 },
        maxDrawdown: { target: 8, current: staticDrawdown, passed: staticDrawdown <= 8, isStatic: true },
        maxDailyDrawdown: { target: 5, current: dailyDrawdown, passed: dailyDrawdown <= 5 },
        profitTarget: { target: 0, current: profitPercent, passed: true },
        fundedStatus: true,
        tradingDaysWithGain: tradingDays,
        fundedPayoutEligible: tradingDays >= 5
      };
    }
    
    return {
      minTradingDays: { target: 0, current: tradingDays, passed: true },
      maxDrawdown: { target: 6, current: staticDrawdown, passed: staticDrawdown <= 6, isStatic: true },
      maxDailyDrawdown: { target: 4, current: dailyDrawdown, passed: dailyDrawdown <= 4 },
      profitTarget: { target: 8, current: profitPercent, passed: profitPercent >= 8 }
    };
  } else if (accountType === 'elite') {
    // ELITE: 10% profit, 10% trailing daily, NO max DD
    if (isFunded) {
      return {
        minTradingDays: { target: 5, current: tradingDays, passed: tradingDays >= 5 },
        maxDrawdown: { target: null, current: staticDrawdown, passed: true, noLimit: true, isStatic: false },
        maxDailyDrawdown: { target: 10, current: dailyDrawdown, passed: dailyDrawdown <= 10, isTrailing: true },
        profitTarget: { target: 0, current: profitPercent, passed: true },
        fundedStatus: true,
        tradingDaysWithGain: tradingDays,
        fundedPayoutEligible: tradingDays >= 5
      };
    }
    
    return {
      minTradingDays: { target: 0, current: tradingDays, passed: true },
      maxDrawdown: { target: null, current: staticDrawdown, passed: true, noLimit: true, isStatic: false },
      maxDailyDrawdown: { target: 10, current: dailyDrawdown, passed: dailyDrawdown <= 10, isTrailing: true },
      profitTarget: { target: 10, current: profitPercent, passed: profitPercent >= 10 }
    };
  }
  
  // Fallback (should not reach here with proper types)
  return {
    minTradingDays: { target: 0, current: tradingDays, passed: true },
    maxDrawdown: { target: 6, current: staticDrawdown, passed: staticDrawdown <= 6, isStatic: true },
    maxDailyDrawdown: { target: 4, current: dailyDrawdown, passed: dailyDrawdown <= 4 },
    profitTarget: { target: 8, current: profitPercent, passed: profitPercent >= 8 }
  };
}

function mapTradeType(type: string): 'buy' | 'sell' | 'unknown' {
  if (!type) return 'unknown';
  
  const typeUpper = type.toUpperCase();
  
  // Handle various trade type formats from MetaStats
  if (typeUpper.includes('BUY') || 
      typeUpper.includes('DEAL_TYPE_BUY') || 
      typeUpper === 'DEAL_BUY' ||
      typeUpper === 'BUY_MARKET' ||
      typeUpper === 'BUY_LIMIT' ||
      typeUpper === 'BUY_STOP') {
    return 'buy';
  }
  
  if (typeUpper.includes('SELL') || 
      typeUpper.includes('DEAL_TYPE_SELL') || 
      typeUpper === 'DEAL_SELL' ||
      typeUpper === 'SELL_MARKET' ||
      typeUpper === 'SELL_LIMIT' ||
      typeUpper === 'SELL_STOP') {
    return 'sell';
  }
  
  return 'unknown';
}

