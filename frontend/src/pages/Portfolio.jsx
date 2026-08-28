import React, { useEffect, useState } from 'react';
import { portfolioApi } from '../services/portfolioApi';
import { Link } from 'react-router-dom';
import CountUp from '../components/CountUp';
import { SkeletonCard, SkeletonTable } from '../components/Skeleton';

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    portfolioApi.getPortfolio()
      .then(data => {
        setPortfolio(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto animate-in fade-in duration-300">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">My Portfolio</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <SkeletonTable columns={7} rows={5} />
      </div>
    );
  }
  
  if (!portfolio) return <div className="p-8 text-center text-danger">Failed to load portfolio.</div>;

  const { summary, holdings } = portfolio;

  return (
    <div className="p-8 max-w-6xl mx-auto animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Portfolio</h1>
        <Link to="/dashboard" className="px-4 py-2 bg-bg-surface border border-border-subtle rounded-lg hover:bg-bg-surface-raised transition-colors">
          Back to Dashboard
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="p-6 bg-bg-surface rounded-xl border border-border-subtle hover:bg-bg-surface-raised transition-colors">
          <p className="text-sm text-text-secondary mb-1">Net Worth</p>
          <p className="text-2xl font-bold tabular-nums">
            <CountUp value={summary.netWorth} prefix="₹" />
          </p>
        </div>
        <div className="p-6 bg-bg-surface rounded-xl border border-border-subtle hover:bg-bg-surface-raised transition-colors">
          <p className="text-sm text-text-secondary mb-1">Total Invested</p>
          <p className="text-2xl font-bold tabular-nums">
            <CountUp value={summary.totalInvested} prefix="₹" />
          </p>
        </div>
        <div className="p-6 bg-bg-surface rounded-xl border border-border-subtle hover:bg-bg-surface-raised transition-colors">
          <p className="text-sm text-text-secondary mb-1">Current Value</p>
          <p className="text-2xl font-bold tabular-nums">
            <CountUp value={summary.currentPortfolioValue} prefix="₹" />
          </p>
        </div>
        <div className="p-6 bg-bg-surface rounded-xl border border-border-subtle hover:bg-bg-surface-raised transition-colors">
          <p className="text-sm text-text-secondary mb-1">Overall P&L</p>
          <p className={`text-2xl font-bold tabular-nums ${summary.totalPnl >= 0 ? 'text-success' : 'text-danger'}`}>
            <CountUp 
              value={summary.totalPnl} 
              prefix={summary.totalPnl >= 0 ? '+₹' : '-₹'} 
              valueOverride={Math.abs(summary.totalPnl)}
            />
          </p>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="bg-bg-surface rounded-xl border border-border-subtle overflow-hidden">
        <h2 className="p-6 border-b border-border-subtle text-lg font-semibold">Current Holdings</h2>
        
        {holdings.length === 0 ? (
          <div className="p-8 text-center text-text-secondary">You don't own any stocks yet. <Link to="/markets" className="text-brand-primary hover:underline">Explore Markets</Link></div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-subtle bg-bg-surface-raised">
                <th className="p-4 text-sm font-medium text-text-secondary">Symbol</th>
                <th className="p-4 text-sm font-medium text-text-secondary text-right">Qty</th>
                <th className="p-4 text-sm font-medium text-text-secondary text-right">Avg Price</th>
                <th className="p-4 text-sm font-medium text-text-secondary text-right">LTP</th>
                <th className="p-4 text-sm font-medium text-text-secondary text-right">Invested</th>
                <th className="p-4 text-sm font-medium text-text-secondary text-right">Current Value</th>
                <th className="p-4 text-sm font-medium text-text-secondary text-right">P&L</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h, i) => (
                <tr 
                  key={h.id} 
                  className="border-b border-border-subtle last:border-0 hover:bg-bg-surface-raised transition-colors animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <td className="p-4 font-medium text-brand-primary">
                    <Link to={`/markets/${h.symbol}`} className="hover:underline">{h.symbol}</Link>
                  </td>
                  <td className="p-4 tabular-nums text-right">{h.quantity}</td>
                  <td className="p-4 tabular-nums text-right">₹{h.averageBuyPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td className="p-4 tabular-nums text-right">
                    <CountUp value={h.currentPrice} prefix="₹" />
                  </td>
                  <td className="p-4 tabular-nums text-right">
                    <CountUp value={h.investedValue} prefix="₹" />
                  </td>
                  <td className="p-4 tabular-nums text-right font-medium">
                    <CountUp value={h.currentValue} prefix="₹" />
                  </td>
                  <td className={`p-4 tabular-nums text-right font-medium ${h.pnl >= 0 ? 'text-success' : 'text-danger'}`}>
                    <CountUp 
                      value={h.pnl} 
                      prefix={h.pnl >= 0 ? '+₹' : '-₹'} 
                      valueOverride={Math.abs(h.pnl)}
                    />
                    <br/>
                    <span className="text-xs">
                      ({h.pnl >= 0 ? '+' : ''}
                      <CountUp value={h.pnlPercent} suffix="%" />)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
