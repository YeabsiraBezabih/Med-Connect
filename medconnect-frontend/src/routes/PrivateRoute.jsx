import { Navigate } from 'react-router-dom';
import useAuthStore from '../contexts/authStore';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute; 