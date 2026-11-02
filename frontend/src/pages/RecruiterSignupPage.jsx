import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, AlertBanner } from '../components/common/UIComponents';
import { animateFadeInUp } from '../utils/gsapAnimations';

export const RecruiterSignupPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const cardRef = useRef(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    full_name: '',
    mobile_number: '',
    company_name: '',
    company_address: '',
    position: '',
    company_type: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState(null);

  useEffect(() => {
    animateFadeInUp(cardRef, { y: 30, duration: 0.6 });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setValidationErrors(null);

    const res = await register(formData);
    setLoading(false);

    if (res.success) {
      navigate('/recruiter/dashboard');
    } else {
      setError(res.error?.message || 'Registration failed. Please check your form details.');
      setValidationErrors(res.error?.details || null);
    }
  };

  return (
    <div className="container" style={{ padding: 'var(--space-12) 0', maxWidth: '640px' }}>
      <div ref={cardRef} className="card" style={{ padding: 'var(--space-8)' }}>

        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-pill)', backgroundColor: 'var(--color-brand-sage)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-3)', color: 'var(--color-brand-ink)' }}>
            <Building2 size={24} />
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: 'var(--space-1)' }}>Register Your Company</h1>
          <p style={{ fontSize: '0.875rem' }}>Start publishing jobs and hiring factory & engineering talent in Chakan.</p>
        </div>

        {error && <AlertBanner type="error" message={error} details={validationErrors} />}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label">Username *</label>
              <input
                type="text"
                name="username"
                required
                placeholder="e.g. bajaj_recruitment"
                value={formData.username}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Official Work Email *</label>
              <input
                type="email"
                name="email"
                required
                placeholder="hr@company.com"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={handleChange}
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

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirm_password"
                  required
                  placeholder="Re-enter password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  className="form-input"
                  style={{ paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    padding: '4px',
                    cursor: 'pointer',
                    color: showConfirmPassword ? 'var(--color-brand-ink)' : 'var(--color-text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label">Contact Person Name *</label>
              <input
                type="text"
                name="full_name"
                required
                placeholder="e.g. Mahesh Patil"
                value={formData.full_name}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">HR Mobile Number *</label>
              <input
                type="tel"
                name="mobile_number"
                required
                maxLength="10"
                placeholder="10-digit number"
                value={formData.mobile_number}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Company / Employer Name *</label>
            <input
              type="text"
              name="company_name"
              required
              placeholder="e.g. Flash Electronics India Pvt Ltd"
              value={formData.company_name}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label">Designation / Role</label>
              <input
                type="text"
                name="position"
                placeholder="e.g. HR Manager / Plant Head"
                value={formData.position}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Industry Type</label>
              <input
                type="text"
                name="company_type"
                placeholder="e.g. Automotive Tier 1 / Fabrication"
                value={formData.company_type}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Plant / Office Address in Chakan</label>
            <textarea
              name="company_address"
              rows="2"
              placeholder="e.g. Plot No. B-24, MIDC Phase 2, Chakan"
              value={formData.company_address}
              onChange={handleChange}
              className="form-textarea"
            />
          </div>

          <Button type="submit" variant="primary" size="lg" isLoading={loading} style={{ width: '100%', marginTop: 'var(--space-4)' }}>
            Create Recruiter Account
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border-default)', fontSize: '0.875rem' }}>
          Already have an account?{' '}
          <Link to="/recruiter/login" style={{ fontWeight: 600, color: 'var(--color-brand-ink)' }}>
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
