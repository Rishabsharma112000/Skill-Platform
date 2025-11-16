import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children, requiredRole }) => {
  const { token, role, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div>Loading authentication...</div>;
  }

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PrivateRoute;
