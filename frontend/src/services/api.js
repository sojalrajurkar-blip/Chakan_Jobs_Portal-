import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject Token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('chakan_job_auth_token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle unauthenticated 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized on a protected route, clear stale token
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/recruiter/dashboard') || currentPath.startsWith('/recruiter/jobs')) {
        localStorage.removeItem('chakan_job_auth_token');
        localStorage.removeItem('chakan_job_user');
        window.location.href = '/recruiter/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: (payload) => api.post('/auth/register/', payload),
  login: (payload) => api.post('/auth/login/', payload),
  logout: () => api.post('/auth/logout/'),
  getMe: () => api.get('/auth/me/'),
  updateMe: (payload) => api.patch('/auth/me/', payload),
};

export const jobService = {
  getJobs: (params) => api.get('/jobs/', { params }),
  getJobDetail: (id) => api.get(`/jobs/${id}/`),
  getFilters: () => api.get('/jobs/filters/'),
  applyToJob: (id, payload) => api.post(`/jobs/${id}/apply/`, payload),
};

export const recruiterService = {
  getJobs: (params) => api.get('/recruiter/jobs/', { params }),
  getJobDetail: (id) => api.get(`/recruiter/jobs/${id}/`),
  createJob: (payload) => api.post('/recruiter/jobs/', payload),
  updateJob: (id, payload) => api.patch(`/recruiter/jobs/${id}/`, payload),
  deleteJob: (id) => api.delete(`/recruiter/jobs/${id}/`),
  getJobApplicants: (jobId, params) => api.get(`/recruiter/jobs/${jobId}/applicants/`, { params }),
  updateApplicantStatus: (applicationId, status) =>
    api.patch(`/recruiter/applications/${applicationId}/status/`, { status }),
  getDashboardSummary: () => api.get('/recruiter/dashboard/summary/'),
};

export default api;
