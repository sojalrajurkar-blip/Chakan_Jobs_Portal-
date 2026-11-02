import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Building, Clock, IndianRupee, Users, Bus, Phone, Mail, ArrowLeft, MessageCircle, AlertTriangle, Lock } from 'lucide-react';
import gsap from 'gsap';
import { jobService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button, Badge, Spinner, AlertBanner } from '../components/common/UIComponents';
import { JobCard } from '../components/jobs/JobCard';

export const JobDetailPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const detailCardRef = useRef(null);
  const sidebarCardRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    jobService.getJobDetail(id)
      .then((res) => {
        setJob(res.data);
      })
      .catch((err) => {
        setError('This job post could not be loaded or is no longer active.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  // GSAP Entrance animation
  useEffect(() => {
    if (job && detailCardRef.current && sidebarCardRef.current) {
      gsap.fromTo(detailCardRef.current, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
      gsap.fromTo(sidebarCardRef.current, { opacity: 0, x: 25 }, { opacity: 1, x: 0, duration: 0.6, delay: 0.1, ease: 'power2.out' });
    }
  }, [job]);

  if (loading) return <Spinner />;
  if (error || !job) {
    return (
      <div className="container" style={{ padding: 'var(--space-12) 0' }}>
        <AlertBanner type="error" message={error || 'Job not found'} />
        <Link to="/jobs"><Button variant="secondary">Back to Jobs</Button></Link>
      </div>
    );
  }

  const whatsappMessage = encodeURIComponent(
    `Hello, I am interested in applying for "${job.title}" at ${job.company_name} listed on Chakan Jobs Portal.`
  );

  return (
    <div className="container" style={{ padding: 'var(--space-8) 0' }}>
      <Link to="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: 'var(--space-6)', fontWeight: 600 }}>
        <ArrowLeft size={16} /> Back to Job Listings
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 1fr)', gap: 'var(--space-8)', alignItems: 'start' }}>
        {/* Main Job Info */}
        <div ref={detailCardRef} className="card" style={{ padding: 'var(--space-8)' }}>

          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-3)' }}>
            <Badge variant="sage">{job.shift_display || job.shift}</Badge>
            <Badge variant="lavender">{job.job_type_display || job.job_type}</Badge>
            {job.charges_applicable ? (
              <Badge variant="amber">Placement Charges Applicable</Badge>
            ) : (
              <Badge variant="success">₹0 Charges / Free Job</Badge>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-5)', flexWrap: 'wrap' }}>
            {job.company_logo_url ? (
              <img
                src={job.company_logo_url}
                alt={job.company_name || 'Company'}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '12px',
                  objectFit: 'contain',
                  background: '#FFFFFF',
                  padding: '6px',
                  border: '1px solid var(--color-border-default)',
                  boxShadow: '0 4px 12px rgba(10, 7, 51, 0.08)',
                  flexShrink: 0,
                }}
              />
            ) : (
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, var(--color-brand-ink), #1d1768)',
                  color: 'var(--color-brand-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.5rem',
                  fontFamily: 'var(--font-display)',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(10, 7, 51, 0.12)',
                }}
              >
                {(job.company_name || 'CJ').substring(0, 2).toUpperCase()}
              </div>
            )}

            <div>
              <h1 style={{ fontSize: '2rem', marginBottom: 'var(--space-1)', color: 'var(--color-brand-ink)', lineHeight: 1.2 }}>{job.title}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-text-secondary)', fontSize: '1.0625rem', flexWrap: 'wrap' }}>
                <Building size={18} />
                <strong style={{ color: 'var(--color-brand-ink)' }}>{job.company_name}</strong>
                <span>•</span>
                <MapPin size={18} />
                <span>{job.area}{job.village ? ` (${job.village})` : ''}</span>
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-default)', margin: 'var(--space-6) 0' }} />

          <h3 style={{ marginBottom: 'var(--space-3)' }}>Job Description</h3>
          <p style={{ whiteSpace: 'pre-line', lineHeight: 1.7, marginBottom: 'var(--space-6)' }}>
            {job.description || 'No detailed description provided by the recruiter.'}
          </p>

          <h3 style={{ marginBottom: 'var(--space-3)' }}>Requirements & Eligibility</h3>
          <ul style={{ paddingLeft: 'var(--space-5)', lineHeight: 1.8, color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
            <li>Minimum Education: <strong>{job.min_education_display || job.min_education}</strong></li>
            {job.course_required && <li>Specific Course / Trade: <strong>{job.course_required}</strong></li>}
            <li>Experience: <strong>{job.experience_required_display || job.experience_required}</strong></li>
            <li>Gender Preference: <strong>{job.gender_preference_display || job.gender_preference}</strong></li>
            {job.facilities && <li>Provided Facilities: <strong>{job.facilities}</strong></li>}
            {job.bus_route && <li>Company Bus Route: <strong>{job.bus_route}</strong></li>}
          </ul>

          {job.company_address && (
            <>
              <h3 style={{ marginBottom: 'var(--space-2)' }}>Workplace Address</h3>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{job.company_address}</p>
            </>
          )}
        </div>

        {/* Sidebar Apply & Contact Panel */}
        <div>
          <div ref={sidebarCardRef} className="card" style={{ padding: 'var(--space-6)', position: 'sticky', top: '96px' }}>
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Salary & Compensation</h3>
            <div style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-state-success)', marginBottom: 'var(--space-2)' }}>
              {job.min_salary > 0 ? `₹${job.min_salary.toLocaleString('en-IN')} - ₹${job.max_salary.toLocaleString('en-IN')}` : 'Best in Industry'}
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', fontWeight: 400 }}> / month</span>
            </div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--space-6)' }}>
              {job.openings} Openings Available
            </div>

            {!isAuthenticated ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                <Link
                  to="/candidate/login"
                  state={{ from: { pathname: `/jobs/${job.id}/apply` } }}
                  style={{ textDecoration: 'none' }}
                >
                  <Button variant="primary" size="lg" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                    <Lock size={16} /> Login to Apply
                  </Button>
                </Link>
                <Link
                  to="/candidate/signup"
                  state={{ from: { pathname: `/jobs/${job.id}/apply` } }}
                  style={{ textDecoration: 'none' }}
                >
                  <Button variant="outline" size="md" style={{ width: '100%' }}>
                    New Candidate? Register Free
                  </Button>
                </Link>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textAlign: 'center', marginTop: 'var(--space-1)' }}>
                  🔒 Candidate registration or login is required to apply for vacancies.
                </div>
              </div>
            ) : user?.role === 'RECRUITER' ? (
              <div
                style={{
                  padding: 'var(--space-3) var(--space-4)',
                  backgroundColor: 'var(--color-brand-sage)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 'var(--space-4)',
                  fontSize: '0.875rem',
                  color: 'var(--color-brand-ink)',
                }}
              >
                You are signed in as an Employer. Employers cannot apply to jobs. Please sign in with a candidate account.
              </div>
            ) : (
              <Link to={`/jobs/${job.id}/apply`} style={{ textDecoration: 'none' }}>
                <Button variant="primary" size="lg" style={{ width: '100%', marginBottom: 'var(--space-4)' }}>
                  Apply for this Position
                </Button>
              </Link>
            )}

            {/* Direct Contact Buttons */}
            {(job.calling_number || job.whatsapp_number) && (
              <div style={{ marginTop: 'var(--space-2)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border-default)' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Direct HR Contact
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {job.calling_number && (
                    <a
                      href={`tel:${job.calling_number}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <Button variant="secondary" size="md" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                        <Phone size={16} /> Call HR ({job.calling_number})
                      </Button>
                    </a>
                  )}
                  {job.whatsapp_number && (
                    <a
                      href={`https://wa.me/91${job.whatsapp_number.replace(/^0+/, '')}?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'none' }}
                    >
                      <Button variant="outline" size="md" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', color: '#16a34a', borderColor: '#16a34a' }}>
                        <MessageCircle size={16} /> Chat on WhatsApp
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            )}

            <p style={{ fontSize: '0.75rem', textAlign: 'center', color: 'var(--color-text-muted)', marginTop: 'var(--space-4)' }}>
              100% Free candidate application. Verified industrial employer.
            </p>
          </div>
        </div>
      </div>

      {/* Related Jobs Section */}
      {job.related_jobs && job.related_jobs.length > 0 && (
        <div style={{ marginTop: 'var(--space-12)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-6)', color: 'var(--color-brand-ink)' }}>
            Similar Jobs in {job.area}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-4)' }}>
            {job.related_jobs.map((relJob) => (
              <JobCard key={relJob.id} job={relJob} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

