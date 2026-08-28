const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

export const adminApi = {
  async getStats() {
    const res = await fetch(`${BASE_URL}/api/admin/stats`, { headers: getAuthHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Failed to fetch admin stats');
    return data.data;
  },
  async getUsers() {
    const res = await fetch(`${BASE_URL}/api/admin/users`, { headers: getAuthHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Failed to fetch users');
    return data.data;
  }
};
