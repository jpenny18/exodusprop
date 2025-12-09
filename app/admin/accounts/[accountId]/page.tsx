'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUser } from '@/lib/auth-helpers';
import { collection, query, where, getDocs, limit, doc, getDoc, setDoc } from 'firebase/firestore';
import DashboardLayout from '@/components/DashboardLayout';
import dynamic from 'next/dynamic';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart2, 
  Target,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Server,
  Activity,
  RefreshCw,
  User,
  ArrowLeft,
  Eye
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Dynamically import ApexCharts to avoid SSR issues
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

// Admin navigation items
const adminNavItems = [
  { name: "Admin Dashboard", href: "/admin", icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" /></svg>) },
  { name: "Crypto Orders", href: "/admin/crypto-orders", icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" /><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" /></svg>) },
  { name: "Card Orders", href: "/admin/card-orders", icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" /></svg>) },
  { name: "Accounts", href: "/admin/accounts", icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" /></svg>) },
  { name: "Emails", href: "/admin/emails", icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>) },
  { name: "KYC Reviews", href: "/admin/kyc", icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>) },
  { name: "Payouts", href: "/admin/payouts", icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>) },
  { name: "Users", href: "/admin/users", icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg>) },
  { name: "Settings", href: "/admin/settings", icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>) },
];

// Define interfaces
interface TradingObjectives {
  minTradingDays: { target: number; current: number; passed: boolean };
  maxDrawdown: { target: number; current: number; passed: boolean; recentBreach?: boolean; isStatic?: boolean };
  maxDailyDrawdown: { target: number; current: number; passed: boolean; recentBreach?: boolean };
  profitTarget: { target: number; current: number; passed: boolean };
}

interface TradeData {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  volume: number;
  openPrice: number;
  closePrice: number;
  profit: number;
  openTime: string;
  closeTime?: string;
  commission: number;
  swap: number;
  state: 'opened' | 'closed';
}

interface EquityChartPoint {
  date: string;
  equity: number;
  balance: number;
}

interface RiskEvent {
  id: string;
  type: string;
  accountId: string;
  sequenceNumber: number;
  brokerTime: string;
  absoluteDrawdown: number;
  relativeDrawdown: number;
  exceededThresholdType: string;
}

interface PeriodStatistic {
  period: string;
  startBrokerTime: string;
  endBrokerTime: string;
  balance: number;
  equity: number;
  maxDrawdown: number;
  maxDailyDrawdown: number;
  profit: number;
  trades: number;
  tradingDays: number;
}

