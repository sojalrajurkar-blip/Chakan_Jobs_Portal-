import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, Building2, User, LogOut, Menu, X, PlusCircle, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/UIComponents';

export const SiteHeader = () => {
  const { user, isAuthenticated, isRecruiter, isCandidate, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const closeMobile = () => setMobileMenuOpen(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header
      style={{
        backgroundColor: 'var(--color-surface-card)',
        borderBottom: '1px solid var(--color-border-default)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow-subtle)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '72px',
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            textDecoration: 'none',
          }}
          onClick={closeMobile}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-brand-ink)',
              color: 'var(--color-brand-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.25rem',
            }}
          >
            <Briefcase size={22} />
          </div>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.25rem',
                color: 'var(--color-brand-ink)',
                lineHeight: 1.1,
              }}
            >
              CHAKAN<span style={{ color: 'var(--color-brand-gold-strong)' }}>JOBS</span>
            </div>
            <div
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: 'var(--color-text-secondary)',
                letterSpacing: '0.04em',
              }}
            >
              MIDC INDUSTRIAL HIRING PORTAL
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: 'var(--space-6)',
          }}
          className="desktop-nav"
        >
          <Link
            to="/jobs"
            style={{
              fontWeight: 600,
              fontSize: '0.9375rem',
              color: isActive('/jobs') ? 'var(--color-brand-ink)' : 'var(--color-text-secondary)',
              borderBottom: isActive('/jobs') ? '2px solid var(--color-brand-ink)' : 'none',
              padding: 'var(--space-2) 0',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Search size={16} /> Browse Vacancies
          </Link>

          {/* Authenticated Controls */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              {isRecruiter ? (
                <>
                  <Link
                    to="/recruiter/jobs/new"
                    style={{
                      fontWeight: 600,
                      fontSize: '0.9375rem',
                      color: isActive('/recruiter/jobs/new') ? 'var(--color-brand-ink)' : 'var(--color-text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <PlusCircle size={16} /> Post a Job
                  </Link>
                  <Link to="/recruiter/dashboard">
                    <Button variant="secondary" size="sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Building2 size={16} />
                      <span>{user?.company_name ? user.company_name.slice(0, 18) : 'HR Dashboard'}</span>
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/candidate/applications"
                    style={{
                      fontWeight: 600,
                      fontSize: '0.9375rem',
                      color: isActive('/candidate/applications') ? 'var(--color-brand-ink)' : 'var(--color-text-secondary)',
                      borderBottom: isActive('/candidate/applications') ? '2px solid var(--color-brand-ink)' : 'none',
                      padding: 'var(--space-2) 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Briefcase size={16} /> My Applications
                  </Link>
                  <Link to="/candidate/applications">
                    <Button variant="secondary" size="sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={15} />
                      <span>{user?.full_name ? user.full_name.split(' ')[0] : (user?.mobile_number || 'Candidate')}</span>
                    </Button>
                  </Link>
                </>
              )}

              <Button variant="ghost" size="sm" onClick={handleLogout} title="Log Out">
                <LogOut size={16} />
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <Link
                to="/candidate/login"
                style={{
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  color: 'var(--color-brand-ink)',
                  textDecoration: 'none',
                  padding: 'var(--space-2) var(--space-3)',
                }}
              >
                Candidate Login
              </Link>
              <Link to="/candidate/signup" style={{ textDecoration: 'none' }}>
                <Button variant="primary" size="sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={15} /> Sign Up
                </Button>
              </Link>
              <span style={{ color: 'var(--color-border-default)', margin: '0 var(--space-1)' }}>|</span>
              <Link
                to="/recruiter/login"
                style={{
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  color: 'var(--color-text-secondary)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-surface-sunken)',
                }}
              >
                <Building2 size={15} /> Employer / HR Login
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 'var(--space-2)',
            color: 'var(--color-brand-ink)',
            display: 'block',
          }}
          className="mobile-toggle"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: 'var(--color-surface-card)',
            borderTop: '1px solid var(--color-border-default)',
            padding: 'var(--space-6)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
          }}
        >
          <Link
            to="/jobs"
            onClick={closeMobile}
            style={{
              padding: 'var(--space-3)',
              fontWeight: 600,
              borderRadius: 'var(--radius-md)',
              backgroundColor: isActive('/jobs') ? 'var(--color-brand-sage)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
            }}
          >
            <Search size={18} /> Browse All Jobs
          </Link>

          {/* If Logged in */}
          {isAuthenticated ? (
            <div style={{ borderTop: '1px solid var(--color-border-default)', paddingTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {isRecruiter ? (
                <>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                    Employer: <strong>{user?.company_name || user?.username}</strong>
                  </div>
                  <Link
                    to="/recruiter/jobs/new"
                    onClick={closeMobile}
                    style={{
                      padding: 'var(--space-2) 0',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                      color: 'var(--color-brand-ink)',
                    }}
                  >
                    <PlusCircle size={18} /> Post a Vacancy
                  </Link>
                  <Link to="/recruiter/dashboard" onClick={closeMobile} style={{ textDecoration: 'none' }}>
                    <Button variant="primary" style={{ width: '100%' }}>
                      Go to HR Dashboard
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                    Candidate: <strong>{user?.full_name || user?.mobile_number}</strong>
                  </div>
                  <Link
                    to="/candidate/applications"
                    onClick={closeMobile}
                    style={{
                      padding: 'var(--space-2) 0',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                      color: 'var(--color-brand-ink)',
                    }}
                  >
                    <Briefcase size={18} /> My Applications
                  </Link>
                </>
              )}

              <Button variant="danger" onClick={handleLogout} style={{ width: '100%', marginTop: 'var(--space-2)' }}>
                Log Out
              </Button>
            </div>
          ) : (
            <div style={{ borderTop: '1px solid var(--color-border-default)', paddingTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <Link to="/candidate/login" onClick={closeMobile} style={{ textDecoration: 'none' }}>
                <Button variant="secondary" style={{ width: '100%' }}>
                  Candidate Login
                </Button>
              </Link>
              <Link to="/candidate/signup" onClick={closeMobile} style={{ textDecoration: 'none' }}>
                <Button variant="primary" style={{ width: '100%' }}>
                  Sign Up Free
                </Button>
              </Link>
              <Link
                to="/recruiter/login"
                onClick={closeMobile}
                style={{
                  textAlign: 'center',
                  padding: 'var(--space-3)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--color-brand-ink)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  textDecoration: 'none',
                  backgroundColor: 'var(--color-surface-sunken)',
                  borderRadius: 'var(--radius-md)',
                  marginTop: 'var(--space-1)',
                }}
              >
                <Building2 size={16} /> Employer / HR Sign In →
              </Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
};
