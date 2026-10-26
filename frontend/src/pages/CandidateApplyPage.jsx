import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { jobService } from '../services/api';
import { Button, AlertBanner, Spinner } from '../components/common/UIComponents';

export const CandidateApplyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loadingJob, setLoadingJob] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState(null);

  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    qualification: '',
    course_name: '',
    mobile_number: '',
    current_address: '',
  });

  useEffect(() => {
    jobService.getJobDetail(id)
      .then((res) => setJob(res.data))
      .catch(() => setError('Could not load job details.'))
      .finally(() => setLoadingJob(false));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setValidationErrors(null);

    try {
      const payload = {
        ...formData,
        age: parseInt(formData.age, 10),
      };
      const res = await jobService.applyToJob(id, payload);
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
          <h2 style={{ marginBottom: 'var(--space-2)' }}>Application Submitted!</h2>
          <p style={{ marginBottom: 'var(--space-6)' }}>
            Your application for <strong>{job?.title}</strong> at <strong>{job?.company_name}</strong> has been directly forwarded to the recruiter.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
            <Link to="/jobs"><Button variant="primary">Browse More Jobs</Button></Link>
            <Link to="/"><Button variant="secondary">Back to Home</Button></Link>
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
        <p style={{ marginBottom: 'var(--space-6)' }}>
          Company: <strong>{job?.company_name}</strong> ({job?.area})
        </p>

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

          <Button type="submit" variant="primary" size="lg" isLoading={submitting} style={{ width: '100%', marginTop: 'var(--space-4)' }}>
            Submit Application
          </Button>
        </form>
      </div>
    </div>
  );
};