// Metric Card Component with Exodus styling
const MetricCard = ({ title, value, icon: Icon, format = 'number', prefix = '', suffix = '' }: {
  title: string;
  value: number | string;
  icon?: React.ElementType;
  format?: 'number' | 'currency' | 'percent' | 'string';
  prefix?: string;
  suffix?: string;
}) => {
  const formatValue = () => {
    if (format === 'string') return value;
    const numValue = typeof value === 'number' ? value : parseFloat(value as string);
    
    if (format === 'currency') return `$${numValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (format === 'percent') return `${numValue.toFixed(2)}%`;
    return `${prefix}${numValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${suffix}`;
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-exodus-light-blue/30 p-4 hover:border-exodus-light-blue/50 transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-xs mb-1">{title}</p>
          <p className="text-white text-lg font-semibold">{formatValue()}</p>
        </div>
        {Icon && (
          <div className="p-2 rounded-lg bg-exodus-light-blue/10 text-exodus-light-blue">
            <Icon size={16} />
          </div>
        )}
      </div>
    </div>
  );
};

// Trading Objectives Table Component
const TradingObjectivesTable = ({ objectives, accountInfo }: { objectives: TradingObjectives; accountInfo?: any }) => {
  const isFunded = accountInfo?.step === 3 || accountInfo?.status === 'funded';
  
  const rows = [
    { 
      label: isFunded ? 'Min Trading Days (0.5% gain required)' : 'Min Trading Days', 
      target: objectives.minTradingDays.target,
      current: objectives.minTradingDays.current,
      passed: objectives.minTradingDays.passed,
      format: 'days'
    },
    { 
      label: objectives.maxDrawdown.isStatic ? 'Max Drawdown % (Static)' : 'Max Drawdown %', 
      target: objectives.maxDrawdown.target,
      current: objectives.maxDrawdown.current,
      passed: objectives.maxDrawdown.passed,
      format: 'percent'
    },
    { 
      label: 'Max Daily Drawdown %', 
      target: objectives.maxDailyDrawdown.target,
      current: objectives.maxDailyDrawdown.current,
      passed: objectives.maxDailyDrawdown.passed,
      format: 'percent'
    },
    { 
      label: 'Profit Target %', 
      target: objectives.profitTarget.target,
      current: objectives.profitTarget.current,
      passed: objectives.profitTarget.passed,
      format: 'percent'
    }
  ];

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-exodus-light-blue/30 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Trading Objectives</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-exodus-light-blue/20">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Objective</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Target</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Current</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-b border-exodus-light-blue/10">
                <td className="py-3 px-4 text-sm text-white">{row.label}</td>
                <td className="py-3 px-4 text-sm text-center text-gray-300">
                  {row.format === 'percent' ? `${row.target}%` : row.target}
                </td>
                <td className="py-3 px-4 text-sm text-center">
                  <span className={row.passed ? 'text-green-400' : 'text-yellow-400'}>
                    {row.format === 'percent' ? `${row.current.toFixed(2)}%` : row.current}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-center">
                  {row.passed ? (
                    <CheckCircle className="inline-block text-green-400" size={18} />
                  ) : (
                    <XCircle className="inline-block text-red-400" size={18} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Risk Events Table Component
const RiskEventsTable = ({ riskEvents }: { riskEvents: RiskEvent[] }) => {
  if (!riskEvents || riskEvents.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-exodus-light-blue/30 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Risk Events</h3>
        <p className="text-gray-400 text-sm">No risk events recorded</p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-exodus-light-blue/30 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Risk Events</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-exodus-light-blue/20">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Time</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Type</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Drawdown %</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Amount</th>
            </tr>
          </thead>
          <tbody>
            {riskEvents.map((event, index) => (
              <tr key={event.id || index} className="border-b border-exodus-light-blue/10">
                <td className="py-3 px-4 text-sm text-white">
                  {new Date(event.brokerTime).toLocaleString()}
                </td>
                <td className="py-3 px-4 text-sm">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    event.exceededThresholdType === 'drawdown' 
                      ? 'bg-red-500/20 text-red-400'
                      : event.exceededThresholdType === 'dailyDrawdown'
                      ? 'bg-orange-500/20 text-orange-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {event.exceededThresholdType}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-right text-red-400 font-medium">
                  {event.relativeDrawdown.toFixed(2)}%
                </td>
                <td className="py-3 px-4 text-sm text-right text-red-400">
                  ${event.absoluteDrawdown.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Period Statistics Component
const PeriodStatsChart = ({ periodStats }: { periodStats: PeriodStatistic[] }) => {
  if (!periodStats || periodStats.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-exodus-light-blue/30 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Period Statistics</h3>
        <p className="text-gray-400 text-sm">No period statistics available</p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-exodus-light-blue/30 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Daily Performance (Last 30 Days)</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-exodus-light-blue/20">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Date</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Balance</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Equity</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Profit</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Max DD</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Daily DD</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Trades</th>
            </tr>
          </thead>
          <tbody>
            {periodStats.slice(-7).map((stat, index) => (
              <tr key={index} className="border-b border-exodus-light-blue/10">
                <td className="py-3 px-4 text-sm text-white">
                  {new Date(stat.startBrokerTime).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-sm text-right text-white">
                  ${stat.balance.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-sm text-right text-white">
                  ${stat.equity.toLocaleString()}
                </td>
                <td className={`py-3 px-4 text-sm text-right font-medium ${
                  stat.profit >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.profit >= 0 ? '+' : ''}${stat.profit.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-sm text-right text-yellow-400">
                  {stat.maxDrawdown.toFixed(2)}%
                </td>
                <td className="py-3 px-4 text-sm text-right text-orange-400">
                  {stat.maxDailyDrawdown.toFixed(2)}%
                </td>
                <td className="py-3 px-4 text-sm text-center text-gray-300">
                  {stat.trades}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Trading Journal Component with Pagination
const TradingJournal = ({ trades }: { trades: TradeData[] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const tradesPerPage = 20;
  
  const totalPages = Math.ceil(trades.length / tradesPerPage);
  const startIndex = (currentPage - 1) * tradesPerPage;
  const endIndex = startIndex + tradesPerPage;
  const currentTrades = trades.slice(startIndex, endIndex);
  
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };
  
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-exodus-light-blue/30 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Trading Journal</h3>
        <span className="text-sm text-gray-400">
          {trades.length} {trades.length === 1 ? 'Trade' : 'Trades'} Total
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-exodus-light-blue/20">
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Symbol</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Type</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Volume</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Open Price</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Close Price</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Profit</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Open Time</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-exodus-light-blue/10">
            {trades.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-gray-400">No trades found</td>
              </tr>
            ) : (
              currentTrades.map((trade) => (
                <tr key={trade.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-sm text-white">{trade.symbol}</td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      trade.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {trade.type?.toUpperCase() || 'N/A'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-300">{trade.volume != null ? trade.volume.toFixed(2) : '-'}</td>
                  <td className="py-3 px-4 text-sm text-gray-300">{trade.openPrice != null ? trade.openPrice.toFixed(5) : '-'}</td>
                  <td className="py-3 px-4 text-sm text-gray-300">
                    {trade.closePrice != null ? trade.closePrice.toFixed(5) : '-'}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span className={trade.profit != null && trade.profit >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {trade.profit != null ? `$${trade.profit.toFixed(2)}` : '-'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-300">
                    {trade.openTime ? formatDistanceToNow(new Date(trade.openTime), { addSuffix: true }) : '-'}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      trade.state === 'opened' 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {trade.state || 'unknown'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-exodus-light-blue/20">
          <div className="text-sm text-gray-400">
            Showing {startIndex + 1} to {Math.min(endIndex, trades.length)} of {trades.length} trades
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm font-medium text-gray-400 bg-white/5 border border-exodus-light-blue/20 rounded-lg hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex items-center gap-1 mx-2">
              {getPageNumbers().map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="px-2 text-gray-500">...</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page as number)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-exodus-light-blue text-black'
                        : 'text-gray-400 bg-white/5 border border-exodus-light-blue/20 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {page}
                  </button>
                )
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm font-medium text-gray-400 bg-white/5 border border-exodus-light-blue/20 rounded-lg hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function AdminAccountDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const accountId = params.accountId as string;
  
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);
  const [objectives, setObjectives] = useState<TradingObjectives | null>(null);
  const [accountInfo, setAccountInfo] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [accountStatus, setAccountStatus] = useState<string>('active');
  const [riskEvents, setRiskEvents] = useState<RiskEvent[]>([]);
  const [periodStats, setPeriodStats] = useState<PeriodStatistic[]>([]);
  const [trades, setTrades] = useState<TradeData[]>([]);
  const [chartData, setChartData] = useState<EquityChartPoint[]>([]);

  // Chart configuration with Exodus colors
  const chartOptions = {
    chart: {
      type: 'area' as const,
      height: 350,
      background: 'transparent',
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' as const, width: 2 },
    colors: ['#00c4f4', '#3B82F6'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.2,
        opacityTo: 0,
        stops: [0, 100]
      }
    },
    xaxis: {
      type: 'datetime' as const,
      labels: { style: { colors: '#9CA3AF' } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        style: { colors: '#9CA3AF' },
        formatter: (value: number) => `$${value.toLocaleString()}`
      }
    },
    grid: {
      borderColor: '#374151',
      strokeDashArray: 5,
      xaxis: { lines: { show: false } }
    },
    legend: {
      show: true,
      position: 'top' as const,
      horizontalAlign: 'right' as const,
      labels: { colors: '#9CA3AF' }
    },
    tooltip: {
      theme: 'dark',
      x: { format: 'dd MMM yyyy' },
      y: { formatter: (value: number) => `$${value.toLocaleString()}` }
    }
  };

  const chartSeries = [
    {
      name: 'Equity',
      data: chartData.map(point => ({
        x: new Date(point.date).getTime(),
        y: point.equity
      }))
    },
    {
      name: 'Balance',
      data: chartData.map(point => ({
        x: new Date(point.date).getTime(),
        y: point.balance
      }))
    }
  ];

  // Check admin authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUserEmail(user.email || '');
        const userData = await getUser(user.uid);
        if (!userData?.isAdmin) {
          router.push('/dashboard');
          return;
        }
        setAuthChecked(true);
      } else {
        router.push('/auth');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchAccountData = async () => {
    try {
      setError(null);
      
      // Get the account info from userMetaApiAccounts
      const accountsRef = collection(db, 'userMetaApiAccounts');
      const accountQuery = query(accountsRef, where('accountId', '==', accountId), limit(1));
      const accountSnapshot = await getDocs(accountQuery);
      
      if (accountSnapshot.empty) {
        throw new Error('Account not found');
      }
      
      const accountData = accountSnapshot.docs[0].data();
      setAccountStatus(accountData.status);
      
      // Get user info
      const usersRef = collection(db, 'users');
      const userQuery = query(usersRef, where('uid', '==', accountData.userId), limit(1));
      const userSnapshot = await getDocs(userQuery);
      
      if (!userSnapshot.empty) {
        setUserInfo(userSnapshot.docs[0].data());
      }
      
      // Try to get cached metrics first
      const cachedMetricsRef = doc(db, 'cachedMetrics', accountId);
      const cachedMetricsDoc = await getDoc(cachedMetricsRef);
      
      if (cachedMetricsDoc.exists()) {
        const cachedData = cachedMetricsDoc.data();
        
        // Convert cached data to the expected format
        setMetrics({
          balance: cachedData.balance,
          equity: cachedData.equity,
          averageWin: cachedData.averageProfit,
          averageLoss: cachedData.averageLoss,
          trades: cachedData.numberOfTrades,
          lots: cachedData.lots,
          expectancy: cachedData.expectancy,
          profitFactor: cachedData.profitFactor,
          maxDrawdown: cachedData.maxDrawdown,
          relativeDrawdown: cachedData.dailyDrawdown,
          wonTrades: Math.round(cachedData.numberOfTrades * (cachedData.winRate / 100)),
          lostTrades: Math.round(cachedData.numberOfTrades * (1 - cachedData.winRate / 100)),
          winRate: cachedData.winRate,
          avgRRR: cachedData.averageRRR,
          profit: cachedData.currentProfit || ((cachedData.balance - accountData.accountSize) || 0),
          riskEvents: cachedData.lastRiskEvents || [],
          periodStats: cachedData.lastPeriodStats || [],
          lastTrades: cachedData.lastTrades || [],
          lastEquityChart: cachedData.lastEquityChart || []
        });
        
        // Set risk events and period stats
        setRiskEvents(cachedData.lastRiskEvents || []);
        setPeriodStats(cachedData.lastPeriodStats || []);
        setTrades(cachedData.lastTrades || []);
        setChartData(cachedData.lastEquityChart || []);
        
        // Use cached objectives if available
        if (cachedData.lastObjectives) {
          setObjectives(cachedData.lastObjectives);
        } else {
          // Calculate objectives based on Exodus rules
          const profitPercent = ((cachedData.balance - accountData.accountSize) / accountData.accountSize) * 100;
          
          // Static drawdown calculation
          let staticDrawdown = 0;
          if (cachedData.balance < accountData.accountSize) {
            staticDrawdown = ((accountData.accountSize - cachedData.balance) / accountData.accountSize) * 100;
          }
          
          setObjectives({
            minTradingDays: {
              target: 0, // Exodus: No minimum
              current: cachedData.tradingDays || 0,
              passed: true
            },
            maxDrawdown: {
              target: 6, // Exodus: 6% static
              current: staticDrawdown,
              passed: staticDrawdown <= 6,
              isStatic: true,
              recentBreach: false
            },
            maxDailyDrawdown: {
              target: 4, // Exodus: 4% daily
              current: cachedData.maxDailyDrawdown || cachedData.dailyDrawdown || 0,
              passed: (cachedData.maxDailyDrawdown || cachedData.dailyDrawdown || 0) <= 4,
              recentBreach: false
            },
            profitTarget: {
              target: 8, // Exodus: 8%
              current: profitPercent,
              passed: profitPercent >= 8
            }
          });
        }
        
        setLastUpdate(
          cachedData.lastUpdated 
            ? (typeof cachedData.lastUpdated === 'object' && 'toDate' in cachedData.lastUpdated 
                ? cachedData.lastUpdated.toDate() 
                : new Date(cachedData.lastUpdated))
            : new Date()
        );
        
        // Set basic account info
        setAccountInfo({
          accountId: accountData.accountId,
          accountType: accountData.accountType,
          accountSize: accountData.accountSize,
          platform: accountData.platform,
          status: accountData.status,
          step: accountData.step
        });
      } else {
        throw new Error('No metrics data available. The user may need to load their dashboard first to generate metrics.');
      }
      
    } catch (err: any) {
      console.error('Error fetching account data:', err);
      setError(err.message || 'Failed to fetch account data');
    } finally {
      setLoading(false);
    }
  };

  const refreshMetrics = async () => {
    setRefreshing(true);
    try {
      // Get the account info
      const accountsRef = collection(db, 'userMetaApiAccounts');
      const accountQuery = query(accountsRef, where('accountId', '==', accountId), limit(1));
      const accountSnapshot = await getDocs(accountQuery);
      
      if (accountSnapshot.empty) {
        throw new Error('Account not found');
      }
      
      const accountData = accountSnapshot.docs[0].data();
      
      // If we don't have account info yet, set it now
      if (!accountInfo) {
        setAccountInfo({
          accountId: accountData.accountId,
          accountType: accountData.accountType,
          accountSize: accountData.accountSize,
          platform: accountData.platform,
          status: accountData.status,
          step: accountData.step
        });
        setAccountStatus(accountData.status);
        
        // Also try to get user info if we don't have it
        if (!userInfo) {
          const usersRef = collection(db, 'users');
          const userQuery = query(usersRef, where('uid', '==', accountData.userId), limit(1));
          const userSnapshot = await getDocs(userQuery);
          
          if (!userSnapshot.empty) {
            setUserInfo(userSnapshot.docs[0].data());
          }
        }
      }
      
      // Call the API to fetch fresh data
      const response = await fetch('/api/metaapi/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountId: accountData.accountId,
          accountToken: accountData.accountToken || 'main-token',
          accountType: accountData.accountType || '1-step',
          accountSize: accountData.accountSize,
          isAdmin: true,
          step: accountData.step
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to refresh metrics');
      }

      const data = await response.json();
      
      // Update the UI
      setMetrics(data.metrics);
      setObjectives(data.objectives);
      setTrades(data.trades || []);
      setChartData(data.equityChart || []);
      setRiskEvents(data.riskEvents || []);
      setPeriodStats(data.periodStats || []);
      setLastUpdate(new Date());
      setError(null);
    } catch (err: any) {
      console.error('Error refreshing metrics:', err);
      setError('Failed to refresh metrics: ' + err.message);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (authChecked) {
      fetchAccountData();
    }
  }, [accountId, authChecked]);

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-exodus-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-exodus-light-blue animate-spin" />
      </div>
    );
  }

  if (loading) {
    return (
      <DashboardLayout navItems={adminNavItems} userEmail={currentUserEmail} isAdmin={true}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-exodus-light-blue animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout navItems={adminNavItems} userEmail={currentUserEmail} isAdmin={true}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-red-500/30 p-8 max-w-md">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white text-center mb-2">Error Loading Account</h2>
            <p className="text-gray-400 text-center mb-6">{error}</p>
            
            <div className="space-y-3">
              {error.toLowerCase().includes('no metrics') && (
                <button
                  onClick={async () => {
                    setError(null);
                    await refreshMetrics();
                    await fetchAccountData();
                  }}
                  disabled={refreshing}
                  className="w-full bg-exodus-light-blue text-black font-semibold py-2 px-4 rounded-lg hover:bg-exodus-light-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {refreshing ? (
                    <>
                      <RefreshCw size={20} className="animate-spin" />
                      Fetching Metrics...
                    </>
                  ) : (
                    <>
                      <RefreshCw size={20} />
                      Fetch Metrics from MetaAPI
                    </>
                  )}
                </button>
              )}
              
              <button
                onClick={() => router.push('/admin/accounts')}
                className="w-full bg-white/10 text-white font-semibold py-2 px-4 rounded-lg hover:bg-white/20 transition-colors"
              >
                Back to Accounts
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const winRate = metrics?.winRate || 0;
  const avgRRR = metrics?.avgRRR || 0;

  return (
    <DashboardLayout navItems={adminNavItems} userEmail={currentUserEmail} isAdmin={true}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/admin/accounts')}
              className="p-2 rounded-lg bg-white/10 border border-exodus-light-blue/30 hover:border-exodus-light-blue/50 transition-all"
            >
              <ArrowLeft size={20} className="text-white" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Admin: Account Metrics</h1>
              <div className="flex items-center gap-2 mt-1">
                <User size={16} className="text-gray-400" />
                <p className="text-sm text-gray-400">
                  {userInfo?.email || 'Unknown User'} • {accountId.slice(0, 8)}...
                </p>
              </div>
              {lastUpdate && (
                <p className="text-xs text-gray-500 mt-1">
                  Last updated {formatDistanceToNow(lastUpdate, { addSuffix: true })}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.open(`/dashboard/accounts/${accountId}`, '_blank')}
              className="bg-white/10 text-white font-semibold py-2 px-4 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2"
            >
              <Eye size={16} />
              View as User
            </button>
            <button
              onClick={refreshMetrics}
              disabled={refreshing}
              className="bg-exodus-light-blue text-black font-semibold py-2 px-4 rounded-lg hover:bg-exodus-light-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              Refresh Data
            </button>
          </div>
        </div>

        {/* Account Status Notice */}
        {accountStatus === 'failed' && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-400 mt-0.5" size={20} />
              <div>
                <h3 className="text-red-400 font-semibold mb-1">Challenge Failed</h3>
                <p className="text-gray-300 text-sm">
                  This challenge has been marked as failed. The data shown represents the final state of the account.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Funded Account Notice */}
        {(accountStatus === 'funded' || accountInfo?.step === 3) && (
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-8">
            <div className="flex items-start gap-3">
              <CheckCircle className="text-purple-400 mt-0.5" size={20} />
              <div>
                <h3 className="text-purple-400 font-semibold mb-1">Funded Account</h3>
                <p className="text-gray-300 text-sm">
                  This is a funded account with special rules for payout eligibility.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Account Info Card */}
        {accountInfo && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-exodus-light-blue/30 p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Server size={20} />
              Account Information
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-400 text-xs mb-1">Account Type</p>
                <p className="text-white font-medium">Exodus 1-Step</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Account Size</p>
                <p className="text-white font-medium">${accountInfo.accountSize?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Platform</p>
                <p className="text-white font-medium">{accountInfo.platform?.toUpperCase()}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Status</p>
                <p className="text-white font-medium capitalize">
                  {accountInfo.step === 3 ? 'Funded' : accountInfo.status}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Challenge Rules Card */}
        <div className="bg-exodus-light-blue/5 border border-exodus-light-blue/20 rounded-xl p-6 mb-8">
          <h3 className="text-exodus-light-blue font-medium mb-3">📊 Exodus 1-Step Challenge Rules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-400 mb-1">Profit Target</p>
              <p className="text-white font-medium">8%</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Max Drawdown (Static)</p>
              <p className="text-white font-medium">6% from initial balance</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Daily Loss Limit</p>
              <p className="text-white font-medium">4%</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Min Trading Days</p>
              <p className="text-white font-medium">0 (No Requirement)</p>
            </div>
          </div>
        </div>

        {/* Main Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          <MetricCard title="Balance" value={metrics?.balance || 0} icon={DollarSign} format="currency" />
          <MetricCard title="Equity" value={metrics?.equity || 0} icon={TrendingUp} format="currency" />
          <MetricCard title="Profit/Loss" value={metrics?.profit || 0} icon={metrics?.profit >= 0 ? TrendingUp : TrendingDown} format="currency" />
          <MetricCard title="Total Trades" value={metrics?.trades || 0} icon={Activity} />
          <MetricCard title="Average RRR" value={avgRRR} icon={Target} suffix=":1" />
          <MetricCard title="Total Lots" value={metrics?.lots || 0} icon={BarChart2} />
          <MetricCard title="Expectancy" value={metrics?.expectancy || 0} icon={Target} format="currency" />
          <MetricCard title="Win Rate" value={winRate} icon={Activity} format="percent" />
          <MetricCard title="Profit Factor" value={metrics?.profitFactor || 0} icon={TrendingUp} />
          <MetricCard title="Max Drawdown" value={objectives?.maxDrawdown?.current || 0} icon={TrendingDown} format="percent" />
        </div>

        {/* Trading Objectives */}
        {objectives && <TradingObjectivesTable objectives={objectives} accountInfo={accountInfo} />}

        {/* Equity Growth Chart */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-exodus-light-blue/30 p-6 mb-8 mt-8">
          <h3 className="text-lg font-semibold text-white mb-4">Equity Growth</h3>
          {chartData.length > 0 ? (
            <ApexChart
              options={chartOptions}
              series={chartSeries}
              type="area"
              height={350}
            />
          ) : (
            <div className="h-[350px] flex items-center justify-center border border-dashed border-exodus-light-blue/20 rounded-lg">
              <p className="text-gray-500">No chart data available</p>
            </div>
          )}
        </div>

        {/* Risk Events */}
        {riskEvents.length > 0 && <RiskEventsTable riskEvents={riskEvents} />}

        {/* Period Statistics */}
        {periodStats.length > 0 && <div className="mt-8"><PeriodStatsChart periodStats={periodStats} /></div>}

        {/* Trading Journal */}
        <div className="mt-8">
          <TradingJournal trades={trades} />
        </div>
      </div>
    </DashboardLayout>
  );
}

