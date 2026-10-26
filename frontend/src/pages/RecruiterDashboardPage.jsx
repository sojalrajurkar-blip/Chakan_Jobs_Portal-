import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Briefcase, Users, Clock, Trash2, Edit, ExternalLink, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { recruiterService } from '../services/api';
import { Button, Badge, Spinner, AlertBanner, EmptyState } from '../components/common/UIComponents';

export const RecruiterDashboardPage = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/recruiter/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      recruiterService.getDashboardSummary(),
      recruiterService.getJobs({ page_size: 20 }),
    ])
      .then(([summaryRes, jobsRes]) => {
        setSummary(summaryRes.data);
        setMyJobs(jobsRes.data?.results || []);
      })
      .catch((err) => {
        setError('Failed to load recruiter dashboard metrics.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleDeleteJob = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This will also remove associated candidate records.`)) {
      return;
    }
    setDeletingId(id);
    try {
      await recruiterService.deleteJob(id);
      loadData();
    } catch {
      alert('Could not delete job. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  if (authLoading || loading) return <Spinner />;

  return (
    <div className="container" style={{ padding: 'var(--space-8) 0' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '4px' }}>Employer Dashboard</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Welcome back, <strong>{user?.company_name || user?.username}</strong> ({user?.position || 'Recruiter'})
          </p>
        </div>
        <Link to="/recruiter/jobs/new">
          <Button variant="accent" size="lg" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlusCircle size={18} /> Post New Vacancy
          </Button>
        </Link>
      </div>

      {error && <AlertBanner type="error" message={error} />}

      {/* Metrics Row */}
      {summary && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-8)',
          }}
        >
          <div className="card" style={{ padding: 'var(--space-5)' }}>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
              ACTIVE JOBS
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-brand-ink)' }}>
              {summary.active_jobs}
            </div>
          </div>

          <div className="card" style={{ padding: 'var(--space-5)' }}>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
              TOTAL APPLICATIONS
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-state-success)' }}>
              {summary.total_applications}
            </div>
          </div>

          <div className="card" style={{ padding: 'var(--space-5)' }}>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
              PENDING REVIEWS
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-brand-gold-strong)' }}>
              {summary.pending_reviews}
            </div>
          </div>

          <div className="card" style={{ padding: 'var(--space-5)' }}>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
              SHORTLISTED
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-brand-purple)' }}>
              {summary.shortlisted_count || 0}
            </div>
          </div>
        </div>
      )}

      {/* Manage Vacancies Table */}
      <div className="card" style={{ padding: 'var(--space-6)' }}>
        <h3 style={{ marginBottom: 'var(--space-4)' }}>Your Active Job Postings</h3>

        {myJobs.length === 0 ? (
          <EmptyState
            title="No Jobs Posted Yet"
            description="You haven't posted any job vacancies yet. Click the button below to publish your first hiring opening."
            actionText="Create First Job Post"
            onAction={() => navigate('/recruiter/jobs/new')}
            icon={Briefcase}
          />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border-default)', color: 'var(--color-text-secondary)' }}>
                  <th style={{ padding: 'var(--space-3)' }}>JOB TITLE</th>
                  <th style={{ padding: 'var(--space-3)' }}>AREA</th>
                  <th style={{ padding: 'var(--space-3)' }}>SHIFT / TYPE</th>
                  <th style={{ padding: 'var(--space-3)' }}>STATUS</th>
                  <th style={{ padding: 'var(--space-3)' }}>APPLICANTS</th>
                  <th style={{ padding: 'var(--space-3)', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {myJobs.map((job) => (
                  <tr key={job.id} style={{ borderBottom: '1px solid var(--color-surface-subtle)' }}>
                    <td style={{ padding: 'var(--space-4) var(--space-3)', fontWeight: 600, color: 'var(--color-brand-ink)' }}>
                      <Link to={`/jobs/${job.id}`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{job.title}</span>
                        <ExternalLink size={14} color="var(--color-text-muted)" />
                      </Link>
                    </td>
                    <td style={{ padding: 'var(--space-4) var(--space-3)', color: 'var(--color-text-secondary)' }}>
                      {job.area}
                    </td>
                    <td style={{ padding: 'var(--space-4) var(--space-3)' }}>
                      <Badge variant="sage">{job.shift_display || job.shift}</Badge>
                    </td>
                    <td style={{ padding: 'var(--space-4) var(--space-3)' }}>
                      <Badge variant={job.status === 'ACTIVE' ? 'success' : 'error'}>
                        {job.status}
                      </Badge>
                    </td>
                    <td style={{ padding: 'var(--space-4) var(--space-3)' }}>
                      <Link to={`/recruiter/jobs/${job.id}/applicants`}>
                        <Button variant="secondary" size="sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Users size={14} /> View Applicants
                        </Button>
                      </Link>
                    </td>
                    <td style={{ padding: 'var(--space-4) var(--space-3)', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 'var(--space-2)' }}>
                        <Link to={`/recruiter/jobs/${job.id}/edit`}>
                          <Button variant="ghost" size="sm" title="Edit Job">
                            <Edit size={16} />
                          </Button>
                        </Link>
                        <Button
                          variant="danger"
                          size="sm"
                          title="Delete Job"
                          isLoading={deletingId === job.id}
                          onClick={() => handleDeleteJob(job.id, job.title)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
