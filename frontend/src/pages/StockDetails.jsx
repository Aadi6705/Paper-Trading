import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { stockApi } from '../services/stockApi';
import { tradingApi } from '../services/tradingApi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft } from 'lucide-react';
import CountUp from '../components/CountUp';
import { SkeletonCard } from '../components/Skeleton';
import { useToast } from '../context/ToastContext';
import useFlashOnChange from '../hooks/useFlashOnChange';

export default function StockDetails() {
  const { symbol } = useParams();
  const [stock, setStock] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const flashClass = useFlashOnChange(stock?.currentPrice || 0);

  // Trading state
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const handleTrade = async (side) => {
    setSubmitting(true);
    try {
      await tradingApi.placeOrder(symbol, side, quantity);
      toast.success(`Successfully ${side === 'BUY' ? 'bought' : 'sold'} ${quantity} shares of ${symbol}.`);
    } catch (err) {
      toast.error(err.message || 'Failed to place order.');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    // Also subscribe to SSE for live price ticks
    const token = localStorage.getItem('token');
    const eventSource = new EventSource(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/stocks/stream?token=${token}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.success) {
        const updatedStock = data.data.find(s => s.symbol === symbol);
        if (updatedStock) {
          setStock(prev => ({ ...prev, currentPrice: updatedStock.currentPrice }));
        }
      }
    };

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

    return () => eventSource.close();
  }, [symbol]);

  if (loading) {
    return (
      <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-300">
        <Link to="/markets" className="inline-flex items-center text-sm text-text-secondary hover:text-brand-primary mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Markets
        </Link>
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="h-8 w-32 bg-bg-surface-raised rounded-md animate-pulse mb-2"></div>
            <div className="h-4 w-48 bg-bg-surface-raised rounded-md animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
            <SkeletonCard className="h-[400px]" />
          </div>
          <div>
            <SkeletonCard className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (!stock) return <div className="p-8 text-center text-danger">Stock not found</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      <Link to="/markets" className="inline-flex items-center text-sm text-text-secondary hover:text-brand-primary mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Markets
      </Link>
      
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold">{stock.symbol}</h1>
          <p className="text-text-secondary mt-1">{stock.companyName} • {stock.exchange}</p>
        </div>
        <div className="text-right">
          <div className={`text-4xl font-bold text-success tabular-nums inline-block ${flashClass}`}>
            <CountUp value={stock.currentPrice} prefix="₹" />
          </div>
          <p className="text-sm text-text-secondary mt-1">Live Simulated Price</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 bg-bg-surface p-6 rounded-xl border border-border-subtle h-[400px] hover:bg-bg-surface-raised transition-colors">
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

        <div className="bg-bg-surface p-6 rounded-xl border border-border-subtle flex flex-col hover:bg-bg-surface-raised transition-colors">
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
              <span className="font-bold">
                <CountUp value={stock.currentPrice * quantity} prefix="₹" />
              </span>
            </div>
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
