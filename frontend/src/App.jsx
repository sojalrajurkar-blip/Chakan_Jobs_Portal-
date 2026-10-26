import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { ProtectedRoute } from './components/common/ProtectedRoute';
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
          {/* Public Visitor & Candidate Routes */}
          <Route index element={<HomePage />} />
          <Route path="jobs" element={<JobSearchPage />} />
          <Route path="jobs/:id" element={<JobDetailPage />} />
          <Route path="jobs/:id/apply" element={<CandidateApplyPage />} />

          {/* Employer Authentication Routes */}
          <Route path="recruiter/login" element={<RecruiterLoginPage />} />
          <Route path="recruiter/signup" element={<RecruiterSignupPage />} />

          {/* Protected Employer Management Routes */}
          <Route
            path="recruiter/dashboard"
            element={
              <ProtectedRoute>
                <RecruiterDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="recruiter/jobs/new"
            element={
              <ProtectedRoute>
                <RecruiterJobFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="recruiter/jobs/:id/edit"
            element={
              <ProtectedRoute>
                <RecruiterJobFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="recruiter/jobs/:id/applicants"
            element={
              <ProtectedRoute>
                <RecruiterApplicantsPage />
              </ProtectedRoute>
            }
          />

          {/* 404 Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
