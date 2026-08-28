import React, { useEffect, useState } from 'react';
import { tradingApi } from '../services/tradingApi';
import { Link } from 'react-router-dom';
import CountUp from '../components/CountUp';
import { SkeletonTable } from '../components/Skeleton';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tradingApi.getOrders()
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Order History</h1>
        <Link to="/dashboard" className="px-4 py-2 bg-bg-surface border border-border-subtle rounded-lg hover:bg-bg-surface-raised transition-colors">
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-bg-surface rounded-xl border border-border-subtle overflow-hidden">
        {loading ? (
          <SkeletonTable columns={6} rows={6} className="border-0 rounded-none" />
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-text-secondary">No orders placed yet.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-subtle bg-bg-surface-raised">
                <th className="p-4 text-sm font-medium text-text-secondary">Date</th>
                <th className="p-4 text-sm font-medium text-text-secondary">Symbol</th>
                <th className="p-4 text-sm font-medium text-text-secondary">Side</th>
                <th className="p-4 text-sm font-medium text-text-secondary text-right">Qty</th>
                <th className="p-4 text-sm font-medium text-text-secondary text-right">Price</th>
                <th className="p-4 text-sm font-medium text-text-secondary">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr 
                  key={order.id} 
                  className="border-b border-border-subtle last:border-0 hover:bg-bg-surface-raised transition-colors animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <td className="p-4 text-sm tabular-nums text-text-secondary">
                    {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="p-4 font-medium text-brand-primary">
                    <Link to={`/markets/${order.stock.symbol}`} className="hover:underline">{order.stock.symbol}</Link>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      order.side === 'BUY' ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'
                    }`}>
                      {order.side}
                    </span>
                  </td>
                  <td className="p-4 tabular-nums text-right font-medium">{order.quantity}</td>
                  <td className="p-4 tabular-nums text-right font-medium">
                    <CountUp value={order.price} prefix="₹" />
                  </td>
                  <td className="p-4 text-sm">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      order.status === 'EXECUTED' ? 'bg-success/20 text-success' : 'bg-text-secondary/20 text-text-secondary'
                    }`}>
                      {order.status}
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
