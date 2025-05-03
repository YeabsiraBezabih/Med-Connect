import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Building, Mail, Lock, Eye, EyeOff, Phone, MapPin } from 'lucide-react';
import useGeolocation from '../../hooks/useGeolocation';

const PharmacyRegister = () => {
  const [formData, setFormData] = useState({
    business_name: '',
    email: '',
    phone_number: '',
    address: '',
    license_number: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [locationTouched, setLocationTouched] = useState(false);
  
  const { register, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { position, error: geoError, requestLocation } = useGeolocation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleGetLocation = () => {
    setLocationTouched(true);
    requestLocation();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.acceptTerms) {
      showToast('Please accept the Terms of Service and Privacy Policy', 'error');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    
    if (formData.password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    
    if (!position) {
      showToast('Please grab your pharmacy location to register', 'error');
      setLocationTouched(true);
      return;
    }
    
    try {
      const registerData = {
        username: formData.email,
        email: formData.email,
        password: formData.password,
        first_name: formData.business_name,
        last_name: formData.business_name,
        user_type: 'pharmacy' as const,
        phone_number: formData.phone_number,
        address: formData.address,
        license_number: formData.license_number,
        latitude: position.latitude,
        longitude: position.longitude
      };
      
      await register(registerData);
      localStorage.removeItem('pharmacyId');
      showToast('Registration successful!', 'success');
      navigate('/pharmacy/dashboard');
    } catch (error: any) {
      console.error('Registration error:', error);
      showToast(error.response?.data?.detail || 'Registration failed', 'error');
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Show geolocation error if any
  React.useEffect(() => {
    if (geoError) {
      showToast(geoError, 'error');
    }
  }, [geoError, showToast]);

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Register Your Pharmacy</h1>
            <p className="text-gray-600 mt-2">Join MedConnect to reach more customers</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="business_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Pharmacy Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="business_name"
                    name="business_name"
                    type="text"
                    value={formData.business_name}
                    onChange={handleChange}
                    required
                    className="input pl-10"
                    placeholder="ABC Pharmacy"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input pl-10"
                    placeholder="pharmacy@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    value={formData.phone_number}
                    onChange={handleChange}
                    required
                    className="input pl-10"
                    placeholder="+251 91 234 5678"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Physical Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="input pl-10 pt-2 h-24"
                    placeholder="Detailed address including neighborhood and landmarks"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="license_number" className="block text-sm font-medium text-gray-700 mb-1">
                  Pharmacy License Number
                </label>
                <input
                  id="license_number"
                  name="license_number"
                  type="text"
                  value={formData.license_number}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder="License/Registration Number"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="input pl-10 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={toggleShowPassword}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="input pl-10"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pharmacy Location <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    className="btn-outline flex items-center gap-2"
                  >
                    <MapPin className="h-5 w-5" />
                    {position ? 'Re-grab Location' : 'Grab Location'}
                  </button>
                  {position && (
                    <span className="text-xs text-green-700">Lat: {position.latitude.toFixed(5)}, Lng: {position.longitude.toFixed(5)}</span>
                  )}
                  {!position && locationTouched && (
                    <span className="text-xs text-red-600">Location required</span>
                  )}
                </div>
              </div>
              
              {/* Terms and Privacy Policy */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="acceptTerms"
                    name="acceptTerms"
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    required
                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                    disabled={loading}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="acceptTerms" className="font-medium text-gray-700">
                    I accept the{' '}
                    <Link to="/terms-of-service" className="text-primary hover:text-primary-dark" target="_blank">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy-policy" className="text-primary hover:text-primary-dark" target="_blank">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full btn-primary"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have a pharmacy account?{' '}
                <Link to="/pharmacy/login" className="text-blue-600 hover:text-blue-500 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyRegister;