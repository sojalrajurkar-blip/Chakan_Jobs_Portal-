import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  IndianRupee,
  FileText,
  Clock,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { candidateService } from '../services/api';
import { Button, Spinner, AlertBanner } from '../components/common/UIComponents';

export const CandidateApplicationsPage = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/candidate/login', {
        state: { from: { pathname: '/candidate/applications' } },
        replace: true,
      });
      return;
    }

    if (isAuthenticated) {
      fetchApplications();
    }
  }, [isAuthenticated, authLoading, navigate]);

  const fetchApplications = () => {
    setLoading(true);
    candidateService.getMyApplications()
      .then((res) => {
        if (res.data?.success) {
          setApplications(res.data.results || []);
        }
      })
      .catch(() => {
        setError('Failed to load your submitted applications. Please refresh and try again.');
      })
      .finally(() => setLoading(false));
  };

  const getStatusBadge = (status, statusDisplay) => {
    switch (status) {
      case 'SUBMITTED':
        return {
          bg: 'var(--color-status-info-bg)',
          color: 'var(--color-status-info)',
          label: 'Submitted',
        };
      case 'REVIEWING':
        return {
          bg: 'var(--color-status-warning-bg)',
          color: 'var(--color-status-warning)',
          label: 'In Review',
        };
      case 'SHORTLISTED':
        return {
          bg: '#ede9fe',
          color: '#6b21a8',
          label: 'Shortlisted',
        };
      case 'HIRED':
        return {
          bg: 'var(--color-status-success-bg)',
          color: 'var(--color-status-success)',
          label: 'Hired',
        };
      case 'REJECTED':
        return {
          bg: 'var(--color-status-danger-bg)',
          color: 'var(--color-status-danger)',
          label: 'Rejected',
        };
      default:
        return {
          bg: 'var(--color-surface-sunken)',
          color: 'var(--color-text-secondary)',
          label: statusDisplay || status,
        };
    }
  };

  if (authLoading || (loading && applications.length === 0)) {
    return (
      <div style={{ padding: 'var(--space-12) 0', textAlign: 'center' }}>
        <Spinner size="lg" />
        <p style={{ marginTop: 'var(--space-4)', color: 'var(--color-text-secondary)' }}>
          Loading your job applications...
        </p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--color-surface-bg)', minHeight: 'calc(100vh - 72px)', padding: 'var(--space-8) 0' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Header Title Banner */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-8)',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '1.875rem',
                fontWeight: 800,
                color: 'var(--color-brand-ink)',
                margin: '0 0 var(--space-2) 0',
                fontFamily: 'var(--font-display)',
              }}
            >
              My Job Applications
            </h1>
            <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
              Candidate: <strong>{user?.full_name || user?.username}</strong> ({user?.mobile_number})
            </p>
          </div>

          <Link to="/jobs" style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="md" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Briefcase size={18} /> Browse Vacancies
            </Button>
          </Link>
        </div>

        {error && (
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <AlertBanner variant="danger" title="Error" message={error} />
          </div>
        )}

        {/* Applications List */}
        {applications.length === 0 ? (
          <div
            className="card"
            style={{
              textAlign: 'center',
              padding: 'var(--space-12) var(--space-6)',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--color-surface-card)',
              border: '1px dashed var(--color-border-default)',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-brand-sage)',
                color: 'var(--color-brand-ink)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--space-4)',
              }}
            >
              <Briefcase size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 var(--space-2) 0', color: 'var(--color-brand-ink)' }}>
              You haven't submitted any job applications yet
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: '480px', margin: '0 auto var(--space-6) auto' }}>
              Explore active job openings across Chakan & Talegaon MIDC for operators, fitters, welders, supervisors, and office roles.
            </p>
            <Link to="/jobs" style={{ textDecoration: 'none' }}>
              <Button variant="primary" size="lg">
                Explore Available Jobs
              </Button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
              Total Applications: {applications.length}
            </div>

            {applications.map((app) => {
              const badge = getStatusBadge(app.status, app.status_display);
              const formattedDate = new Date(app.submitted_at).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={app.id}
                  className="card"
                  style={{
                    padding: 'var(--space-5)',
                    backgroundColor: 'var(--color-surface-card)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border-default)',
                    boxShadow: 'var(--shadow-subtle)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: 'var(--space-3)',
                      marginBottom: 'var(--space-3)',
                    }}
                  >
                    <div>
                      <Link
                        to={`/jobs/${app.job_id}`}
                        style={{
                          textDecoration: 'none',
                          color: 'var(--color-brand-ink)',
                        }}
                      >
                        <h3
                          style={{
                            fontSize: '1.2rem',
                            fontWeight: 700,
                            margin: '0 0 var(--space-1) 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          {app.job_title}
                          <ExternalLink size={16} style={{ color: 'var(--color-text-muted)' }} />
                        </h3>
                      </Link>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-2)',
                          color: 'var(--color-text-secondary)',
                          fontSize: '0.9375rem',
                          fontWeight: 500,
                        }}
                      >
                        <Building2 size={16} /> {app.company_name}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      style={{
                        backgroundColor: badge.bg,
                        color: badge.color,
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        letterSpacing: '0.02em',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: badge.color,
                        }}
                      />
                      {badge.label}
                    </span>
                  </div>

                  {/* Details Bar */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 'var(--space-4)',
                      padding: 'var(--space-3) 0',
                      borderTop: '1px solid var(--color-border-subtle)',
                      borderBottom: '1px solid var(--color-border-subtle)',
                      margin: 'var(--space-3) 0',
                      fontSize: '0.875rem',
                      color: 'var(--color-brand-ink)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={15} style={{ color: 'var(--color-text-muted)' }} />
                      <span>{app.area}</span>
                    </div>

                    {(app.min_salary > 0 || app.max_salary > 0) && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <IndianRupee size={15} style={{ color: 'var(--color-text-muted)' }} />
                        <span>
                          ₹{app.min_salary?.toLocaleString()} - ₹{app.max_salary?.toLocaleString()} / month
                        </span>
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={15} style={{ color: 'var(--color-text-muted)' }} />
                      <span>Applied on: {formattedDate}</span>
                    </div>
                  </div>

                  {/* Footer actions & resume info */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 'var(--space-3)',
                    }}
                  >
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                      Application Details: {app.full_name} ({app.mobile_number}) • {app.qualification}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      {app.resume_url && (
                        <a
                          href={app.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: '0.8125rem',
                            fontWeight: 600,
                            color: 'var(--color-brand-ink)',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'var(--color-surface-sunken)',
                          }}
                        >
                          <FileText size={14} /> View Uploaded Resume
                        </a>
                      )}
                      <Link
                        to={`/jobs/${app.job_id}`}
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: 'var(--color-brand-ink)',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        View Job Details <ChevronRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
