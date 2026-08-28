import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 bg-bg-surface rounded-xl border border-border-subtle">
        <h2 className="text-2xl font-bold mb-6 text-center">Log In to Trade</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-danger/10 border border-danger text-danger rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full p-2 bg-bg-primary border border-border-subtle rounded-lg focus:outline-none focus:border-brand-primary"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full p-2 bg-bg-primary border border-border-subtle rounded-lg focus:outline-none focus:border-brand-primary"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-2 mt-4 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-text-secondary">
          Don't have an account? <Link to="/register" className="text-brand-primary hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
