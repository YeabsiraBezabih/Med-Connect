import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Package, FileText, MessageSquare, Users, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Dashboard tabs
import InventoryTab from '../components/pharmacy/InventoryTab';
import PrescriptionsTab from '../components/pharmacy/PrescriptionsTab';
import ChatsTab from '../components/pharmacy/ChatsTab';

const PharmacyDashboard = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Extract current path for active tab
  const currentPath = location.pathname.split('/').pop() || 'inventory';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Pharmacy Dashboard</h1>
            <p className="text-gray-600">Manage your inventory, prescriptions, and chats</p>
          </div>
          
          <div className="flex space-x-3">
            <Link to="/pharmacy/dashboard/settings" className="btn-outline flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </div>
        </div>
        
        {/* Dashboard Tabs Navigation */}
        <div className="bg-white rounded-t-xl shadow-md overflow-hidden">
          <div className="flex border-b overflow-x-auto hide-scrollbar">
            <Link
              to="/pharmacy/dashboard"
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium min-w-max ${
                currentPath === 'inventory' || currentPath === 'dashboard'
                  ? 'text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Package className="h-5 w-5" />
              <span>Inventory</span>
            </Link>
            <Link
              to="/pharmacy/dashboard/prescriptions"
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium min-w-max ${
                currentPath === 'prescriptions'
                  ? 'text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="h-5 w-5" />
              <span>Prescriptions</span>
            </Link>
            <Link
              to="/pharmacy/dashboard/chats"
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium min-w-max ${
                currentPath === 'chats'
                  ? 'text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <MessageSquare className="h-5 w-5" />
              <span>Chats</span>
            </Link>
          </div>
          
          {/* Tab Content */}
          <Routes>
            <Route path="/" element={<InventoryTab />} />
            <Route path="/inventory" element={<InventoryTab />} />
            <Route path="/prescriptions" element={<PrescriptionsTab />} />
            <Route path="/chats" element={<ChatsTab />} />
            <Route path="/settings" element={
              <div className="p-8 text-center">
                <h3 className="text-lg font-medium mb-2">Pharmacy Settings</h3>
                <p className="text-gray-500">
                  This feature will be available in a future update.
                </p>
              </div>
            } />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default PharmacyDashboard;