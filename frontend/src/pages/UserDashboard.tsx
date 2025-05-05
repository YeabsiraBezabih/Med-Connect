import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, FileText, MessageSquare, Clock, AlertCircle, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import userService, { Prescription, SearchHistory, Order } from '../services/user.service';
import MapView from '../components/MapView';
import chatService, { ChatRoom } from '../services/chat.service';

const REFRESH_INTERVAL = 60000; // Refresh every 60 seconds instead of 30

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState<'searches' | 'prescriptions' | 'chats'>('searches');
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapPharmacy, setMapPharmacy] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [chats, setChats] = useState<ChatRoom[]>([]);
  
  const { user } = useAuth();
  const { showToast } = useToast();

  // Fetch all data in parallel
  const fetchAllData = useCallback(async (showErrorToast = true) => {
    try {
      setError(null);
      setLoading(true);
      const now = Date.now();
      if (now - lastFetchTime < 5000) return;
      setLastFetchTime(now);
      const [searches, prescs] = await Promise.all([
        userService.getSearchHistory(),
        userService.getPrescriptions(),
      ]);
      setSearchHistory(searches || []);
      setPrescriptions(prescs || []);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to fetch data';
      setError(errorMessage);
      if (showErrorToast) showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast, lastFetchTime]);

  // Fetch only the active tab's data
  const fetchTabData = useCallback(async (showErrorToast = true) => {
    try {
      setError(null);
      setLoading(true);
      const now = Date.now();
      if (now - lastFetchTime < 5000) return;
      setLastFetchTime(now);
      if (activeTab === 'searches') {
        setSearchHistory(await userService.getSearchHistory() || []);
      } else if (activeTab === 'prescriptions') {
        setPrescriptions(await userService.getPrescriptions() || []);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to fetch data';
      setError(errorMessage);
      if (showErrorToast) showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  }, [activeTab, showToast, lastFetchTime]);

  // Initial data load (parallel)
  useEffect(() => {
    if (!user) return;
    fetchAllData(true);
  }, [user, fetchAllData]);

  // Fetch only the tab's data on navigation
  useEffect(() => {
    if (!user) return;
    fetchTabData(true);
  }, [activeTab, user, fetchTabData]);
    
  // Auto-refresh all data
  useEffect(() => {
    if (!user) return;
    const intervalId = setInterval(() => {
      fetchAllData(false);
    }, REFRESH_INTERVAL);
    return () => clearInterval(intervalId);
  }, [user, fetchAllData]);

  // Add effect to get user location
  useEffect(() => {
    if (!userLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation(null)
      );
    }
  }, [userLocation]);

  // Fetch chats when Chats tab is active
  useEffect(() => {
    if (activeTab === 'chats') {
      chatService.getChatRooms().then(setChats).catch(() => setChats([]));
    }
  }, [activeTab]);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600 mb-6">Manage your medicine searches, prescriptions, and orders</p>
        
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('searches')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium ${
                activeTab === 'searches'
                  ? 'text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Search className="h-5 w-5" />
              <span>Search History</span>
            </button>
            <button
              onClick={() => setActiveTab('prescriptions')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium ${
                activeTab === 'prescriptions'
                  ? 'text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="h-5 w-5" />
              <span>Prescriptions</span>
            </button>
            <button
              onClick={() => setActiveTab('chats')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium ${
                activeTab === 'chats'
                  ? 'text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <MessageSquare className="h-5 w-5" />
              <span>Chats</span>
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600">{error}</p>
                <button 
                  onClick={fetchTabData}
                  className="mt-4 text-blue-600 hover:text-blue-800"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
                {/* Search History Tab */}
                {activeTab === 'searches' && (
                  <div>
                    {searchHistory.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Medicine
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Pharmacies Viewed
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {searchHistory.map((item) => (
                              <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {item.medicine}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {formatDate(item.date)}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {item.pharmacies_viewed}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <Link 
                                    to={`/search?query=${encodeURIComponent(item.medicine)}`}
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    Search Again
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No search history</h3>
                        <p className="text-gray-500">
                          Start searching for medicines to see your history here
                        </p>
                        <Link to="/search" className="btn-primary mt-4 inline-block">
                          Search Medicines
                        </Link>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Prescriptions Tab */}
                {activeTab === 'prescriptions' && (
                  <div>
                    {prescriptions.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {prescriptions.map((prescription) => (
                          <div key={prescription.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedPrescription(prescription)}>
                            <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                              <img 
                                src={prescription.prescription_image} 
                                alt="Prescription" 
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <div className="p-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-500">
                                  Uploaded: {formatDate(prescription.created_at)}
                                </span>
                                <span className={`badge ${
                                  prescription.status === 'approved' ? 'badge-success' :
                                  prescription.status === 'rejected' ? 'badge-error' :
                                  'badge-warning'
                                }`}>
                                  {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                                </span>
                              </div>
                              {prescription.notes && (
                                <p className="text-sm text-gray-600 mt-2">{prescription.notes}</p>
                              )}
                              <div className="flex items-center gap-2 mt-2">
                                <span
                                  className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer"
                                  onClick={() => setSelectedPrescription(prescription)}
                                >
                                  View Details
                                </span>
                                {prescription.status === 'accepted' && prescription.chat_room_id && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.location.href = `/chat/${prescription.chat_room_id}`;
                                    }}
                                    className="btn-primary flex items-center gap-1"
                                  >
                                    <MessageSquare className="h-4 w-4" />
                                    <span>Chat</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No prescriptions uploaded</h3>
                        <p className="text-gray-500">
                          Upload a prescription to receive offers from nearby pharmacies
                        </p>
                        <Link to="/upload" className="btn-primary mt-4 inline-block">
                          Upload Prescription
                        </Link>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Chats Tab */}
                {activeTab === 'chats' && (
                  <div>
                    {chats.length > 0 ? (
                      <div className="space-y-4">
                        {chats.map((chat) => (
                          <div
                            key={chat.id}
                            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors flex items-center gap-4"
                          >
                            <div className="flex-1">
                              <div className="font-medium text-lg">
                                {chat.pharmacy?.first_name || chat.pharmacy?.username || 'Pharmacy'}
                              </div>
                              <div className="text-gray-500 text-sm mb-2">Chat Room #{chat.id}</div>
                              <button
                                onClick={() => window.location.href = `/chat/${chat.id}`}
                                className="btn-primary flex items-center gap-1"
                              >
                                <MessageSquare className="h-4 w-4" />
                                <span>Chat</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No chats yet</h3>
                        <p className="text-gray-500">
                          You will see your chats with accepted pharmacies here.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
        {/* Prescription Detail Modal */}
        {selectedPrescription && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-lg w-full" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
              <div className="flex justify-between items-center border-b p-4">
                <h3 className="text-lg font-medium">Prescription Details</h3>
                <button onClick={() => setSelectedPrescription(null)} className="text-gray-400 hover:text-gray-500"><X className="h-6 w-6" /></button>
              </div>
              <div className="p-4">
                <img src={selectedPrescription.prescription_image} alt="Prescription" className="w-full rounded mb-4" />
                <div className="mb-2"><strong>Status:</strong> {selectedPrescription.status}</div>
                <div className="mb-2"><strong>Notes:</strong> {selectedPrescription.notes || 'None'}</div>
                <div className="mb-2"><strong>Created At:</strong> {formatDate(selectedPrescription.created_at)}</div>
                <div className="mb-2"><strong>Updated At:</strong> {formatDate(selectedPrescription.updated_at)}</div>
                <div className="mb-2"><strong>Patient ID:</strong> {selectedPrescription.patient}</div>
                <div className="mb-2">
                  {selectedPrescription.pharmacy && (
                    <div className="mb-2 text-green-700 font-semibold">
                      {selectedPrescription.pharmacy.business_name} has the prescribed medicine.
                    </div>
                  )}
                  <strong>Pharmacy:</strong> {selectedPrescription.pharmacy ? (
                    <div className="border rounded p-2 bg-gray-50 mt-1">
                      <div><strong>Name:</strong> {selectedPrescription.pharmacy.business_name}</div>
                      <div><strong>Address:</strong> {selectedPrescription.pharmacy.user.address}</div>
                      <div><strong>Phone:</strong> {selectedPrescription.pharmacy.user.phone_number}</div>
                      <div><strong>Email:</strong> {selectedPrescription.pharmacy.user.email}</div>
                      <div><strong>Operating Hours:</strong> {selectedPrescription.pharmacy.operating_hours}</div>
                      {(selectedPrescription.pharmacy.latitude && selectedPrescription.pharmacy.longitude) && (
                        <button
                          className="btn-outline mt-2"
                          onClick={() => {
                            setMapPharmacy(selectedPrescription.pharmacy);
                            setShowMapModal(true);
                          }}
                        >
                          View on Map
                        </button>
                      )}
                    </div>
                  ) : 'N/A'}
                </div>
              </div>
              <div className="flex justify-end p-4 border-t">
                {selectedPrescription.chat_room_id && (
                  <button
                    onClick={() => {
                      window.location.href = `/chat/${selectedPrescription.chat_room_id}`;
                    }}
                    className="btn-primary mr-2 flex items-center gap-1"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Chat with Pharmacy</span>
                  </button>
                )}
                <button onClick={() => setSelectedPrescription(null)} className="btn-outline">Close</button>
              </div>
            </div>
          </div>
        )}
        
        {/* Map Modal */}
        {showMapModal && mapPharmacy && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowMapModal(false)}
              >
                <X className="h-6 w-6" />
              </button>
              <div className="p-4">
                <h3 className="text-lg font-medium mb-2">Pharmacy Location</h3>
                <MapView
                  pharmacy={{
                    lat: Number(mapPharmacy.latitude),
                    lng: Number(mapPharmacy.longitude),
                    name: mapPharmacy.business_name,
                    address: mapPharmacy.user.address,
                  }}
                  userLocation={userLocation}
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Help Section */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-yellow-800">Need Help?</h4>
              <p className="text-sm text-yellow-700 mt-1">
                If you have any questions about using MedConnect, please contact our support team
                at <a href="mailto:support@medconnect.et" className="font-medium underline">support@medconnect.et</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;