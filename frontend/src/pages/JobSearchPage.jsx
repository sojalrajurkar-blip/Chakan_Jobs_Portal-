import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, MapPin, IndianRupee, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { jobService } from '../services/api';
import { JobCard } from '../components/jobs/JobCard';
import { Button, Spinner, AlertBanner, EmptyState, Badge } from '../components/common/UIComponents';

export const JobSearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtersData, setFiltersData] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Filter state values from URL params
  const currentSearch = searchParams.get('search') || '';
  const currentArea = searchParams.get('area') || '';
  const currentShift = searchParams.get('shift') || '';
  const currentJobType = searchParams.get('job_type') || '';
  const currentEducation = searchParams.get('education') || '';
  const currentExperience = searchParams.get('experience') || '';
  const currentMinSalary = searchParams.get('min_salary') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Local search text for smooth typing
  const [searchInput, setSearchInput] = useState(currentSearch);

  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  useEffect(() => {
    jobService.getFilters().then((res) => setFiltersData(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = Object.fromEntries(searchParams.entries());
    jobService.getJobs(params)
      .then((res) => {
        setJobs(res.data?.results || []);
        setTotalCount(res.data?.count || (res.data?.results ? res.data.results.length : 0));
        setHasNext(Boolean(res.data?.next));
        setHasPrev(Boolean(res.data?.previous));
      })
      .catch((err) => {
        setError('Failed to load jobs. Please check network connection.');
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.delete('page'); // Reset to page 1 on filter change
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', searchInput.trim());
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    if (newPage > 1) {
      newParams.set('page', newPage.toString());
    } else {
      newParams.delete('page');
    }
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const activeFilterCount = [
    currentSearch,
    currentArea,
    currentShift,
    currentJobType,
    currentEducation,
    currentExperience,
    currentMinSalary,
  ].filter(Boolean).length;

  return (
    <div className="container" style={{ padding: 'var(--space-8) 0 var(--space-16)' }}>
      {/* Header & Search Bar */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: '1.875rem', marginBottom: 'var(--space-2)' }}>
          Manufacturing & Industrial Jobs in Chakan
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
          Browse verified plant vacancies, CNC operator jobs, ITI openings, and factory positions in Pune.
        </p>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: 'var(--space-2)', maxWidth: '640px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search
              size={18}
              color="var(--color-text-muted)"
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search by job title, skill (e.g. CNC, ITI, VMC)..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '40px' }}
            />
          </div>
          <Button type="submit" variant="primary">Search</Button>
          {/* Mobile Filter Toggle */}
          <Button
            type="button"
            variant="secondary"
            onClick={() => setMobileDrawerOpen(true)}
            className="mobile-filter-btn"
            style={{ display: 'none' }}
          >
            <Filter size={16} />
            <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
          </Button>
        </form>
      </div>

      {/* Active Filter Chips */}
      {activeFilterCount > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
            Active Filters:
          </span>

          {currentSearch && (
            <Badge variant="sage" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span>Search: "{currentSearch}"</span>
              <X size={12} style={{ cursor: 'pointer' }} onClick={() => updateParam('search', '')} />
            </Badge>
          )}

          {currentArea && (
            <Badge variant="sage" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span>Area: {currentArea}</span>
              <X size={12} style={{ cursor: 'pointer' }} onClick={() => updateParam('area', '')} />
            </Badge>
          )}

          {currentShift && (
            <Badge variant="sage" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span>Shift: {currentShift}</span>
              <X size={12} style={{ cursor: 'pointer' }} onClick={() => updateParam('shift', '')} />
            </Badge>
          )}

          {currentEducation && (
            <Badge variant="sage" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span>Edu: {currentEducation}</span>
              <X size={12} style={{ cursor: 'pointer' }} onClick={() => updateParam('education', '')} />
            </Badge>
          )}

          {currentMinSalary && (
            <Badge variant="sage" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span>Salary ≥ ₹{parseInt(currentMinSalary, 10).toLocaleString('en-IN')}</span>
              <X size={12} style={{ cursor: 'pointer' }} onClick={() => updateParam('min_salary', '')} />
            </Badge>
          )}

          <button
            onClick={clearAllFilters}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-brand-ink)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline',
              marginLeft: 'var(--space-2)',
            }}
          >
            Clear All
          </button>
        </div>
      )}

      {error && <AlertBanner type="error" message={error} />}

      {/* Main Content Layout: Sidebar + Listings */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px minmax(0, 1fr)', gap: 'var(--space-8)' }} className="search-grid">
        {/* Desktop Filter Sidebar */}
        <aside className="filter-sidebar">
          <div className="card" style={{ padding: 'var(--space-6)', position: 'sticky', top: '96px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
              <h3 style={{ fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Filter size={18} /> Filters
              </h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', fontSize: '0.8125rem', cursor: 'pointer' }}
                >
                  Reset
                </button>
              )}
            </div>

            {/* Filter: Area */}
            <div className="form-group" style={{ marginBottom: 'var(--space-5)' }}>
              <label className="form-label">Industrial Area</label>
              <select
                value={currentArea}
                onChange={(e) => updateParam('area', e.target.value)}
                className="form-select"
              >
                <option value="all">All Chakan Areas</option>
                {filtersData?.areas?.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            {/* Filter: Shift */}
            <div className="form-group" style={{ marginBottom: 'var(--space-5)' }}>
              <label className="form-label">Shift Timing</label>
              <select
                value={currentShift}
                onChange={(e) => updateParam('shift', e.target.value)}
                className="form-select"
              >
                <option value="all">Any Shift</option>
                {filtersData?.shifts?.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* Filter: Min Education */}
            <div className="form-group" style={{ marginBottom: 'var(--space-5)' }}>
              <label className="form-label">Minimum Education</label>
              <select
                value={currentEducation}
                onChange={(e) => updateParam('education', e.target.value)}
                className="form-select"
              >
                <option value="all">Any Education</option>
                {filtersData?.education_levels?.map((e) => (
                  <option key={e.value} value={e.value}>{e.label}</option>
                ))}
              </select>
            </div>

            {/* Filter: Experience */}
            <div className="form-group" style={{ marginBottom: 'var(--space-5)' }}>
              <label className="form-label">Experience Required</label>
              <select
                value={currentExperience}
                onChange={(e) => updateParam('experience', e.target.value)}
                className="form-select"
              >
                <option value="all">Any Experience</option>
                {filtersData?.experience_levels?.map((exp) => (
                  <option key={exp.value} value={exp.value}>{exp.label}</option>
                ))}
              </select>
            </div>

            {/* Filter: Min Salary */}
            <div className="form-group">
              <label className="form-label">Min Salary (₹/month)</label>
              <select
                value={currentMinSalary}
                onChange={(e) => updateParam('min_salary', e.target.value)}
                className="form-select"
              >
                <option value="all">Any Salary</option>
                <option value="12000">₹12,000+ / mo</option>
                <option value="15000">₹15,000+ / mo</option>
                <option value="18000">₹18,000+ / mo</option>
                <option value="22000">₹22,000+ / mo</option>
                <option value="25000">₹25,000+ / mo</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Listings Section */}
        <main>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <div style={{ fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
              Showing <strong>{jobs.length}</strong> of <strong>{totalCount}</strong> published vacancies
            </div>
          </div>

          {loading ? (
            <Spinner />
          ) : jobs.length === 0 ? (
            <EmptyState
              title="No Jobs Found"
              description="No active openings matched your current filter selection. Try removing some filters or searching for a different keyword."
              actionText="Reset All Filters"
              onAction={clearAllFilters}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}

              {/* Pagination bar */}
              {(hasNext || hasPrev) && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'var(--space-4)', marginTop: 'var(--space-6)' }}>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={!hasPrev}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    <ChevronLeft size={16} /> Previous Page
                  </Button>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Page {currentPage}</span>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={!hasNext}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next Page <ChevronRight size={16} />
                  </Button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileDrawerOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(10, 7, 51, 0.5)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
          onClick={() => setMobileDrawerOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '340px',
              height: '100%',
              backgroundColor: 'var(--color-surface-card)',
              padding: 'var(--space-6)',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                <h3>Filter Vacancies</h3>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Mobile Area Filter */}
              <div className="form-group">
                <label className="form-label">Industrial Area</label>
                <select
                  value={currentArea}
                  onChange={(e) => updateParam('area', e.target.value)}
                  className="form-select"
                >
                  <option value="all">All Chakan Areas</option>
                  {filtersData?.areas?.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              {/* Mobile Shift Filter */}
              <div className="form-group">
                <label className="form-label">Shift</label>
                <select
                  value={currentShift}
                  onChange={(e) => updateParam('shift', e.target.value)}
                  className="form-select"
                >
                  <option value="all">Any Shift</option>
                  {filtersData?.shifts?.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              {/* Mobile Education Filter */}
              <div className="form-group">
                <label className="form-label">Minimum Education</label>
                <select
                  value={currentEducation}
                  onChange={(e) => updateParam('education', e.target.value)}
                  className="form-select"
                >
                  <option value="all">Any Education</option>
                  {filtersData?.education_levels?.map((e) => (
                    <option key={e.value} value={e.value}>{e.label}</option>
                  ))}
                </select>
              </div>

              {/* Mobile Min Salary */}
              <div className="form-group">
                <label className="form-label">Min Salary</label>
                <select
                  value={currentMinSalary}
                  onChange={(e) => updateParam('min_salary', e.target.value)}
                  className="form-select"
                >
                  <option value="all">Any Salary</option>
                  <option value="12000">₹12,000+ / mo</option>
                  <option value="15000">₹15,000+ / mo</option>
                  <option value="18000">₹18,000+ / mo</option>
                  <option value="22000">₹22,000+ / mo</option>
                  <option value="25000">₹25,000+ / mo</option>
                </select>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={() => setMobileDrawerOpen(false)}
              style={{ width: '100%', marginTop: 'var(--space-6)' }}
            >
              Apply Filters ({jobs.length} Results)
            </Button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .search-grid {
            grid-template-columns: 1fr !important;
          }
          .filter-sidebar {
            display: none !important;
          }
          .mobile-filter-btn {
            display: inline-flex !important;
          }
        }
      `}</style>
    </div>
  );
};
