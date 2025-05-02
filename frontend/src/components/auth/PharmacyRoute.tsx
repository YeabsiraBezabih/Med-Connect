import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface PharmacyRouteProps {
  children: React.ReactNode;
}

const PharmacyRoute: React.FC<PharmacyRouteProps> = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || user?.user_type !== 'pharmacy') {
    return <Navigate to="/pharmacy/login" />;
  }

  return <>{children}</>;
};

export default PharmacyRoute;