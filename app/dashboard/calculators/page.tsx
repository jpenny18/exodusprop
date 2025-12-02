"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { userDashboardNavItems } from "@/lib/dashboard-nav";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function CalculatorsPage() {
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email || "");
      }
    });
    return () => unsubscribe();
  }, []);
  const [positionSize, setPositionSize] = useState({
    accountSize: 100000,
    riskPercent: 1,
    stopLoss: 50,
    result: 0,
  });

  const [profitLoss, setProfitLoss] = useState({
    entryPrice: 0,
    exitPrice: 0,
    lotSize: 1,
    result: 0,
  });

  const calculatePositionSize = () => {
    const riskAmount = (positionSize.accountSize * positionSize.riskPercent) / 100;
    const lotSize = riskAmount / positionSize.stopLoss;
    setPositionSize(prev => ({ ...prev, result: lotSize }));
  };

  const calculateProfitLoss = () => {
    const pipValue = 10; // Standard for forex
    const pips = Math.abs(profitLoss.exitPrice - profitLoss.entryPrice) * 10000;
    const pl = pips * pipValue * profitLoss.lotSize;
    const finalPL = profitLoss.exitPrice > profitLoss.entryPrice ? pl : -pl;
    setProfitLoss(prev => ({ ...prev, result: finalPL }));
  };

  return (
    <DashboardLayout navItems={userDashboardNavItems} userEmail={userEmail}>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Trading Calculators</h1>
          <p className="text-gray-300">Essential tools to help manage your risk and trades</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Position Size Calculator */}
          <div className="bg-white/10 backdrop-blur-lg border-2 border-exodus-light-blue rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-exodus-light-blue" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              Position Size Calculator
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Account Size ($)</label>
                <input
                  type="number"
                  value={positionSize.accountSize}
                  onChange={(e) => setPositionSize(prev => ({ ...prev, accountSize: Number(e.target.value) }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-exodus-light-blue transition"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-semibold mb-2">Risk Per Trade (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={positionSize.riskPercent}
                  onChange={(e) => setPositionSize(prev => ({ ...prev, riskPercent: Number(e.target.value) }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-exodus-light-blue transition"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-semibold mb-2">Stop Loss (Pips)</label>
                <input
                  type="number"
                  value={positionSize.stopLoss}
                  onChange={(e) => setPositionSize(prev => ({ ...prev, stopLoss: Number(e.target.value) }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-exodus-light-blue transition"
                />
              </div>

              <button
                onClick={calculatePositionSize}
                className="w-full bg-exodus-light-blue hover:bg-blue-400 text-white py-3 rounded-lg font-bold transition"
              >
                Calculate
              </button>

              {positionSize.result > 0 && (
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                  <p className="text-gray-300 text-sm mb-1">Recommended Lot Size</p>
                  <p className="text-white text-3xl font-bold">{positionSize.result.toFixed(2)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Profit/Loss Calculator */}
          <div className="bg-white/10 backdrop-blur-lg border-2 border-exodus-light-blue rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-exodus-light-blue" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              Profit/Loss Calculator
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Entry Price</label>
                <input
                  type="number"
                  step="0.00001"
                  value={profitLoss.entryPrice}
                  onChange={(e) => setProfitLoss(prev => ({ ...prev, entryPrice: Number(e.target.value) }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-exodus-light-blue transition"
                  placeholder="1.12345"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-semibold mb-2">Exit Price</label>
                <input
                  type="number"
                  step="0.00001"
                  value={profitLoss.exitPrice}
                  onChange={(e) => setProfitLoss(prev => ({ ...prev, exitPrice: Number(e.target.value) }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-exodus-light-blue transition"
                  placeholder="1.12545"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-semibold mb-2">Lot Size</label>
                <input
                  type="number"
                  step="0.01"
                  value={profitLoss.lotSize}
                  onChange={(e) => setProfitLoss(prev => ({ ...prev, lotSize: Number(e.target.value) }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-exodus-light-blue transition"
                />
              </div>

              <button
                onClick={calculateProfitLoss}
                className="w-full bg-exodus-light-blue hover:bg-blue-400 text-white py-3 rounded-lg font-bold transition"
              >
                Calculate
              </button>

              {profitLoss.result !== 0 && (
                <div className={`border rounded-lg p-4 ${
                  profitLoss.result > 0 
                    ? 'bg-green-500/20 border-green-500/30' 
                    : 'bg-red-500/20 border-red-500/30'
                }`}>
                  <p className="text-gray-300 text-sm mb-1">
                    {profitLoss.result > 0 ? 'Profit' : 'Loss'}
                  </p>
                  <p className={`text-3xl font-bold ${
                    profitLoss.result > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    ${Math.abs(profitLoss.result).toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Risk Management Info */}
        <div className="bg-white/10 backdrop-blur-lg border-2 border-exodus-light-blue/30 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Risk Management Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-exodus-light-blue font-semibold mb-2">1-2% Risk Rule</h4>
              <p className="text-gray-300 text-sm">Never risk more than 1-2% of your account on a single trade</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-exodus-light-blue font-semibold mb-2">Risk:Reward Ratio</h4>
              <p className="text-gray-300 text-sm">Aim for at least 1:2 ratio (risk $1 to make $2)</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-exodus-light-blue font-semibold mb-2">Position Sizing</h4>
              <p className="text-gray-300 text-sm">Always calculate position size before entering a trade</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

