import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowLeft, Upload, FileText, X } from 'lucide-react';
import { jobService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button, AlertBanner, Spinner } from '../components/common/UIComponents';

export const CandidateApplyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [job, setJob] = useState(null);
  const [loadingJob, setLoadingJob] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [fileError, setFileError] = useState(null);

  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    qualification: '',
    course_name: '',
    mobile_number: '',
    current_address: '',
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        full_name: prev.full_name || user.full_name || '',
        mobile_number: prev.mobile_number || user.mobile_number || '',
        qualification: prev.qualification || user.qualification || '',
        current_address: prev.current_address || user.current_address || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    jobService.getJobDetail(id)
      .then((res) => setJob(res.data))
      .catch(() => setError('Could not load job details.'))
      .finally(() => setLoadingJob(false));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError(null);
    if (!file) {
      setResumeFile(null);
      return;
    }

    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!allowedExtensions.includes(fileExt)) {
      setFileError('Invalid file format. Please upload PDF, DOC, or DOCX documents.');
      e.target.value = '';
      setResumeFile(null);
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setFileError('File size exceeds 5 MB limit. Please upload a smaller file.');
      e.target.value = '';
      setResumeFile(null);
      return;
    }

    setResumeFile(file);
  };

  const handleRemoveFile = () => {
    setResumeFile(null);
    setFileError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setValidationErrors(null);

    try {
      const data = new FormData();
      data.append('full_name', formData.full_name);
      data.append('age', parseInt(formData.age, 10));
      data.append('qualification', formData.qualification);
      if (formData.course_name) {
        data.append('course_name', formData.course_name);
      }
      data.append('mobile_number', formData.mobile_number);
      data.append('current_address', formData.current_address);
      if (resumeFile) {
        data.append('resume_file', resumeFile);
      }

      const res = await jobService.applyToJob(id, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.success) {
        setSuccess(true);
      }
    } catch (err) {
      const respData = err.response?.data;
      if (respData?.error?.details) {
        setValidationErrors(respData.error.details);
      }
      setError(respData?.error?.message || 'Failed to submit application. Please check your entries.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingJob) return <Spinner />;

  if (success) {
    return (
      <div className="container" style={{ padding: 'var(--space-16) 0', maxWidth: '600px', textAlign: 'center' }}>
        <div className="card" style={{ padding: 'var(--space-8)' }}>
          <div style={{ display: 'inline-flex', padding: 'var(--space-4)', borderRadius: 'var(--radius-pill)', backgroundColor: 'var(--color-state-success-bg)', marginBottom: 'var(--space-4)' }}>
            <CheckCircle2 size={48} color="var(--color-state-success)" />
          </div>
          <h2 style={{ marginBottom: 'var(--space-2)' }}>Application Submitted Successfully!</h2>
          <p style={{ marginBottom: 'var(--space-6)', color: 'var(--color-text-secondary)' }}>
            Your application for <strong>{job?.title}</strong> at <strong>{job?.company_name}</strong> has been directly forwarded to the employer.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', justifyContent: 'center' }}>
            <Link to="/candidate/applications"><Button variant="primary">View My Applications</Button></Link>
            <Link to="/jobs"><Button variant="secondary">Browse More Jobs</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: 'var(--space-8) 0', maxWidth: '640px' }}>
      <Link to={`/jobs/${id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: 'var(--space-6)', fontWeight: 600 }}>
        <ArrowLeft size={16} /> Back to Job Details
      </Link>

      <div className="card" style={{ padding: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: 'var(--space-2)' }}>Apply for {job?.title}</h1>
        <p style={{ marginBottom: 'var(--space-4)' }}>
          Company: <strong>{job?.company_name}</strong> ({job?.area})
        </p>

        {!isAuthenticated && (
          <div
            style={{
              padding: 'var(--space-3) var(--space-4)',
              backgroundColor: 'var(--color-brand-sage)',
              borderRadius: 'var(--radius-md)',
              marginBottom: 'var(--space-5)',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--space-2)',
            }}
          >
            <span style={{ color: 'var(--color-brand-ink)' }}>
              Already registered? Sign in to auto-fill your details.
            </span>
            <Link
              to="/candidate/login"
              state={{ from: { pathname: `/jobs/${id}/apply` } }}
              style={{ fontWeight: 700, color: 'var(--color-brand-ink)', textDecoration: 'underline' }}
            >
              Sign In →
            </Link>
          </div>
        )}

        {error && <AlertBanner type="error" message={error} details={validationErrors} />}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="full_name"
              required
              placeholder="e.g. Rahul Ramesh Patil"
              value={formData.full_name}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label">Age (Years) *</label>
              <input
                type="number"
                name="age"
                required
                min="18"
                max="65"
                placeholder="e.g. 24"
                value={formData.age}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Number *</label>
              <input
                type="tel"
                name="mobile_number"
                required
                maxLength="10"
                placeholder="10-digit number"
                value={formData.mobile_number}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Qualification *</label>
            <input
              type="text"
              name="qualification"
              required
              placeholder="e.g. ITI Turner / 12th Pass / Diploma Mechanical"
              value={formData.qualification}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Course / Trade / Branch (Optional)</label>
            <input
              type="text"
              name="course_name"
              placeholder="e.g. Machinist, DME, Fitter"
              value={formData.course_name}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Current Residential Address in Chakan/Pune *</label>
            <textarea
              name="current_address"
              required
              rows="3"
              placeholder="e.g. Nanekarwadi, near bus stop, Chakan"
              value={formData.current_address}
              onChange={handleChange}
              className="form-textarea"
            />
          </div>

          {/* Resume Upload (Optional) */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Upload Resume / Biodata (Optional)</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>PDF, DOC, DOCX (Max 5MB)</span>
            </label>

            {fileError && (
              <div style={{ color: 'var(--color-state-error)', fontSize: '0.8125rem', marginBottom: 'var(--space-2)' }}>
                {fileError}
              </div>
            )}

            {!resumeFile ? (
              <label
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 'var(--space-6)',
                  border: '2px dashed var(--color-border-default)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-surface-subtle)',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-brand-purple)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border-default)'; }}
              >
                <Upload size={28} color="var(--color-brand-purple)" style={{ marginBottom: 'var(--space-2)' }} />
                <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-brand-ink)' }}>
                  Click to select resume document
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  Optional for factory workers. Helpful for diploma/supervisory roles.
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </label>
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-3) var(--space-4)',
                  backgroundColor: 'var(--color-surface-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-state-success)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <FileText size={24} color="var(--color-brand-purple)" />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-brand-ink)' }}>
                      {resumeFile.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {(resumeFile.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '4px' }}
                  title="Remove file"
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>

          <Button type="submit" variant="primary" size="lg" isLoading={submitting} style={{ width: '100%', marginTop: 'var(--space-4)' }}>
            Submit Application
          </Button>
        </form>
      </div>
    </div>
  );
};
