import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import PatientDashboard from '../pages/PatientDashboard';
import PharmacyDashboard from '../pages/PharmacyDashboard';
import BroadcastDetailPage from '../pages/BroadcastDetailPage';
import UploadPage from '../pages/UploadPage';
import LandingPage from '../pages/LandingPage';
import ResponseDetailPage from '../pages/ResponseDetailPage';
import ChatPage from '../pages/ChatPage';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/patient/dashboard"
          element={
            <PrivateRoute>
              <PatientDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/pharmacy/dashboard"
          element={
            <PrivateRoute>
              <PharmacyDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/broadcasts/:id"
          element={
            <PrivateRoute>
              <BroadcastDetailPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <PrivateRoute>
              <UploadPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/responses/:id"
          element={
            <PrivateRoute>
              <ResponseDetailPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat/:id"
          element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRouter; 