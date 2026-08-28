import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { portfolioApi } from '../services/portfolioApi';
import { stockApi } from '../services/stockApi';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown } from 'lucide-react';
import CountUp from '../components/CountUp';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [movers, setMovers] = useState([]);

  useEffect(() => {
    portfolioApi.getPortfolio()
      .then(setPortfolio)
      .catch(console.error);

    const token = localStorage.getItem('token');
    const eventSource = new EventSource(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/stocks/stream?token=${token}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.success) {
        const sorted = [...data.data].sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
        setMovers(sorted.slice(0, 4));
      }
    };

    eventSource.onerror = (err) => {
      console.error('SSE Error on Dashboard:', err);
      stockApi.getAllStocks()
        .then(data => {
          const sorted = [...data].sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
          setMovers(sorted.slice(0, 4));
        })
        .catch(console.error);
    };

    return () => eventSource.close();
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-4">
          {user?.role === 'ADMIN' && (
            <Link to="/admin" className="px-4 py-2 text-warning hover:underline flex items-center transition-colors">
              Admin Panel
            </Link>
          )}
          <Link to="/markets" className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-hover flex items-center transition-colors">
            Browse Markets
          </Link>
          <Link to="/portfolio" className="px-4 py-2 text-brand-primary hover:underline flex items-center transition-colors">
            Portfolio
          </Link>
          <Link to="/transactions" className="px-4 py-2 text-brand-primary hover:underline flex items-center transition-colors">
            Transactions
          </Link>
          <Link to="/orders" className="px-4 py-2 text-brand-primary hover:underline flex items-center transition-colors">
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
        <div className="p-6 bg-bg-surface rounded-xl border border-border-subtle hover:bg-bg-surface-raised transition-colors">
          <h2 className="text-lg font-semibold mb-4">Profile Details</h2>
          <ul className="space-y-2 font-mono text-sm">
            <li>Name: <span className="text-text-primary">{user.name}</span></li>
            <li>Email: <span className="text-brand-primary">{user.email}</span></li>
            <li>Role: <span className="text-brand-primary">{user.role}</span></li>
            <li>Joined: <span className="text-brand-primary">{new Date(user.createdAt).toLocaleDateString()}</span></li>
          </ul>
        </div>

        {/* Portfolio Summary */}
        <div className="p-6 bg-bg-surface rounded-xl border border-border-subtle flex flex-col justify-center hover:bg-bg-surface-raised transition-colors">
          <h2 className="text-sm font-medium text-text-secondary mb-4">Financial Overview</h2>
          {portfolio ? (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <p className="text-xs text-text-secondary mb-1">Net Worth</p>
                <div className="text-3xl font-bold text-success tabular-nums">
                  <CountUp value={portfolio.summary.netWorth} prefix="₹" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border-subtle">
                <div>
                  <p className="text-xs text-text-secondary mb-1">Available Cash</p>
                  <p className="text-lg font-semibold tabular-nums">
                    <CountUp value={portfolio.summary.cashBalance} prefix="₹" />
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary mb-1">Overall P&L</p>
                  <p className={`text-lg font-semibold tabular-nums ${portfolio.summary.totalPnl >= 0 ? 'text-success' : 'text-danger'}`}>
                    <CountUp 
                      value={portfolio.summary.totalPnl} 
                      prefix={portfolio.summary.totalPnl >= 0 ? '+₹' : '-₹'} 
                      valueOverride={Math.abs(portfolio.summary.totalPnl)}
                    />
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="h-4 w-20 bg-bg-surface-raised rounded-md animate-pulse mb-2"></div>
                <div className="h-8 w-32 bg-bg-surface-raised rounded-md animate-pulse"></div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border-subtle">
                <div>
                  <div className="h-4 w-20 bg-bg-surface-raised rounded-md animate-pulse mb-2"></div>
                  <div className="h-6 w-24 bg-bg-surface-raised rounded-md animate-pulse"></div>
                </div>
                <div>
                  <div className="h-4 w-20 bg-bg-surface-raised rounded-md animate-pulse mb-2"></div>
                  <div className="h-6 w-24 bg-bg-surface-raised rounded-md animate-pulse"></div>
                </div>
              </div>
            </div>
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
                  <CountUp value={stock.currentPrice} prefix="₹" />
                </div>
                <div className={`text-sm font-semibold tabular-nums ${stock.changePercent >= 0 ? 'text-success' : 'text-danger'}`}>
                  {stock.changePercent >= 0 ? '+' : ''}
                  <CountUp value={stock.changePercent} suffix="%" />
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-4 text-text-secondary flex gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex-1 h-24 bg-bg-surface border border-border-subtle rounded-xl animate-pulse"></div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
