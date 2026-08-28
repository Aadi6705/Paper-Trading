const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return { 
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}` 
  };
};

export const tradingApi = {
  async placeOrder(symbol, side, quantity) {
    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ symbol, side, quantity, orderType: 'MARKET' })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Order failed');
    return data.data;
  },

  async getOrders() {
    const res = await fetch(`${BASE_URL}/api/orders`, { 
      method: 'GET',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Failed to fetch orders');
    return data.data;
  }
};
