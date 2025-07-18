import React from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../app/store';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  if (loading === 'pending') {
    return <p>Checking authentication...</p>; 
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;