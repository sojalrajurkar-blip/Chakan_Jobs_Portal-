import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, GraduationCap, Lock, ArrowRight, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, AlertBanner } from '../components/common/UIComponents';

export const CandidateSignupPage = () => {
  const { registerCandidate } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    mobile_number: '',
    qualification: '10TH',
    current_address: '',
    password: '',
    confirm_password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState(null);

  const qualifications = [
    { value: '10TH', label: '10th Pass' },
    { value: '12TH', label: '12th Pass' },
    { value: 'ITI', label: 'ITI (Industrial Training)' },
    { value: 'DIPLOMA', label: 'Diploma' },
    { value: 'GRADUATION', label: 'Graduate / BE / B.Tech / Degree' },
    { value: 'POST_GRADUATION', label: 'Post Graduate' },
    { value: 'BELOW_10TH', label: 'Below 10th' },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setValidationErrors(null);

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match. Please re-enter matching passwords.');
      setLoading(false);
      return;
    }

    const res = await registerCandidate({
      full_name: formData.full_name.trim(),
      mobile_number: formData.mobile_number.trim(),
      qualification: formData.qualification,
      current_address: formData.current_address.trim(),
      password: formData.password,
      confirm_password: formData.confirm_password,
    });

    if (res.success) {
      navigate('/jobs', { replace: true });
    } else {
      setError(res.error?.message || 'Registration failed. Please check form entries and try again.');
      if (res.error?.details) {
        setValidationErrors(res.error.details);
      }
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
          maxWidth: '520px',
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
            <UserPlus size={28} />
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
            Candidate Free Registration
          </h1>
          <p
            style={{
              fontSize: '0.9375rem',
              color: 'var(--color-text-secondary)',
              margin: 0,
            }}
          >
            Apply directly to verified employers across Chakan & Talegaon MIDC
          </p>
        </div>

        {error && (
          <div style={{ marginBottom: 'var(--space-5)' }}>
            <AlertBanner variant="danger" title="Registration Error" message={error} />
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label
              htmlFor="candidate-name"
              style={{
                display: 'block',
                fontWeight: 600,
                fontSize: '0.875rem',
                color: 'var(--color-brand-ink)',
                marginBottom: 'var(--space-2)',
              }}
            >
              Full Name <span style={{ color: 'var(--color-accent-terracotta)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="candidate-name"
                name="full_name"
                type="text"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="e.g. Rahul Ramesh Shinde"
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
              <User
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
            {validationErrors?.full_name && (
              <span style={{ color: 'var(--color-accent-terracotta)', fontSize: '0.8125rem' }}>
                {validationErrors.full_name[0]}
              </span>
            )}
          </div>

          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label
              htmlFor="candidate-mobile"
              style={{
                display: 'block',
                fontWeight: 600,
                fontSize: '0.875rem',
                color: 'var(--color-brand-ink)',
                marginBottom: 'var(--space-2)',
              }}
            >
              10-Digit Mobile Number <span style={{ color: 'var(--color-accent-terracotta)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="candidate-mobile"
                name="mobile_number"
                type="tel"
                value={formData.mobile_number}
                onChange={handleChange}
                placeholder="e.g. 9876543210"
                maxLength={10}
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
            {validationErrors?.mobile_number && (
              <span style={{ color: 'var(--color-accent-terracotta)', fontSize: '0.8125rem' }}>
                {validationErrors.mobile_number[0]}
              </span>
            )}
          </div>

          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label
              htmlFor="candidate-qualification"
              style={{
                display: 'block',
                fontWeight: 600,
                fontSize: '0.875rem',
                color: 'var(--color-brand-ink)',
                marginBottom: 'var(--space-2)',
              }}
            >
              Highest Educational Qualification <span style={{ color: 'var(--color-accent-terracotta)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <select
                id="candidate-qualification"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border-default)',
                  fontSize: '0.9375rem',
                  outline: 'none',
                  backgroundColor: 'white',
                }}
              >
                {qualifications.map((q) => (
                  <option key={q.value} value={q.value}>
                    {q.label}
                  </option>
                ))}
              </select>
              <GraduationCap
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

          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label
              htmlFor="candidate-address"
              style={{
                display: 'block',
                fontWeight: 600,
                fontSize: '0.875rem',
                color: 'var(--color-brand-ink)',
                marginBottom: 'var(--space-2)',
              }}
            >
              Current Residence / Area in Chakan/Pune <span style={{ color: 'var(--color-accent-terracotta)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="candidate-address"
                name="current_address"
                type="text"
                value={formData.current_address}
                onChange={handleChange}
                placeholder="e.g. Kuruli, Nanekarwadi, Chakan Phase 2"
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
              <MapPin
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
            {validationErrors?.current_address && (
              <span style={{ color: 'var(--color-accent-terracotta)', fontSize: '0.8125rem' }}>
                {validationErrors.current_address[0]}
              </span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
            <div>
              <label
                htmlFor="candidate-pw"
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
                  id="candidate-pw"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 10px 12px 36px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border-default)',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                />
                <Lock
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-text-muted)',
                  }}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="candidate-confirm-pw"
                style={{
                  display: 'block',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  color: 'var(--color-brand-ink)',
                  marginBottom: 'var(--space-2)',
                }}
              >
                Confirm Password <span style={{ color: 'var(--color-accent-terracotta)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="candidate-confirm-pw"
                  name="confirm_password"
                  type="password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 10px 12px 36px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border-default)',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                />
                <Lock
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-text-muted)',
                  }}
                />
              </div>
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
            <UserPlus size={18} />
            {loading ? 'Creating Account...' : 'Create Free Account'}
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
            Already have an account?{' '}
          </span>
          <Link
            to="/candidate/login"
            style={{
              color: 'var(--color-brand-ink)',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            Sign in here <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
};
