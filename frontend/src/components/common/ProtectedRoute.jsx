import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Spinner } from './UIComponents';

export const ProtectedRoute = ({ children, redirectTo }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Spinner />;
  }

  if (!isAuthenticated) {
    const target = redirectTo || (location.pathname.startsWith('/candidate') ? '/candidate/login' : '/recruiter/login');
    return <Navigate to={target} state={{ from: location }} replace />;
  }

  return children;
};
