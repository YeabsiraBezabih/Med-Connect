import React from 'react';
import { Link } from 'react-router-dom';
import { Pill, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Globe, ArrowRight, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { isAuthenticated } = useAuth();
  
  return (
    <footer className="bg-gray-900 pt-16 pb-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Logo and About */}
          <div className="md:col-span-4">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-500/10 p-2 rounded-xl">
                <Pill className="h-8 w-8 text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-white">MedConnect</span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-8">
              Connecting patients with local pharmacies across Ethiopia. Find medicine, upload prescriptions, and get the care you need.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white p-2 rounded-lg transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white p-2 rounded-lg transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white p-2 rounded-lg transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h3 className="text-lg font-semibold text-white mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                  <ArrowRight className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:translate-x-1" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                  <ArrowRight className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:translate-x-1" />
                  <span>Find Medicine</span>
                </Link>
              </li>
              <li>
                <Link 
                  to={isAuthenticated ? "/upload" : "/login?redirect=/upload"} 
                  className="text-gray-400 hover:text-white transition-colors flex items-center group"
                >
                  <ArrowRight className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:translate-x-1" />
                  <span>Upload Prescription</span>
                  {!isAuthenticated && (
                    <Lock className="h-4 w-4 ml-2 text-gray-500" />
                  )}
                </Link>
              </li>
              <li>
                <Link to="/pharmacy/login" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                  <ArrowRight className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:translate-x-1" />
                  <span>Pharmacy Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-3">
            <h3 className="text-lg font-semibold text-white mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">
                  Bole Road, Addis Ababa<br />
                  Ethiopia
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <span className="text-gray-400">+251 912 345 678</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <a href="mailto:info@medconnect.et" className="text-gray-400 hover:text-white transition-colors">
                  info@medconnect.et
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <a href="https://medconnect.et" className="text-gray-400 hover:text-white transition-colors">
                  www.medconnect.et
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-6">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for updates and health tips.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm">
              © {currentYear} MedConnect. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy-policy" className="text-gray-500 hover:text-gray-400 text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-gray-500 hover:text-gray-400 text-sm">
                Terms of Service
              </Link>
              <Link to="/faq" className="text-gray-500 hover:text-gray-400 text-sm">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;