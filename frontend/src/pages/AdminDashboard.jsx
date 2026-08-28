import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/adminApi';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, Activity, Layers, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'ADMIN') return;
    
    Promise.all([
      adminApi.getStats(),
      adminApi.getUsers()
    ])
    .then(([statsData, usersData]) => {
      setStats(statsData);
      setUsersList(usersData);
      setLoading(false);
    })
    .catch(console.error);
  }, [user]);

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  if (loading) return <div className="p-8 text-center text-text-secondary">Loading Admin Dashboard...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <Link to="/dashboard" className="px-4 py-2 bg-bg-surface border border-border-subtle rounded-lg hover:bg-bg-surface-raised transition-colors">
          Exit Admin
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="p-6 bg-bg-surface rounded-xl border border-border-subtle flex items-center gap-4">
          <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-lg"><Users /></div>
          <div>
            <p className="text-sm text-text-secondary mb-1">Total Users</p>
            <p className="text-2xl font-bold tabular-nums">{stats.totalUsers}</p>
          </div>
        </div>
        <div className="p-6 bg-bg-surface rounded-xl border border-border-subtle flex items-center gap-4">
          <div className="p-3 bg-success/10 text-success rounded-lg"><Layers /></div>
          <div>
            <p className="text-sm text-text-secondary mb-1">Total Orders</p>
            <p className="text-2xl font-bold tabular-nums">{stats.totalOrders}</p>
          </div>
        </div>
        <div className="p-6 bg-bg-surface rounded-xl border border-border-subtle flex items-center gap-4">
          <div className="p-3 bg-warning/10 text-warning rounded-lg"><Activity /></div>
          <div>
            <p className="text-sm text-text-secondary mb-1">Total Transactions</p>
            <p className="text-2xl font-bold tabular-nums">{stats.totalTransactions}</p>
          </div>
        </div>
        <div className="p-6 bg-bg-surface rounded-xl border border-border-subtle flex items-center gap-4">
          <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-lg"><DollarSign /></div>
          <div>
            <p className="text-sm text-text-secondary mb-1">Total Volume</p>
            <p className="text-2xl font-bold tabular-nums">₹{stats.totalVolume.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      <div className="bg-bg-surface rounded-xl border border-border-subtle overflow-hidden">
        <h2 className="p-6 border-b border-border-subtle text-lg font-semibold">User Directory</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-subtle bg-bg-surface-raised">
              <th className="p-4 text-sm font-medium text-text-secondary">Name</th>
              <th className="p-4 text-sm font-medium text-text-secondary">Email</th>
              <th className="p-4 text-sm font-medium text-text-secondary">Role</th>
              <th className="p-4 text-sm font-medium text-text-secondary">Joined</th>
              <th className="p-4 text-sm font-medium text-text-secondary text-right">Cash Balance</th>
            </tr>
          </thead>
          <tbody>
            {usersList.map(u => (
              <tr key={u.id} className="border-b border-border-subtle last:border-0 hover:bg-bg-surface-raised transition-colors">
                <td className="p-4 font-medium">{u.name}</td>
                <td className="p-4 text-text-secondary">{u.email}</td>
                <td className="p-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${u.role === 'ADMIN' ? 'bg-brand-primary/20 text-brand-primary' : 'bg-text-secondary/20 text-text-secondary'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-4 text-sm tabular-nums text-text-secondary">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4 tabular-nums text-right font-medium">
                  {u.wallet ? `₹${u.wallet.cashBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
