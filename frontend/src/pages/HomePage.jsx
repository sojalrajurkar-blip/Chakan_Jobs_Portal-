import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, Building2, CheckCircle2, ArrowRight } from 'lucide-react';
import { jobService } from '../services/api';
import { JobCard } from '../components/jobs/JobCard';
import { Button, Spinner, AlertBanner } from '../components/common/UIComponents';

export const HomePage = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [area, setArea] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    jobService.getJobs({ page_size: 4 })
      .then((res) => {
        setFeaturedJobs(res.data?.results || []);
      })
      .catch((err) => {
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

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          backgroundColor: 'var(--color-brand-sage-light)',
          borderBottom: '1px solid var(--color-border-default)',
          padding: 'var(--space-16) 0 var(--space-20)',
          position: 'relative',
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                backgroundColor: 'var(--color-surface-card)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--color-brand-ink)',
                border: '1px solid var(--color-border-default)',
                marginBottom: 'var(--space-4)',
              }}
            >
              <CheckCircle2 size={16} color="var(--color-state-success)" />
              <span>Chakan Industrial Zone Dedicated Job Portal</span>
            </div>

            <h1 style={{ marginBottom: 'var(--space-4)', color: 'var(--color-brand-ink)' }}>
              Find Your Next Manufacturing & Industrial Job in <span style={{ color: 'var(--color-brand-gold-strong)' }}>Chakan MIDC</span>
            </h1>

            <p style={{ fontSize: '1.125rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-8)' }}>
              Direct connections between local candidates and automotive OEMs, Tier-1 vendors, fabrication units, and ITI/engineering machine shops.
            </p>

            {/* Main Search Panel */}
            <form
              onSubmit={handleSearch}
              className="card"
              style={{
                padding: 'var(--space-4)',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--space-3)',
                boxShadow: 'var(--shadow-popover)',
                textAlign: 'left',
              }}
            >
              <div style={{ flex: '1 1 240px', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', borderRight: '1px solid var(--color-border-default)', paddingRight: 'var(--space-3)' }}>
                <Search size={20} color="var(--color-brand-purple)" />
                <input
                  type="text"
                  placeholder="Job title, skill, or CNC machine..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9375rem' }}
                />
              </div>

              <div style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <MapPin size={20} color="var(--color-brand-purple)" />
                <input
                  type="text"
                  placeholder="Area (e.g. Phase 2, Kuruli, Nanekarwadi)"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9375rem' }}
                />
              </div>

              <Button type="submit" variant="primary" size="lg" style={{ flex: '0 0 auto' }}>
                Search Jobs
              </Button>
            </form>

            {/* Quick Area Tags */}
            <div style={{ marginTop: 'var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Popular Areas:</span>
              {['MIDC Phase 1', 'MIDC Phase 2', 'MIDC Phase 3', 'Nanekarwadi', 'Kuruli', 'Chakan-Talegaon Rd'].map((areaName) => (
                <button
                  key={areaName}
                  type="button"
                  onClick={() => navigate(`/jobs?area=${encodeURIComponent(areaName)}`)}
                  style={{
                    backgroundColor: 'var(--color-surface-card)',
                    border: '1px solid var(--color-border-default)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '3px 10px',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    color: 'var(--color-brand-ink)',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-brand-purple)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border-default)'; }}
                >
                  {areaName}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section style={{ padding: 'var(--space-16) 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-8)' }}>
            <div>
              <h2 style={{ marginBottom: 'var(--space-2)' }}>Latest Job Openings</h2>
              <p>Fresh factory, CNC, inspection, and assembly positions added today.</p>
            </div>
            <Link to="/jobs">
              <Button variant="secondary" size="sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>View All Jobs</span>
                <ArrowRight size={14} />
              </Button>
            </Link>
          </div>

          {error && <AlertBanner type="error" message={error} />}

          {loading ? (
            <Spinner />
          ) : featuredJobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-12) 0', color: 'var(--color-text-secondary)' }}>
              No active jobs published at this moment. Recruiters can post vacancies using the "Post a Job" button above.
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 'var(--space-6)',
              }}
            >
              {featuredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
