const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export const walletApi = {
  async getWallet() {
    const token = localStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/api/wallet`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Failed to fetch wallet');
    return data.data;
  },

  async getTransactions() {
    const token = localStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/api/wallet/transactions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Failed to fetch transactions');
    return data.data;
  },
};
