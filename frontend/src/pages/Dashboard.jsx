import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { portfolioApi } from '../services/portfolioApi';
import { stockApi } from '../services/stockApi';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [movers, setMovers] = useState([]);

  useEffect(() => {
    portfolioApi.getPortfolio()
      .then(setPortfolio)
      .catch(console.error);

    stockApi.getAllStocks()
      .then(data => {
        // Sort by absolute change percentage to find top movers (gainers or losers)
        const sorted = [...data].sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
        setMovers(sorted.slice(0, 4));
      })
      .catch(console.error);
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-4">
          <Link to="/markets" className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-hover flex items-center transition-colors">
            Browse Markets
          </Link>
          <Link to="/portfolio" className="px-4 py-2 text-brand-primary hover:underline flex items-center">
            Portfolio
          </Link>
          <Link to="/transactions" className="px-4 py-2 text-brand-primary hover:underline flex items-center">
            Transactions
          </Link>
          <Link to="/orders" className="px-4 py-2 text-brand-primary hover:underline flex items-center">
            Orders
          </Link>
          <button 
            onClick={logout}
            className="px-4 py-2 bg-bg-surface border border-border-subtle rounded-lg hover:bg-bg-surface-raised transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* User Info */}
        <div className="p-6 bg-bg-surface rounded-xl border border-border-subtle">
          <h2 className="text-lg font-semibold mb-4">Profile Details</h2>
          <ul className="space-y-2 font-mono text-sm">
            <li>Name: <span className="text-text-primary">{user.name}</span></li>
            <li>Email: <span className="text-brand-primary">{user.email}</span></li>
            <li>Role: <span className="text-brand-primary">{user.role}</span></li>
            <li>Joined: <span className="text-brand-primary">{new Date(user.createdAt).toLocaleDateString()}</span></li>
          </ul>
        </div>

        {/* Portfolio Summary */}
        <div className="p-6 bg-bg-surface rounded-xl border border-border-subtle flex flex-col justify-center">
          <h2 className="text-sm font-medium text-text-secondary mb-4">Financial Overview</h2>
          {portfolio ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-text-secondary mb-1">Net Worth</p>
                <div className="text-3xl font-bold text-success tabular-nums">
                  ₹{portfolio.summary.netWorth.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border-subtle">
                <div>
                  <p className="text-xs text-text-secondary mb-1">Available Cash</p>
                  <p className="text-lg font-semibold tabular-nums">₹{portfolio.summary.cashBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary mb-1">Overall P&L</p>
                  <p className={`text-lg font-semibold tabular-nums ${portfolio.summary.totalPnl >= 0 ? 'text-success' : 'text-danger'}`}>
                    {portfolio.summary.totalPnl >= 0 ? '+' : ''}₹{portfolio.summary.totalPnl.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-2xl text-text-secondary">Loading...</div>
          )}
        </div>
      </div>

      {/* Analytics: Top Movers */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Market Top Movers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {movers.length > 0 ? (
            movers.map(stock => (
              <Link key={stock.id} to={`/markets/${stock.symbol}`} className="block p-4 bg-bg-surface rounded-xl border border-border-subtle hover:bg-bg-surface-raised transition-colors group">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold group-hover:text-brand-primary transition-colors">{stock.symbol}</h3>
                  {stock.changePercent >= 0 ? (
                    <TrendingUp className="w-5 h-5 text-success" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-danger" />
                  )}
                </div>
                <div className="text-xl tabular-nums font-medium mb-1">
                  ₹{stock.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <div className={`text-sm font-semibold tabular-nums ${stock.changePercent >= 0 ? 'text-success' : 'text-danger'}`}>
                  {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-4 text-text-secondary">Loading market data...</div>
          )}
        </div>
      </div>
    </div>
  );
}
