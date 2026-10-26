import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { recruiterService, jobService } from '../services/api';
import { Button, AlertBanner, Spinner } from '../components/common/UIComponents';

export const RecruiterJobFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    openings: 1,
    min_salary: 15000,
    max_salary: 22000,
    job_type: 'INDUSTRY',
    shift: 'DAY',
    min_education: '10TH',
    course_required: '',
    experience_required: 'FRESHER',
    gender_preference: 'ANY',
    facilities: 'Bus facility, Canteen subsidy',
    area: 'Chakan MIDC Phase 2',
    village: '',
    bus_route: '',
    calling_number: '',
    whatsapp_number: '',
    status: 'ACTIVE',
  });

  const [filters, setFilters] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/recruiter/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    jobService.getFilters().then((res) => setFilters(res.data)).catch(() => {});

    if (isEditing) {
      recruiterService.getJobDetail(id)
        .then((res) => {
          const data = res.data;
          setFormData({
            title: data.title || '',
            description: data.description || '',
            openings: data.openings || 1,
            min_salary: data.min_salary || 0,
            max_salary: data.max_salary || 0,
            job_type: data.job_type || 'INDUSTRY',
            shift: data.shift || 'DAY',
            min_education: data.min_education || '10TH',
            course_required: data.course_required || '',
            experience_required: data.experience_required || 'FRESHER',
            gender_preference: data.gender_preference || 'ANY',
            facilities: data.facilities || '',
            area: data.area || 'Chakan MIDC Phase 2',
            village: data.village || '',
            bus_route: data.bus_route || '',
            calling_number: data.calling_number || '',
            whatsapp_number: data.whatsapp_number || '',
            status: data.status || 'ACTIVE',
          });
        })
        .catch(() => setError('Failed to load job post details.'))
        .finally(() => setFetching(false));
    } else if (user) {
      setFormData((prev) => ({
        ...prev,
        calling_number: user.mobile_number || prev.calling_number,
        whatsapp_number: user.mobile_number || prev.whatsapp_number,
      }));
    }
  }, [id, isEditing, user]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? (value === '' ? '' : parseInt(value, 10)) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setValidationErrors(null);

    try {
      if (isEditing) {
        await recruiterService.updateJob(id, formData);
      } else {
        await recruiterService.createJob(formData);
      }
      navigate('/recruiter/dashboard');
    } catch (err) {
      const respData = err.response?.data;
      if (respData?.error?.details) {
        setValidationErrors(respData.error.details);
      }
      setError(respData?.error?.message || 'Failed to save job posting.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || fetching) return <Spinner />;

  return (
    <div className="container" style={{ padding: 'var(--space-8) 0', maxWidth: '780px' }}>
      <Link to="/recruiter/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: 'var(--space-6)', fontWeight: 600 }}>
        <ArrowLeft size={16} /> Back to Recruiter Dashboard
      </Link>

      <div className="card" style={{ padding: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: 'var(--space-2)' }}>
          {isEditing ? 'Edit Job Posting' : 'Post a New Job Vacancy'}
        </h1>
        <p style={{ marginBottom: 'var(--space-6)' }}>
          Publish your factory, CNC, inspection, or office vacancy to thousands of local Chakan job seekers.
        </p>

        {user && !user.is_verified && (
          <AlertBanner
            type="warning"
            message="Verification Pending: Your company account must be verified by the Portal Administrator before you can publish vacancies. Please wait for administrator approval."
          />
        )}

        {error && <AlertBanner type="error" message={error} details={validationErrors} />}

        <form onSubmit={handleSubmit}>
          {/* Section 1: General Info */}
          <div className="form-group">
            <label className="form-label">Job Title *</label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. VMC Milling Machine Operator / Quality Inspector"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label">Industrial Area *</label>
              <input
                type="text"
                name="area"
                required
                placeholder="e.g. Chakan MIDC Phase 2"
                value={formData.area}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Village / Landmark (Optional)</label>
              <input
                type="text"
                name="village"
                placeholder="e.g. Kuruli / Nanekarwadi"
                value={formData.village}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          {/* Section 2: Compensation & Openings */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label">Min Salary (₹/mo)</label>
              <input
                type="number"
                name="min_salary"
                min="0"
                value={formData.min_salary}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Max Salary (₹/mo)</label>
              <input
                type="number"
                name="max_salary"
                min="0"
                value={formData.max_salary}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Openings *</label>
              <input
                type="number"
                name="openings"
                min="1"
                required
                value={formData.openings}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          {/* Section 3: Shift & Specifications */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label">Job Category *</label>
              <select name="job_type" value={formData.job_type} onChange={handleChange} className="form-select">
                <option value="INDUSTRY">Industry / Factory Job</option>
                <option value="OFFICE">Office Job</option>
                <option value="FIELD">Field Job</option>
                <option value="WFH">Work From Home</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Shift Timing *</label>
              <select name="shift" value={formData.shift} onChange={handleChange} className="form-select">
                <option value="DAY">Day Shift</option>
                <option value="NIGHT">Night Shift</option>
                <option value="ROTATIONAL">Rotational Shift (3 Shifts)</option>
                <option value="ANY">Any Shift</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label">Minimum Education *</label>
              <select name="min_education" value={formData.min_education} onChange={handleChange} className="form-select">
                <option value="10TH">10th Pass</option>
                <option value="12TH">12th Pass</option>
                <option value="ITI">ITI Certified</option>
                <option value="DIPLOMA">Diploma</option>
                <option value="GRADUATION">Graduate / BE / B.Tech</option>
                <option value="BELOW_10TH">Below 10th</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Experience Required *</label>
              <select name="experience_required" value={formData.experience_required} onChange={handleChange} className="form-select">
                <option value="FRESHER">Fresher</option>
                <option value="1_2_YEARS">1-2 Years</option>
                <option value="3_5_YEARS">3-5 Years</option>
                <option value="5_10_YEARS">5-10 Years</option>
                <option value="10_PLUS_YEARS">10+ Years</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Special Trade / Course Requirement</label>
            <input
              type="text"
              name="course_required"
              placeholder="e.g. ITI Fitter, Turner, Machinist, CNC Programming"
              value={formData.course_required}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Job Description & Responsibilities</label>
            <textarea
              name="description"
              rows="4"
              placeholder="Explain machine handling, tolerance checking, shift allowance, overtime rules, etc."
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Provided Plant Facilities</label>
            <input
              type="text"
              name="facilities"
              placeholder="e.g. Subsidized Canteen, Company Bus, Safety Shoes provided"
              value={formData.facilities}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Company Bus Route Details (if applicable)</label>
            <input
              type="text"
              name="bus_route"
              placeholder="e.g. Bhosari - Moshi - Chakan MIDC"
              value={formData.bus_route}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={loading}
            disabled={user && !user.is_verified}
            style={{ width: '100%', marginTop: 'var(--space-4)', opacity: user && !user.is_verified ? 0.6 : 1 }}
          >
            {user && !user.is_verified
              ? 'Verification Pending by Admin'
              : isEditing
              ? 'Save Changes'
              : 'Publish Job Opening'}
          </Button>
        </form>
      </div>
    </div>
  );
};
