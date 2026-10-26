import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Calendar, User, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { recruiterService } from '../services/api';
import { Button, Badge, Spinner, AlertBanner, EmptyState } from '../components/common/UIComponents';

export const RecruiterApplicantsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/recruiter/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  const loadApplicants = () => {
    setLoading(true);
    Promise.all([
      recruiterService.getJobDetail(id),
      recruiterService.getJobApplicants(id),
    ])
      .then(([jobRes, applicantsRes]) => {
        setJob(jobRes.data);
        setApplicants(applicantsRes.data?.results || []);
      })
      .catch((err) => {
        setError('Could not load applicants for this position.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadApplicants();
    }
  }, [id, isAuthenticated]);

  const handleStatusChange = async (applicantId, newStatus) => {
    setUpdatingId(applicantId);
    try {
      await recruiterService.updateApplicantStatus(applicantId, newStatus);
      setApplicants(applicants.map(app => app.id === applicantId ? { ...app, status: newStatus } : app));
    } catch {
      alert('Could not update applicant status.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (authLoading || loading) return <Spinner />;

  return (
    <div className="container" style={{ padding: 'var(--space-8) 0' }}>
      <Link to="/recruiter/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: 'var(--space-6)', fontWeight: 600 }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', marginBottom: 'var(--space-1)' }}>
              Applicants: {job?.title}
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Company: <strong>{job?.company_name}</strong> • Total Candidates: <strong>{applicants.length}</strong>
            </p>
          </div>
          <Link to={`/jobs/${job?.id}`} target="_blank">
            <Button variant="secondary" size="sm">View Public Job Post</Button>
          </Link>
        </div>
      </div>

      {error && <AlertBanner type="error" message={error} />}

      {applicants.length === 0 ? (
        <EmptyState
          title="No Applicants Yet"
          description="Candidates haven't submitted applications for this post yet. Make sure your job requirements and salary range are attractive to local candidates."
          icon={User}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {applicants.map((app) => (
            <div key={app.id} className="card" style={{ padding: 'var(--space-6)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-1)' }}>{app.full_name}</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                    <span>Age: <strong>{app.age} yrs</strong></span>
                    <span>•</span>
                    <span>Qualification: <strong>{app.qualification}</strong></span>
                    {app.course_name && (
                      <>
                        <span>•</span>
                        <span>Trade: <strong>{app.course_name}</strong></span>
                      </>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Status:</label>
                  <select
                    value={app.status}
                    disabled={updatingId === app.id}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    className="form-select"
                    style={{ height: '36px', fontSize: '0.8125rem', fontWeight: 600 }}
                  >
                    <option value="SUBMITTED">Submitted</option>
                    <option value="REVIEWING">Under Review</option>
                    <option value="SHORTLISTED">Shortlisted</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="HIRED">Hired</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)', padding: 'var(--space-4)', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '4px' }}>CONTACT CANDIDATE</div>
                  <a
                    href={`tel:${app.mobile_number}`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--color-brand-ink)', fontSize: '1.0625rem' }}
                  >
                    <Phone size={16} color="var(--color-state-success)" />
                    {app.mobile_number}
                  </a>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '4px' }}>RESIDENTIAL ADDRESS</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>
                    {app.current_address}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '4px' }}>APPLIED DATE</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} />
                    {new Date(app.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
