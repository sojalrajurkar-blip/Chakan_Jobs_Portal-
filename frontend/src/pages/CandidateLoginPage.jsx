import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Phone, Lock, LogIn, UserCheck, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, AlertBanner } from '../components/common/UIComponents';
import { animateFadeInUp } from '../utils/gsapAnimations';

export const CandidateLoginPage = () => {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const cardRef = useRef(null);

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname || '/candidate/applications';

  useEffect(() => {
    animateFadeInUp(cardRef, { y: 30, duration: 0.6 });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await login({
        username_or_email: identifier.trim(),
        password,
      });

      if (res.success) {
        if (res.user?.role === 'RECRUITER') {
          await logout();
          setError('This account is registered as an Employer / Recruiter. Please sign in via Employer / HR Login to access your dashboard.');
          return;
        }
        navigate(from, { replace: true });
      } else {
        setError(res.error?.message || 'Invalid mobile number or password. Please verify your credentials.');
      }
    } catch (err) {
      setError(err?.message || 'Login failed. Please check your network connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 72px)',
        backgroundColor: 'var(--color-surface-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-8) var(--space-4)',
      }}
    >
      <div
        ref={cardRef}
        className="card"
        style={{
          width: '100%',
          maxWidth: '460px',
          boxShadow: 'var(--shadow-card)',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--color-surface-card)',
          padding: 'var(--space-8)',
          border: '1px solid var(--color-border-default)',
        }}
      >

        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-brand-sage)',
              color: 'var(--color-brand-ink)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--space-3)',
            }}
          >
            <UserCheck size={28} />
          </div>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: 'var(--color-brand-ink)',
              margin: '0 0 var(--space-2) 0',
              fontFamily: 'var(--font-display)',
            }}
          >
            Candidate Sign In
          </h1>
          <p
            style={{
              fontSize: '0.9375rem',
              color: 'var(--color-text-secondary)',
              margin: 0,
            }}
          >
            Sign in to track your job applications across Chakan & Talegaon MIDC
          </p>
        </div>

        {error && (
          <div style={{ marginBottom: 'var(--space-5)' }}>
            <AlertBanner variant="danger" title="Login Failed" message={error} />
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label
              htmlFor="candidate-identifier"
              style={{
                display: 'block',
                fontWeight: 600,
                fontSize: '0.875rem',
                color: 'var(--color-brand-ink)',
                marginBottom: 'var(--space-2)',
              }}
            >
              Mobile Number or Registered Name <span style={{ color: 'var(--color-accent-terracotta)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="candidate-identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. 1234509876 or Tejas"
                required
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border-default)',
                  fontSize: '0.9375rem',
                  outline: 'none',
                }}
              />
              <Phone
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-muted)',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 'var(--space-6)' }}>
            <label
              htmlFor="candidate-password"
              style={{
                display: 'block',
                fontWeight: 600,
                fontSize: '0.875rem',
                color: 'var(--color-brand-ink)',
                marginBottom: 'var(--space-2)',
              }}
            >
              Password <span style={{ color: 'var(--color-accent-terracotta)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="candidate-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={{
                  width: '100%',
                  padding: '12px 42px 12px 42px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border-default)',
                  fontSize: '0.9375rem',
                  outline: 'none',
                }}
              />
              <Lock
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-muted)',
                  pointerEvents: 'none',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  right: '12px',
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

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px',
              fontSize: '1rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <LogIn size={18} />
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div
          style={{
            marginTop: 'var(--space-6)',
            paddingTop: 'var(--space-5)',
            borderTop: '1px solid var(--color-border-default)',
            textAlign: 'center',
            fontSize: '0.9375rem',
          }}
        >
          <span style={{ color: 'var(--color-text-secondary)' }}>
            New job-seeker?{' '}
          </span>
          <Link
            to="/candidate/signup"
            state={location.state}
            style={{
              color: 'var(--color-brand-ink)',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            Create free account <ArrowRight size={15} />
          </Link>
        </div>

        <div style={{ marginTop: 'var(--space-4)', textAlign: 'center' }}>
          <Link
            to="/jobs"
            style={{
              color: 'var(--color-text-muted)',
              fontSize: '0.8125rem',
              textDecoration: 'none',
            }}
          >
            ← Explore vacancies without logging in
          </Link>
        </div>

        <div
          style={{
            marginTop: 'var(--space-5)',
            padding: 'var(--space-3) var(--space-4)',
            backgroundColor: 'var(--color-surface-sunken)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            fontSize: '0.875rem',
            border: '1px solid var(--color-border-subtle)',
          }}
        >
          <span style={{ color: 'var(--color-text-secondary)' }}>Are you an Employer / HR? </span>
          <Link
            to="/recruiter/login"
            style={{
              color: 'var(--color-brand-ink)',
              fontWeight: 700,
              textDecoration: 'underline',
            }}
          >
            Employer Sign In →
          </Link>
        </div>
      </div>
    </div>
  );
};
