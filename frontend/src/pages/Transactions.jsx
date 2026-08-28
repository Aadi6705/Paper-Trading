import React, { useEffect, useState } from 'react';
import { walletApi } from '../services/walletApi';
import { Link } from 'react-router-dom';
import CountUp from '../components/CountUp';
import { SkeletonTable } from '../components/Skeleton';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    walletApi.getTransactions()
      .then(data => {
        setTransactions(data);
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
        <h1 className="text-2xl font-bold">Transaction History</h1>
        <Link to="/dashboard" className="px-4 py-2 bg-bg-surface border border-border-subtle rounded-lg hover:bg-bg-surface-raised transition-colors">
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-bg-surface rounded-xl border border-border-subtle overflow-hidden">
        {loading ? (
          <SkeletonTable columns={4} rows={6} className="border-0 rounded-none" />
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center text-text-secondary">No transactions yet.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-subtle bg-bg-surface-raised">
                <th className="p-4 text-sm font-medium text-text-secondary">Date</th>
                <th className="p-4 text-sm font-medium text-text-secondary">Type</th>
                <th className="p-4 text-sm font-medium text-text-secondary text-right">Amount</th>
                <th className="p-4 text-sm font-medium text-text-secondary">Description</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, i) => (
                <tr 
                  key={tx.id} 
                  className="border-b border-border-subtle last:border-0 hover:bg-bg-surface-raised transition-colors animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <td className="p-4 text-sm tabular-nums text-text-secondary">
                    {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      tx.type === 'INITIAL_DEPOSIT' ? 'bg-brand-primary/20 text-brand-primary' :
                      tx.type === 'BUY' ? 'bg-danger/20 text-danger' : 
                      'bg-success/20 text-success'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className={`p-4 text-sm tabular-nums font-medium text-right ${
                    tx.type === 'BUY' ? 'text-danger' : 'text-success'
                  }`}>
                    <CountUp value={tx.amount} prefix={tx.type === 'BUY' ? '-₹' : '+₹'} />
                  </td>
                  <td className="p-4 text-sm text-text-secondary">{tx.description || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
