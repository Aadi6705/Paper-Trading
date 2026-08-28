const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

export const portfolioApi = {
  async getPortfolio() {
    const res = await fetch(`${BASE_URL}/api/portfolio`, { headers: getAuthHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Failed to fetch portfolio');
    return data.data;
  }
};
