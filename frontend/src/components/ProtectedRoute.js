/**
 * @file components/ProtectedRoute.js
 * @description Route guard for authenticated & admin-only routes.
 *
 * Props:
 *   - children   — Protected page component
 *   - adminOnly  — If true, only admin users can access
 *
 * Behavior: Shows Loader while checking auth, redirects to /login if not authenticated.
 */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

export default ProtectedRoute;
