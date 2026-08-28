import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { stockApi } from '../services/stockApi';
import { tradingApi } from '../services/tradingApi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft } from 'lucide-react';

export default function StockDetails() {
  const { symbol } = useParams();
  const [stock, setStock] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Trading state
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleTrade = async (side) => {
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      await tradingApi.placeOrder(symbol, side, quantity);
      setSuccess(`Successfully ${side === 'BUY' ? 'bought' : 'sold'} ${quantity} shares of ${symbol}.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    Promise.all([
      stockApi.getStock(symbol),
      stockApi.getStockHistory(symbol)
    ])
    .then(([stockData, historyData]) => {
      setStock(stockData);
      setHistory(historyData);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [symbol]);

  if (loading) return <div className="p-8 text-center text-text-secondary">Loading {symbol}...</div>;
  if (!stock) return <div className="p-8 text-center text-danger">Stock not found</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Link to="/markets" className="inline-flex items-center text-sm text-text-secondary hover:text-brand-primary mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Markets
      </Link>
      
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold">{stock.symbol}</h1>
          <p className="text-text-secondary mt-1">{stock.companyName} • {stock.exchange}</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-success tabular-nums">
            ₹{stock.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-sm text-text-secondary mt-1">Live Simulated Price</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 bg-bg-surface p-6 rounded-xl border border-border-subtle h-[400px]">
          <h3 className="font-semibold mb-4 text-sm text-text-secondary">30-Day Price History</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#232B3A" vertical={false} />
              <XAxis dataKey="date" stroke="#8A94A6" fontSize={12} tickMargin={10} minTickGap={30} />
              <YAxis domain={['auto', 'auto']} stroke="#8A94A6" fontSize={12} tickFormatter={(val) => `₹${val}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1B2330', borderColor: '#232B3A', color: '#F5F7FA' }}
                itemStyle={{ color: '#3B82F6' }}
                formatter={(value) => [`₹${value}`, 'Price']}
              />
              <Line type="monotone" dataKey="price" stroke="#3B82F6" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-bg-surface p-6 rounded-xl border border-border-subtle flex flex-col">
          <h3 className="font-semibold mb-4">Trade {stock.symbol}</h3>
          
          <div className="flex-1 flex flex-col justify-center text-center p-4">
            <label className="block text-sm text-text-secondary text-left mb-1">Quantity</label>
            <input 
              type="number" 
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-full p-2 bg-bg-primary border border-border-subtle rounded-lg focus:outline-none focus:border-brand-primary mb-4"
            />
            
            <div className="text-sm flex justify-between mb-2">
              <span className="text-text-secondary">Estimated Value:</span>
              <span className="font-bold">₹{(stock.currentPrice * quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>

            {error && <div className="text-danger text-sm text-left mb-4">{error}</div>}
            {success && <div className="text-success text-sm text-left mb-4">{success}</div>}
          </div>
          
          <div className="mt-4 flex gap-2">
            <button 
              onClick={() => handleTrade('BUY')}
              disabled={submitting}
              className="flex-1 py-2 bg-success text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? 'Processing...' : 'Buy'}
            </button>
            <button 
              onClick={() => handleTrade('SELL')}
              disabled={submitting}
              className="flex-1 py-2 bg-danger text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? 'Processing...' : 'Sell'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
