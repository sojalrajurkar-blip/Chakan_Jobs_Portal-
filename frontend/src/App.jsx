import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { HomePage } from './pages/HomePage';
import { JobSearchPage } from './pages/JobSearchPage';
import { JobDetailPage } from './pages/JobDetailPage';
import { CandidateApplyPage } from './pages/CandidateApplyPage';
import { RecruiterLoginPage } from './pages/RecruiterLoginPage';
import { RecruiterSignupPage } from './pages/RecruiterSignupPage';
import { RecruiterDashboardPage } from './pages/RecruiterDashboardPage';
import { RecruiterJobFormPage } from './pages/RecruiterJobFormPage';
import { RecruiterApplicantsPage } from './pages/RecruiterApplicantsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="jobs" element={<JobSearchPage />} />
          <Route path="jobs/:id" element={<JobDetailPage />} />
          <Route path="jobs/:id/apply" element={<CandidateApplyPage />} />
          <Route path="recruiter/login" element={<RecruiterLoginPage />} />
          <Route path="recruiter/signup" element={<RecruiterSignupPage />} />
          <Route path="recruiter/dashboard" element={<RecruiterDashboardPage />} />
          <Route path="recruiter/jobs/new" element={<RecruiterJobFormPage />} />
          <Route path="recruiter/jobs/:id/edit" element={<RecruiterJobFormPage />} />
          <Route path="recruiter/jobs/:id/applicants" element={<RecruiterApplicantsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
