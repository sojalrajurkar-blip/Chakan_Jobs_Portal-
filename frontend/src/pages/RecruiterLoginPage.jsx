import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, AlertBanner } from '../components/common/UIComponents';
import { animateFadeInUp } from '../utils/gsapAnimations';

export const RecruiterLoginPage = () => {
  const navigate = useNavigate();
  const { login, logout } = useAuth();
  const cardRef = useRef(null);
  const [formData, setFormData] = useState({ username_or_email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    animateFadeInUp(cardRef, { y: 30, duration: 0.6 });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await login(formData);
      if (res.success) {
        if (res.user?.role === 'CANDIDATE') {
          await logout();
          setError('This account is registered as a Candidate (Job Seeker). Please use the Candidate Login, or sign in with an Employer / Recruiter account (e.g. hr_tatamotors).');
          return;
        }
        navigate('/recruiter/dashboard');
      } else {
        setError(res.error?.message || 'Invalid credentials. Please verify your username/email and password.');
      }
    } catch (err) {
      setError(err?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: 'var(--space-16) 0', maxWidth: '440px' }}>
      <div ref={cardRef} className="card" style={{ padding: 'var(--space-8)' }}>

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
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="form-input"
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  padding: '4px',
                  cursor: 'pointer',
                  color: showPassword ? 'var(--color-brand-ink)' : 'var(--color-text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
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

        <div
          style={{
            marginTop: 'var(--space-4)',
            padding: 'var(--space-3)',
            backgroundColor: 'var(--color-surface-sunken)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            fontSize: '0.875rem',
            border: '1px solid var(--color-border-subtle)',
          }}
        >
          <span style={{ color: 'var(--color-text-secondary)' }}>Looking for a job? </span>
          <Link
            to="/candidate/login"
            style={{
              color: 'var(--color-brand-ink)',
              fontWeight: 700,
              textDecoration: 'underline',
            }}
          >
            Candidate Sign In →
          </Link>
        </div>
      </div>
    </div>
  );
};
