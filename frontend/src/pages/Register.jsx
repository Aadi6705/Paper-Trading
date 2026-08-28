import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await register(name, email, password);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 bg-bg-surface rounded-xl border border-border-subtle animate-in slide-in-from-bottom-4 fade-in duration-300">
        <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1">Name</label>
            <input 
              type="text" 
              required
              className="w-full p-2 bg-bg-primary border border-border-subtle rounded-lg focus:outline-none focus:border-brand-primary"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
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
              minLength={6}
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
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-text-secondary">
          Already have an account? <Link to="/login" className="text-brand-primary hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
