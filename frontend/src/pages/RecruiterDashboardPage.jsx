import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Briefcase, Users, Clock, Trash2, Edit, ExternalLink, CheckCircle, ShieldAlert, Camera, Upload } from 'lucide-react';
import gsap from 'gsap';
import { useAuth } from '../context/AuthContext';
import { recruiterService, authService } from '../services/api';
import { Button, Badge, Spinner, AlertBanner, EmptyState } from '../components/common/UIComponents';
import { animateStaggerCards } from '../utils/gsapAnimations';

export const RecruiterDashboardPage = () => {
  const { user, isAuthenticated, isRecruiter, isAdmin, isCandidate, loading: authLoading, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const metricsRef = useRef(null);
  const jobsTableRef = useRef(null);
  const logoInputRef = useRef(null);

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'];
    if (!allowed.includes(file.type)) {
      alert('Please upload a valid image file (PNG, JPG, or SVG).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Logo file size must be less than 2 MB.');
      return;
    }

    const formData = new FormData();
    formData.append('company_logo', file);
    setUploadingLogo(true);

    try {
      const res = await authService.updateMe(formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.success && res.data.user) {
        updateUser(res.data.user);
      }
    } catch {
      alert('Failed to update company logo. Please try again.');
    } finally {
      setUploadingLogo(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/recruiter/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  // GSAP animation for metric summary cards
  useEffect(() => {
    if (summary && metricsRef.current) {
      animateStaggerCards('.metric-card', metricsRef);

      // Animate numbers counting up
      const counters = metricsRef.current.querySelectorAll('.metric-number');
      counters.forEach((el) => {
        const target = parseInt(el.getAttribute('data-value') || '0', 10);
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.0,
          ease: 'power2.out',
          onUpdate: () => {
            el.innerText = Math.round(obj.val).toLocaleString('en-IN');
          },
        });
      });
    }
  }, [summary]);

  // GSAP animation for jobs table
  useEffect(() => {
    if (myJobs.length > 0 && jobsTableRef.current) {
      animateStaggerCards('.job-table-row', jobsTableRef);
    }
  }, [myJobs]);

  const loadData = () => {
    setLoading(true);
    setError(null);
    Promise.all([
      recruiterService.getDashboardSummary(),
      recruiterService.getJobs({ page_size: 20 }),
    ])
      .then(([summaryRes, jobsRes]) => {
        setSummary(summaryRes.data);
        setMyJobs(jobsRes.data?.results || []);
      })
      .catch((err) => {
        const errorMsg =
          err.response?.data?.detail ||
          err.response?.data?.error?.message ||
          'Failed to load recruiter dashboard metrics. Please check your credentials or network connection.';
        setError(errorMsg);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isAuthenticated && (isRecruiter || isAdmin)) {
      loadData();
    } else if (isAuthenticated && isCandidate) {
      setLoading(false);
    }
  }, [isAuthenticated, isRecruiter, isAdmin, isCandidate]);

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

  if (authLoading || (loading && (isRecruiter || isAdmin))) return <Spinner />;

  if (user && isCandidate) {
    return (
      <div className="container" style={{ padding: 'var(--space-16) 0', maxWidth: '640px' }}>
        <div className="card" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#fef3c7', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)', color: '#d97706' }}>
            <ShieldAlert size={32} />
          </div>
          <h1 style={{ fontSize: '1.625rem', marginBottom: 'var(--space-2)' }}>Candidate Account Detected</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)', lineHeight: 1.6 }}>
            You are currently signed in with a Candidate account: <strong>{user?.full_name || user?.username}</strong> ({user?.mobile_number}).
            <br />
            The <strong>Employer / Recruiter Dashboard</strong> is restricted to factory HR representatives (e.g. <code>hr_tatamotors</code> / <code>Password@123</code>).
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/candidate/applications" style={{ textDecoration: 'none' }}>
              <Button variant="primary">Go to My Applications</Button>
            </Link>
            <Button
              variant="secondary"
              onClick={async () => {
                await logout();
                navigate('/recruiter/login');
              }}
            >
              Sign In with Employer Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: 'var(--space-8) 0' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{ position: 'relative' }}>
            {user?.company_logo_url ? (
              <img
                src={user.company_logo_url}
                alt={user.company_name || 'Company'}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '14px',
                  objectFit: 'contain',
                  background: '#FFFFFF',
                  padding: '5px',
                  border: '1px solid var(--color-border-default)',
                  boxShadow: '0 4px 12px rgba(10, 7, 51, 0.08)',
                }}
              />
            ) : (
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, var(--color-brand-ink), #1d1768)',
                  color: 'var(--color-brand-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  fontFamily: 'var(--font-display)',
                  boxShadow: '0 4px 12px rgba(10, 7, 51, 0.12)',
                }}
              >
                {(user?.company_name || 'CJ').substring(0, 2).toUpperCase()}
              </div>
            )}
            <input
              type="file"
              ref={logoInputRef}
              onChange={handleLogoUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              disabled={uploadingLogo}
              title="Upload / Change Company Logo"
              style={{
                position: 'absolute',
                bottom: '-4px',
                right: '-4px',
                background: 'var(--color-brand-gold)',
                color: 'var(--color-brand-ink)',
                border: '2px solid #FFFFFF',
                borderRadius: '50%',
                width: '26px',
                height: '26px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              }}
            >
              <Camera size={13} strokeWidth={2.5} />
            </button>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: '4px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.875rem', margin: 0 }}>Employer Dashboard</h1>
              {user?.is_verified ? (
                <Badge variant="success">Verified HR Account</Badge>
              ) : (
                <Badge variant="amber">Verification Pending</Badge>
              )}
            </div>
            <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
              Welcome back, <strong>{user?.company_name || user?.username}</strong> ({user?.position || 'Recruiter'})
              {uploadingLogo && <span style={{ marginLeft: '8px', color: 'var(--color-brand-purple)', fontWeight: 600 }}>Updating logo...</span>}
            </p>
          </div>
        </div>

        {user?.is_verified ? (
          <Link to="/recruiter/jobs/new" style={{ textDecoration: 'none' }}>
            <Button variant="accent" size="lg" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PlusCircle size={18} /> Post New Vacancy
            </Button>
          </Link>
        ) : (
          <Button
            variant="secondary"
            size="lg"
            disabled
            title="Your account is awaiting admin verification before you can post jobs"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.6 }}
          >
            <PlusCircle size={18} /> Post New Vacancy (Pending)
          </Button>
        )}
      </div>

      {/* Verification Notice Banner if Unverified */}
      {user && !user.is_verified && (
        <div
          style={{
            backgroundColor: '#fef3c7',
            border: '1px solid #f59e0b',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-4) var(--space-6)',
            marginBottom: 'var(--space-8)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-4)',
          }}
        >
          <ShieldAlert size={32} color="#d97706" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700, color: '#92400e', fontSize: '1rem', marginBottom: '2px' }}>
              Account Verification Pending
            </div>
            <div style={{ fontSize: '0.875rem', color: '#78350f' }}>
              Your company account is under review by the Portal Administrator. Once verified in the Admin Panel, you will have full access to publish jobs and view applicant contacts.
            </div>
          </div>
        </div>
      )}

      {error && (
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <AlertBanner type="error" message={error} />
          <div style={{ marginTop: 'var(--space-3)', display: 'flex', gap: 'var(--space-3)' }}>
            <Button variant="secondary" size="sm" onClick={loadData}>
              Try Again
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                await logout();
                navigate('/recruiter/login');
              }}
            >
              Sign In with Another Account
            </Button>
          </div>
        </div>
      )}

      {/* Metrics Row */}
      {summary && (
        <div
          ref={metricsRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-8)',
          }}
        >
          <div className="card metric-card" style={{ padding: 'var(--space-5)' }}>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
              ACTIVE JOBS
            </div>
            <div className="metric-number" data-value={summary.active_jobs} style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-brand-ink)' }}>
              {summary.active_jobs}
            </div>
          </div>

          <div className="card metric-card" style={{ padding: 'var(--space-5)' }}>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
              TOTAL APPLICATIONS
            </div>
            <div className="metric-number" data-value={summary.total_applications} style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-state-success)' }}>
              {summary.total_applications}
            </div>
          </div>

          <div className="card metric-card" style={{ padding: 'var(--space-5)' }}>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
              PENDING REVIEWS
            </div>
            <div className="metric-number" data-value={summary.pending_reviews} style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-brand-gold-strong)' }}>
              {summary.pending_reviews}
            </div>
          </div>

          <div className="card metric-card" style={{ padding: 'var(--space-5)' }}>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
              SHORTLISTED
            </div>
            <div className="metric-number" data-value={summary.shortlisted_count || 0} style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-brand-purple)' }}>
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
