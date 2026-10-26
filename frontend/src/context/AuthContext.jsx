import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('chakan_job_auth_token') || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('chakan_job_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If token exists, refresh current profile
    if (token) {
      authService.getMe()
        .then((res) => {
          if (res.data?.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('chakan_job_user', JSON.stringify(res.data.user));
          }
        })
        .catch(() => {
          // Token invalid, clear it
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    if (res.data?.success) {
      const newToken = res.data.token;
      const newUser = res.data.user;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('chakan_job_auth_token', newToken);
      localStorage.setItem('chakan_job_user', JSON.stringify(newUser));
      return { success: true };
    }
    return { success: false, error: res.data?.error };
  };

  const register = async (payload) => {
    const res = await authService.register(payload);
    if (res.data?.success) {
      const newToken = res.data.token;
      const newUser = res.data.user;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('chakan_job_auth_token', newToken);
      localStorage.setItem('chakan_job_user', JSON.stringify(newUser));
      return { success: true };
    }
    return { success: false, error: res.data?.error };
  };

  const logout = async () => {
    try {
      if (token) {
        await authService.logout();
      }
    } catch {
      // Ignore network errors on logout
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('chakan_job_auth_token');
      localStorage.removeItem('chakan_job_user');
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('chakan_job_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
