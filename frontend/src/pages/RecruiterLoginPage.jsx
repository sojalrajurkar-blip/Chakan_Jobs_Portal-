import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, AlertBanner } from '../components/common/UIComponents';

export const RecruiterLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username_or_email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await login(formData);
    setLoading(false);

    if (res.success) {
      navigate('/recruiter/dashboard');
    } else {
      setError(res.error?.message || 'Invalid credentials. Please verify your username/email and password.');
    }
  };

  return (
    <div className="container" style={{ padding: 'var(--space-16) 0', maxWidth: '440px' }}>
      <div className="card" style={{ padding: 'var(--space-8)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-pill)', backgroundColor: 'var(--color-brand-sage)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-3)', color: 'var(--color-brand-ink)' }}>
            <Building2 size={24} />
          </div>
          <h1 style={{ fontSize: '1.625rem', marginBottom: 'var(--space-1)' }}>Employer Login</h1>
          <p style={{ fontSize: '0.875rem' }}>Sign in to manage your Chakan job vacancies and candidate applications.</p>
        </div>

        {error && <AlertBanner type="error" message={error} />}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username or Email *</label>
            <input
              type="text"
              required
              placeholder="e.g. tatamotors_hr"
              value={formData.username_or_email}
              onChange={(e) => setFormData({ ...formData, username_or_email: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <input
              type="password"
              required
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="form-input"
            />
          </div>

          <Button type="submit" variant="primary" size="lg" isLoading={loading} style={{ width: '100%', marginTop: 'var(--space-4)' }}>
            Sign In to Dashboard
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border-default)', fontSize: '0.875rem' }}>
          Don't have an employer account?{' '}
          <Link to="/recruiter/signup" style={{ fontWeight: 600, color: 'var(--color-brand-ink)' }}>
            Register Your Company
          </Link>
        </div>
      </div>
    </div>
  );
};
