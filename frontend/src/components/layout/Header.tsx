import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, X, User, LogOut, PlusCircle, Search, Pill, Lock } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const isPharmacy = user?.user_type === 'pharmacy';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 z-30 w-full transition-all duration-300 ${
      isScrolled ? 'bg-white/40 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className={`p-2 rounded-xl transition-all duration-300 bg-blue-100`}>
              <Pill className={`h-6 w-6 transition-colors duration-300 text-blue-600`} />
            </div>
            <span className={`text-xl font-bold transition-colors duration-300 text-gray-900`}>MedConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {!isPharmacy && (
              <>
                <Link 
                  to="/search" 
                  className={`transition-colors duration-300 text-gray-600 hover:text-blue-600`}
                >
                  Find Medicine
                </Link>
                <div className="relative group">
                  <Link 
                    to={isAuthenticated ? "/upload" : "/login?redirect=/upload"}
                    className={`transition-colors duration-300 text-gray-600 hover:text-blue-600 flex items-center gap-1`}
                  >
                    Upload Prescription
                    {!isAuthenticated && <Lock className="h-4 w-4" />}
                  </Link>
                  {!isAuthenticated && (
                    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-48 bg-gray-800 text-white text-xs py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      Please login to upload prescriptions
                    </div>
                  )}
                </div>
              </>
            )}
            
            {isAuthenticated ? (
              <>
                <Link 
                  to={isPharmacy ? "/pharmacy/dashboard" : "/dashboard"}
                  className={`transition-colors duration-300 text-gray-600 hover:text-blue-600`}
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 bg-gray-100 text-gray-700 hover:bg-gray-200`}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className={`px-4 py-2 rounded-full transition-all duration-300 bg-gray-100 text-gray-700 hover:bg-gray-200`}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMenu}
            className={`md:hidden p-2 rounded-lg transition-colors duration-300 hover:bg-gray-100 text-gray-700`}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col space-y-3">
              {!isPharmacy && (
                <>
                  <Link 
                    to="/search" 
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Search className="h-5 w-5 text-gray-500" />
                    <span>Find Medicine</span>
                  </Link>
                  <Link 
                    to={isAuthenticated ? "/upload" : "/login?redirect=/upload"}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <PlusCircle className="h-5 w-5 text-gray-500" />
                    <span>Upload Prescription</span>
                    {!isAuthenticated && <Lock className="h-4 w-4 text-gray-500" />}
                  </Link>
                </>
              )}
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to={isPharmacy ? "/pharmacy/dashboard" : "/dashboard"}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-5 w-5 text-gray-500" />
                    <span>Dashboard</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg text-left w-full"
                  >
                    <LogOut className="h-5 w-5 text-gray-500" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="pt-2 space-y-2">
                  <Link 
                    to="/login" 
                    className={`block w-full p-2 text-center border border-gray-300 rounded-lg transition-colors hover:bg-gray-50`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="block w-full p-2 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;