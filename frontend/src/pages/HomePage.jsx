import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building2,
  Bus,
  Utensils,
  Clock,
  PhoneCall,
  MessageSquare,
  AlertTriangle,
  Users,
  Wrench,
  Factory,
  CheckCircle,
} from 'lucide-react';
import { jobService } from '../services/api';
import { JobCard } from '../components/jobs/JobCard';
import { Button, Spinner, AlertBanner } from '../components/common/UIComponents';
import { animateHero, animateStaggerCards } from '../utils/gsapAnimations';

export const HomePage = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const featuredJobsRef = useRef(null);
  const [keyword, setKeyword] = useState('');
  const [area, setArea] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // GSAP Hero Entrance
  useEffect(() => {
    const revertHero = animateHero(heroRef);
    return () => {
      if (revertHero) revertHero();
    };
  }, []);

  // GSAP Featured Jobs Stagger Reveal
  useEffect(() => {
    if (featuredJobs.length > 0 && featuredJobsRef.current) {
      animateStaggerCards('.featured-job-item', featuredJobsRef);
    }
  }, [featuredJobs]);

  useEffect(() => {
    jobService.getJobs({ page_size: 6 })
      .then((res) => {
        setFeaturedJobs(res.data?.results || []);
      })
      .catch(() => {
        setError('Could not connect to the jobs server. Please ensure backend is running.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.append('search', keyword);
    if (area) params.append('area', area);
    navigate(`/jobs?${params.toString()}`);
  };

  const handleFacilityFilter = (filterKey, filterValue) => {
    navigate(`/jobs?${filterKey}=${encodeURIComponent(filterValue)}`);
  };

  const topCompanies = [
    'Tata Motors Vendors',
    'Bajaj Auto Supply Chain',
    'Mahindra Suppliers',
    'Bharat Forge Hub',
    'Force Motors Plants',
    'Endurance Tech',
    'Varroc Engineering',
    'Bridgestone MIDC',
    'Gabriel India',
    'Minda Corporation',
  ];

  const popularRoles = [
    { title: 'CNC & VMC Operators / Setters', count: '45+ Jobs', salary: '₹18,000 - ₹32,000' },
    { title: 'ITI Welders (MIG / TIG / Arc)', count: '38+ Jobs', salary: '₹16,000 - ₹28,000' },
    { title: 'ITI Fitters & Turners', count: '29+ Jobs', salary: '₹15,000 - ₹26,000' },
    { title: 'Assembly Helpers & Loading', count: '52+ Jobs', salary: '₹14,000 - ₹22,000 + OT' },
    { title: 'Quality Inspectors & QA', count: '24+ Jobs', salary: '₹18,000 - ₹35,000' },
    { title: 'Maintenance Electricians', count: '19+ Jobs', salary: '₹17,000 - ₹30,000' },
    { title: 'Diploma Mechanical Engineers', count: '22+ Jobs', salary: '₹20,000 - ₹40,000' },
    { title: 'Store Keepers & Dispatch', count: '16+ Jobs', salary: '₹16,000 - ₹28,000' },
  ];

  return (
    <div>
      {/* 1. Industrial Hero Section */}
      <section
        ref={heroRef}
        className="industrial-grid-bg"
        style={{
          borderBottom: '2px solid var(--color-brand-gold-strong)',
          padding: 'var(--space-12) 0 var(--space-16)',
          position: 'relative',
          overflow: 'hidden',
          color: '#FFFFFF',
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '880px', margin: '0 auto', textAlign: 'center' }}>

            {/* Industrial Identity Badge */}
            <div
              className="hero-badge"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                backgroundColor: 'rgba(239, 184, 23, 0.12)',
                border: '1px solid rgba(239, 184, 23, 0.35)',
                padding: '6px 16px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#EFB817',
                marginBottom: 'var(--space-4)',
                letterSpacing: '0.03em',
              }}
            >
              <Factory size={15} color="#EFB817" />
              <span>DIRECT FACTORY HIRING • CHAKAN & TALEGAON MIDC • 0% COMMISSION</span>
            </div>

            {/* Main Headline */}
            <h1
              className="hero-title"
              style={{
                fontSize: 'clamp(2.1rem, 4vw, 3rem)',
                fontWeight: 800,
                lineHeight: 1.2,
                color: '#FFFFFF',
                marginBottom: 'var(--space-3)',
                letterSpacing: '-0.02em',
              }}
            >
              Direct Factory Hiring & Walk-In Interviews in{' '}
              <span style={{ color: '#EFB817', textDecoration: 'underline', textDecorationColor: '#EFB817' }}>
                Chakan MIDC
              </span>
            </h1>

            <p
              className="hero-subtitle"
              style={{
                fontSize: '1.0625rem',
                color: '#D1D5DB',
                marginBottom: 'var(--space-8)',
                lineHeight: 1.6,
                maxWidth: '740px',
                margin: '0 auto var(--space-8)',
              }}
            >
              Direct walk-in interviews with verified automotive OEMs, CNC/VMC machine shops, and engineering plants across Chakan, Talegaon, and Bhosari MIDC.
              <br />
              <strong style={{ color: '#EFB817' }}>Zero Agent Commission • 100% Free Applications • Direct Factory HR Contact</strong>
            </p>

            {/* Search Card */}
            <form
              onSubmit={handleSearch}
              className="hero-search-card"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-3)',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--space-3)',
                boxShadow: '0 20px 45px rgba(0, 0, 0, 0.35)',
                textAlign: 'left',
                border: '2px solid rgba(239, 184, 23, 0.6)',
              }}
            >
              <div
                style={{
                  flex: '1 1 260px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                }}
              >
                <Search size={20} color="#0A0733" />
                <input
                  type="text"
                  placeholder="Job title, CNC/VMC, ITI Welder, Helper, QA..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.9375rem',
                    color: '#0F172A',
                    backgroundColor: 'transparent',
                    fontWeight: 500,
                  }}
                />
              </div>

              <div
                style={{
                  flex: '1 1 220px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                }}
              >
                <MapPin size={20} color="#0A0733" />
                <input
                  type="text"
                  placeholder="Industrial Area (Phase 1, Phase 2, Nanekarwadi, Talegaon)..."
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.9375rem',
                    color: '#0F172A',
                    backgroundColor: 'transparent',
                    fontWeight: 500,
                  }}
                />
              </div>

              <Button
                type="submit"
                variant="accent"
                size="lg"
                style={{
                  flex: '0 0 auto',
                  fontWeight: 700,
                  padding: '12px 28px',
                  backgroundColor: '#EFB817',
                  color: '#0A0733',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Search size={18} /> Search Vacancies
              </Button>
            </form>

            {/* Quick Facility Filter Tags */}
            <div
              style={{
                marginTop: 'var(--space-5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-2)',
                flexWrap: 'wrap',
              }}
            >
              <span style={{ fontSize: '0.8125rem', color: '#B9C0C3', fontWeight: 600 }}>
                Quick Filters:
              </span>
              <button
                type="button"
                onClick={() => handleFacilityFilter('bus_available', 'true')}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '5px 12px',
                  fontSize: '0.78125rem',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Bus size={13} color="#EFB817" /> Company Bus Available
              </button>
              <button
                type="button"
                onClick={() => handleFacilityFilter('shift', 'DAY')}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '5px 12px',
                  fontSize: '0.78125rem',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Clock size={13} color="#EFB817" /> Day Shift Only
              </button>
              <button
                type="button"
                onClick={() => handleFacilityFilter('education', 'ITI')}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '5px 12px',
                  fontSize: '0.78125rem',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Wrench size={13} color="#EFB817" /> ITI Passed Jobs
              </button>
              <button
                type="button"
                onClick={() => navigate('/jobs?job_type=INDUSTRY')}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '5px 12px',
                  fontSize: '0.78125rem',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Factory size={13} color="#EFB817" /> Direct Factory Jobs
              </button>
            </div>

            {/* Live Trust Metrics Strip */}
            <div
              style={{
                marginTop: 'var(--space-8)',
                paddingTop: 'var(--space-6)',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: 'var(--space-4)',
                textAlign: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#EFB817', fontFamily: 'var(--font-display)' }}>140+</div>
                <div style={{ fontSize: '0.8125rem', color: '#B9C0C3' }}>Verified Factories & OEMs</div>
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#EFB817', fontFamily: 'var(--font-display)' }}>450+</div>
                <div style={{ fontSize: '0.8125rem', color: '#B9C0C3' }}>Active Factory Openings</div>
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#22C55E', fontFamily: 'var(--font-display)' }}>₹0</div>
                <div style={{ fontSize: '0.8125rem', color: '#B9C0C3' }}>100% Free / Zero Agent Fee</div>
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#EFB817', fontFamily: 'var(--font-display)' }}>Daily</div>
                <div style={{ fontSize: '0.8125rem', color: '#B9C0C3' }}>Direct Gate Interviews</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Top MIDC Companies Marquee */}
      <section
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--color-border-default)',
          padding: 'var(--space-4) 0',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-4)',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                fontSize: '0.78125rem',
                fontWeight: 700,
                color: 'var(--color-brand-ink)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Building2 size={16} color="var(--color-brand-gold-strong)" />
              <span>Top Manufacturing Plants in Chakan & Talegaon MIDC:</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                flexWrap: 'wrap',
              }}
            >
              {topCompanies.map((c) => (
                <span
                  key={c}
                  style={{
                    backgroundColor: 'var(--color-surface-subtle)',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--color-brand-ink)',
                    border: '1px solid var(--color-border-default)',
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Anti-Fraud & Worker Safety Notice */}
      <section style={{ padding: 'var(--space-8) 0 var(--space-4)' }}>
        <div className="container">
          <div
            style={{
              background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
              border: '2px solid #F59E0B',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-6)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-6)',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#D97706',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(217, 119, 6, 0.3)',
              }}
            >
              <AlertTriangle size={32} />
            </div>

            <div style={{ flex: '1 1 320px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ backgroundColor: '#B45309', color: '#FFFFFF', fontSize: '0.6875rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                  Important Notice
                </span>
                <h3 style={{ fontSize: '1.25rem', color: '#78350F', margin: 0 }}>
                  Beware of Fake Job Agents • Direct Factory Gate Hiring
                </h3>
              </div>
              <p style={{ color: '#92400E', fontSize: '0.875rem', margin: 0, lineHeight: 1.5 }}>
                All job applications on Chakan Jobs are strictly <strong>100% Free</strong>. Never pay money to any job agent, consultant, or third party claiming to provide factory job letters.
                All candidate interviews are conducted directly at the official factory gate by verified HR managers.
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                borderLeft: '2px solid rgba(217, 119, 6, 0.25)',
                paddingLeft: 'var(--space-6)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: '#78350F', fontWeight: 600 }}>
                <CheckCircle size={15} color="#15803D" /> Direct Factory HR Phone & WhatsApp
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: '#78350F', fontWeight: 600 }}>
                <CheckCircle size={15} color="#15803D" /> Official PF, ESIC & Overtime (OT) Records
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: '#78350F', fontWeight: 600 }}>
                <CheckCircle size={15} color="#15803D" /> 0% Brokerage / Zero Registration Fee
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Popular Job Categories in Chakan */}
      <section style={{ backgroundColor: '#F8FAFC', padding: 'var(--space-12) 0', borderTop: '1px solid var(--color-border-default)', borderBottom: '1px solid var(--color-border-default)' }}>
        <div className="container">
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '4px' }}>Top Industrial Roles & Salary Benchmarks</h2>
            <p style={{ margin: 0 }}>
              Average in-hand salary packages, overtime benefits, and active vacancies for factory roles.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 'var(--space-4)',
            }}
          >
            {popularRoles.map((role) => (
              <div
                key={role.title}
                className="role-pill-card"
                onClick={() => navigate(`/jobs?search=${encodeURIComponent(role.title.split(' ')[0])}`)}
              >
                <div style={{ fontWeight: 700, color: 'var(--color-brand-ink)', fontSize: '0.9375rem', marginBottom: '4px' }}>
                  {role.title}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78125rem' }}>
                  <span style={{ color: 'var(--color-state-success)', fontWeight: 600 }}>{role.salary}</span>
                  <span style={{ color: 'var(--color-text-muted)' }}>{role.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Featured / Latest Jobs Section */}
      <section style={{ padding: 'var(--space-16) 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-8)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="pulse-dot" />
                <h2 style={{ margin: 0, fontSize: '1.75rem' }}>Latest Factory Vacancies Added Today</h2>
              </div>
              <p style={{ margin: 0 }}>Official industrial openings posted directly by verified factory HR managers.</p>
            </div>
            <Link to="/jobs">
              <Button variant="secondary" size="sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>View All Vacancies</span>
                <ArrowRight size={14} />
              </Button>
            </Link>
          </div>

          {error && <AlertBanner type="error" message={error} />}

          {loading ? (
            <Spinner />
          ) : featuredJobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-12) 0', color: 'var(--color-text-secondary)' }}>
              No active vacancies currently found. Please check back shortly.
            </div>
          ) : (
            <div
              ref={featuredJobsRef}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 'var(--space-6)',
              }}
            >
              {featuredJobs.map((job) => (
                <div key={job.id} className="featured-job-item">
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 7. Real Worker Testimonials from Chakan MIDC */}
      <section style={{ backgroundColor: '#0A0733', color: '#FFFFFF', padding: 'var(--space-16) 0', position: 'relative' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto var(--space-12)' }}>
            <div
              style={{
                color: '#EFB817',
                fontSize: '0.8125rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 'var(--space-2)',
              }}
            >
              Verified Worker Stories • Chakan & Talegaon MIDC
            </div>
            <h2 style={{ color: '#FFFFFF', fontSize: '2rem', marginBottom: 'var(--space-3)' }}>
              Trusted by Industrial Workers Across Chakan
            </h2>
            <p style={{ color: '#B9C0C3', margin: 0 }}>
              Real feedback from technicians, operators, and fitters hired directly without paying agent commissions.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 'var(--space-6)',
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-6)',
              }}
            >
              <div style={{ color: '#EFB817', fontSize: '1.25rem', marginBottom: 'var(--space-3)' }}>★★★★★</div>
              <p style={{ color: '#E2E8F0', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: 'var(--space-4)' }}>
                "I applied directly to an automotive Tier-1 supplier in Nanekarwadi. The HR manager called me the same afternoon for a gate interview. Didn't pay a single rupee to any consultant."
              </p>
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: 'var(--space-3)' }}>
                <strong style={{ color: '#FFFFFF', display: 'block' }}>Sachin Kadam</strong>
                <span style={{ fontSize: '0.78125rem', color: '#EFB817' }}>CNC Machine Operator • Nanekarwadi</span>
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-6)',
              }}
            >
              <div style={{ color: '#EFB817', fontSize: '1.25rem', marginBottom: 'var(--space-3)' }}>★★★★★</div>
              <p style={{ color: '#E2E8F0', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: 'var(--space-4)' }}>
                "Found a welding position with company bus pickup from Bhosari to Chakan Phase 2. Canteen and PF deductions are credited accurately every month."
              </p>
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: 'var(--space-3)' }}>
                <strong style={{ color: '#FFFFFF', display: 'block' }}>Dnyaneshwar More</strong>
                <span style={{ fontSize: '0.78125rem', color: '#EFB817' }}>MIG Welder • Chakan Phase 2</span>
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-6)',
              }}
            >
              <div style={{ color: '#EFB817', fontSize: '1.25rem', marginBottom: 'var(--space-3)' }}>★★★★★</div>
              <p style={{ color: '#E2E8F0', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: 'var(--space-4)' }}>
                "Got placed as a Quality QA technician in Talegaon right after completing my Diploma Mechanical. Shift timings and salary were completely transparent from day one."
              </p>
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: 'var(--space-3)' }}>
                <strong style={{ color: '#FFFFFF', display: 'block' }}>Pooja Shinde</strong>
                <span style={{ fontSize: '0.78125rem', color: '#EFB817' }}>Quality Inspector • Talegaon MIDC</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Recruiter CTA Bar */}
      <section style={{ backgroundColor: '#EFB817', padding: 'var(--space-10) 0' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--space-6)',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <span style={{ backgroundColor: '#0A0733', color: '#EFB817', fontSize: '0.75rem', fontWeight: 800, padding: '3px 10px', borderRadius: '4px' }}>
                For Factory Owners & HR Managers
              </span>
              <h3 style={{ fontSize: '1.625rem', color: '#0A0733', margin: '6px 0' }}>
                Need Skilled Technicians & Operators for Your Plant?
              </h3>
              <p style={{ color: '#332E00', margin: 0, fontSize: '0.9375rem' }}>
                Connect directly with pre-screened CNC operators, ITI fitters, welders, and helpers across Chakan & Talegaon in under 24 hours.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              <Link to="/recruiter/jobs/new" style={{ textDecoration: 'none' }}>
                <Button
                  variant="primary"
                  size="lg"
                  style={{
                    backgroundColor: '#0A0733',
                    color: '#FFFFFF',
                    fontWeight: 700,
                  }}
                >
                  Post Factory Vacancy Free
                </Button>
              </Link>
              <Link to="/recruiter/login" style={{ textDecoration: 'none' }}>
                <Button
                  variant="secondary"
                  size="lg"
                  style={{
                    borderColor: '#0A0733',
                    color: '#0A0733',
                    fontWeight: 700,
                  }}
                >
                  Employer / HR Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
