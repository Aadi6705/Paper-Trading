import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { walletApi } from '../services/walletApi';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    walletApi.getWallet()
      .then(setWallet)
      .catch(console.error);
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-4">
          <Link to="/transactions" className="px-4 py-2 text-brand-primary hover:underline flex items-center">
            View Transactions
          </Link>
          <button 
            onClick={logout}
            className="px-4 py-2 bg-bg-surface border border-border-subtle rounded-lg hover:bg-bg-surface-raised transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {/* Wallet Summary */}
        <div className="p-6 bg-bg-surface rounded-xl border border-border-subtle flex flex-col justify-center">
          <h2 className="text-sm font-medium text-text-secondary mb-2">Available Cash</h2>
          {wallet ? (
            <div className="text-4xl font-bold text-success tabular-nums">
              ₹{wallet.cashBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          ) : (
            <div className="text-2xl text-text-secondary">Loading...</div>
          )}
        </div>
      </div>
    </div>
  );
}
