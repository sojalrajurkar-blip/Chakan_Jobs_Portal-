import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Building2,
  MapPin,
  IndianRupee,
  FileText,
  Clock,
  ExternalLink,
  ChevronRight,
  Upload,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { candidateService } from '../services/api';
import { Button, Spinner, AlertBanner } from '../components/common/UIComponents';
import { animateStaggerCards } from '../utils/gsapAnimations';

export const CandidateApplicationsPage = () => {
  const { user, isAuthenticated, loading: authLoading, updateUser } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeSuccessMsg, setResumeSuccessMsg] = useState(null);
  const appsRef = useRef(null);
  const resumeInputRef = useRef(null);

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['.pdf', '.doc', '.docx'];
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!allowed.includes(ext)) {
      alert('Please select a PDF, DOC, or DOCX document.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Resume file size must be less than 5 MB.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);
    setUploadingResume(true);
    setResumeSuccessMsg(null);

    try {
      const res = await candidateService.updateProfile(formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.success && res.data.user) {
        updateUser(res.data.user);
        setResumeSuccessMsg('Your default resume has been updated! 1-Click Apply is active.');
        setTimeout(() => setResumeSuccessMsg(null), 5000);
      }
    } catch {
      alert('Failed to update resume. Please try again.');
    } finally {
      setUploadingResume(false);
    }
  };

  // GSAP animation for applications list
  useEffect(() => {
    if (applications.length > 0 && appsRef.current) {
      animateStaggerCards('.app-card', appsRef);
    }
  }, [applications]);

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

        {resumeSuccessMsg && (
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <AlertBanner variant="success" title="Resume Saved" message={resumeSuccessMsg} />
          </div>
        )}

        {/* Stored Profile Resume Manager */}
        <div
          className="card"
          style={{
            padding: 'var(--space-5) var(--space-6)',
            marginBottom: 'var(--space-8)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border-default)',
            background: 'linear-gradient(to right, #FFFFFF, var(--color-surface-subtle))',
            boxShadow: 'var(--shadow-subtle)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                backgroundColor: user?.resume_url ? '#EAF6EF' : 'var(--color-surface-subtle)',
                color: user?.resume_url ? '#237A52' : 'var(--color-text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <FileText size={26} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 700, color: 'var(--color-brand-ink)', fontSize: '1.0625rem' }}>
                  Default Stored Resume
                </span>
                {user?.resume_url ? (
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, background: '#EAF6EF', color: '#237A52', border: '1px solid #A6E2BE', padding: '2px 8px', borderRadius: '999px' }}>
                    ⚡ 1-Click Fast Apply Enabled
                  </span>
                ) : (
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, background: '#FFF5D9', color: '#8A5A00', padding: '2px 8px', borderRadius: '999px' }}>
                    No Resume Stored
                  </span>
                )}
              </div>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                {user?.resume_url ? (
                  <>
                    Stored file: <strong>{user.resume_name || 'My_Resume.pdf'}</strong> — Auto-fills when you apply to any factory job.
                  </>
                ) : (
                  'Upload your biodata / resume once to enable instant 1-click applications across all factory jobs.'
                )}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            {user?.resume_url && (
              <a
                href={user.resume_url}
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <Button variant="outline" size="sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ExternalLink size={14} /> View
                </Button>
              </a>
            )}

            <input
              type="file"
              ref={resumeInputRef}
              onChange={handleResumeUpload}
              accept=".pdf,.doc,.docx"
              style={{ display: 'none' }}
            />
            <Button
              variant="secondary"
              size="sm"
              disabled={uploadingResume}
              onClick={() => resumeInputRef.current?.click()}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Upload size={14} /> {uploadingResume ? 'Saving...' : user?.resume_url ? 'Replace Resume' : 'Upload Resume'}
            </Button>
          </div>
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
          <div ref={appsRef} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
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
                  className="card app-card"
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      {app.company_logo_url ? (
                        <img
                          src={app.company_logo_url}
                          alt={app.company_name || 'Company'}
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '10px',
                            objectFit: 'contain',
                            background: '#FFFFFF',
                            padding: '3px',
                            border: '1px solid var(--color-border-default)',
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, var(--color-brand-ink), #1d1768)',
                            color: 'var(--color-brand-gold)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.9375rem',
                            flexShrink: 0,
                          }}
                        >
                          {(app.company_name || 'CJ').substring(0, 2).toUpperCase()}
                        </div>
                      )}

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
