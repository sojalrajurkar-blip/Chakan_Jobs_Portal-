import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import { jobService } from '../services/api';
import { JobCard } from '../components/jobs/JobCard';
import { Button, Spinner, AlertBanner, EmptyState } from '../components/common/UIComponents';

export const JobSearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const currentSearch = searchParams.get('search') || '';
  const currentArea = searchParams.get('area') || '';
  const currentShift = searchParams.get('shift') || '';
  const currentJobType = searchParams.get('job_type') || '';
  const currentEducation = searchParams.get('education') || '';
  const currentMinSalary = searchParams.get('min_salary') || '';

  useEffect(() => {
    jobService.getFilters().then((res) => setFilters(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = Object.fromEntries(searchParams.entries());
    jobService.getJobs(params)
      .then((res) => {
        setJobs(res.data?.results || []);
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
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="container" style={{ padding: 'var(--space-8) 0' }}>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: '1.875rem', marginBottom: 'var(--space-2)' }}>Browse Industrial Jobs</h1>
        <p>Explore verified openings across Chakan MIDC and surrounding engineering clusters.</p>
      </div>

      {error && <AlertBanner type="error" message={error} />}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 'var(--space-8)' }} className="search-layout">
        {/* Main Jobs Listing */}
        <div>
          {loading ? (
            <Spinner />
          ) : jobs.length === 0 ? (
            <EmptyState
              title="No Jobs Matched Your Filters"
              description="Try broadening your search keyword, selecting a different industrial area, or clearing filters."
              actionText="Clear Filters"
              onAction={clearAllFilters}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
