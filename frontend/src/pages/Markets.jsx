import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { stockApi } from '../services/stockApi';
import { Search } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export default function Markets() {
  const [stocks, setStocks] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const eventSource = new EventSource(`${BASE_URL}/api/stocks/stream?token=${token}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.success) {
        setStocks(data.data);
        setLoading(false);
      }
    };

    eventSource.onerror = (err) => {
      console.error('SSE Error:', err);
      stockApi.getAllStocks().then(data => {
        setStocks(data);
        setLoading(false);
      }).catch(console.error);
    };

    return () => eventSource.close();
  }, []);

  const filteredStocks = stocks.filter(s => 
    s.symbol.toLowerCase().includes(search.toLowerCase()) || 
    s.companyName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Markets</h1>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-secondary" />
          <input 
            type="text" 
            placeholder="Search stocks..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 bg-bg-surface border border-border-subtle rounded-lg focus:outline-none focus:border-brand-primary"
          />
        </div>
      </div>

      <div className="bg-bg-surface rounded-xl border border-border-subtle overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-text-secondary">Loading market data...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-subtle bg-bg-surface-raised">
                <th className="p-4 text-sm font-medium text-text-secondary">Symbol</th>
                <th className="p-4 text-sm font-medium text-text-secondary">Company</th>
                <th className="p-4 text-sm font-medium text-text-secondary">Sector</th>
                <th className="p-4 text-sm font-medium text-text-secondary text-right">Price</th>
                <th className="p-4 text-sm font-medium text-text-secondary text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStocks.map(stock => (
                <tr key={stock.id} className="border-b border-border-subtle hover:bg-bg-surface-raised transition-colors group">
                  <td className="p-4 font-medium text-brand-primary">
                    <Link to={`/markets/${stock.symbol}`} className="hover:underline">{stock.symbol}</Link>
                  </td>
                  <td className="p-4 text-sm">{stock.companyName}</td>
                  <td className="p-4 text-sm text-text-secondary">{stock.sector}</td>
                  <td className="p-4 tabular-nums text-right font-medium text-success">
                    ₹{stock.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4 text-right">
                    <Link 
                      to={`/markets/${stock.symbol}`}
                      className="px-4 py-1.5 bg-brand-primary text-white rounded text-sm hover:bg-brand-primary-hover transition-colors opacity-0 group-hover:opacity-100"
                    >
                      Trade
                    </Link>
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
