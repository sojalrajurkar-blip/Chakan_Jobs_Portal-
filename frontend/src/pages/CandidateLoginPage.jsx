import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Phone, Lock, LogIn, UserCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, AlertBanner } from '../components/common/UIComponents';

export const CandidateLoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname || '/candidate/applications';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await login({
      username_or_email: identifier.trim(),
      password,
    });

    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.error?.message || 'अवैध मोबाईल नंबर किंवा पासवर्ड. कृपया पुन्हा तपासा. (Invalid credentials)');
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
            उमेदवार लॉगिन
          </h1>
          <p
            style={{
              fontSize: '0.9375rem',
              color: 'var(--color-text-secondary)',
              margin: 0,
            }}
          >
            चाकण एमआयडीसी मधील नोकरी अर्जांची स्थिती तपासण्यासाठी लॉगिन करा
          </p>
        </div>

        {error && (
          <div style={{ marginBottom: 'var(--space-5)' }}>
            <AlertBanner variant="danger" title="लॉगिन अयशस्वी" message={error} />
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
              मोबाईल नंबर किंवा युझरनेम (Mobile Number / Username) <span style={{ color: 'var(--color-accent-terracotta)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="candidate-identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="उदा. 9876543210"
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
              पासवर्ड (Password) <span style={{ color: 'var(--color-accent-terracotta)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="candidate-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="आपला पासवर्ड प्रविष्ट करा"
                required
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
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
                }}
              />
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
            {loading ? 'लॉगिन होत आहे...' : 'लॉगिन करा (Sign In)'}
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
            नवीन उमेदवार आहात?{' '}
          </span>
          <Link
            to="/candidate/signup"
            style={{
              color: 'var(--color-brand-ink)',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            येथे मोफत नोंदणी करा <ArrowRight size={15} />
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
            ← थेट नोकऱ्या पाहा (Skip to Jobs)
          </Link>
        </div>
      </div>
    </div>
  );
};
