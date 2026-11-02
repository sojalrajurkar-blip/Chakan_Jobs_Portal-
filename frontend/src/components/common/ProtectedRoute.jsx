import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Spinner } from './UIComponents';

export const ProtectedRoute = ({ children, allowedRoles, redirectTo }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Spinner />;
  }

  if (!isAuthenticated) {
    const target = redirectTo || (location.pathname.startsWith('/candidate') ? '/candidate/login' : '/recruiter/login');
    return <Navigate to={target} state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.role;
    const isAllowed = allowedRoles.includes(userRole) || (user?.is_staff && allowedRoles.includes('ADMIN'));
    if (!isAllowed) {
      if (userRole === 'CANDIDATE') {
        return <Navigate to="/candidate/applications" replace />;
      }
      if (userRole === 'RECRUITER') {
        return <Navigate to="/recruiter/dashboard" replace />;
      }
      return <Navigate to="/" replace />;
    }
  }

  return children;
};
