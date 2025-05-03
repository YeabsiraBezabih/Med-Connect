import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';

// Layout components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import SearchPage from './pages/SearchPage';
import UploadPage from './pages/UploadPage';
import ChatPage from './pages/ChatPage';
import UserDashboard from './pages/UserDashboard';
import PharmacyDashboard from './pages/PharmacyDashboard';

// Info pages
import PrivacyPolicy from './pages/info/PrivacyPolicy';
import TermsOfService from './pages/info/TermsOfService';
import FAQ from './pages/info/FAQ';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PharmacyLogin from './pages/auth/PharmacyLogin';
import PharmacyRegister from './pages/auth/PharmacyRegister';

// Route guards
import ProtectedRoute from './components/auth/ProtectedRoute';
import PharmacyRoute from './components/auth/PharmacyRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route 
                  path="/upload" 
                  element={
                    <ProtectedRoute>
                      <UploadPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/chat/:id" 
                  element={
                    <ProtectedRoute>
                      <ChatPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Info pages */}
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/faq" element={<FAQ />} />
                
                {/* Auth routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/pharmacy/login" element={<PharmacyLogin />} />
                <Route path="/pharmacy/register" element={<PharmacyRegister />} />
                
                {/* Protected routes */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <UserDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/pharmacy/dashboard/*" 
                  element={
                    <PharmacyRoute>
                      <PharmacyDashboard />
                    </PharmacyRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;