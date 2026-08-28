const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

export const stockApi = {
  async getAllStocks() {
    const res = await fetch(`${BASE_URL}/api/stocks`, { headers: getAuthHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Failed to fetch stocks');
    return data.data;
  },

  async getStock(symbol) {
    const res = await fetch(`${BASE_URL}/api/stocks/${symbol}`, { headers: getAuthHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Failed to fetch stock');
    return data.data;
  },

  async getStockHistory(symbol) {
    const res = await fetch(`${BASE_URL}/api/stocks/${symbol}/history`, { headers: getAuthHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Failed to fetch history');
    return data.data;
  }
};
