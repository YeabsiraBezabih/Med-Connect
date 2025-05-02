import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Check, X, MessageSquare, Eye } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import pharmacyService, { PrescriptionResponse } from '../../services/pharmacy.service';

const PrescriptionsTab = () => {
  const [prescriptions, setPrescriptions] = useState<PrescriptionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewPrescription, setViewPrescription] = useState<PrescriptionResponse | null>(null);
  const [responseModal, setResponseModal] = useState<PrescriptionResponse | null>(null);
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Load prescriptions
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        const data = await pharmacyService.getPrescriptions();
        if (isMounted) {
          setPrescriptions(data);
        }
      } catch (error: any) {
        if (isMounted && error.name !== 'AbortError') {
          // Only show toast for non-abort errors and when component is mounted
          if (error.response?.status === 404) {
            // Don't show toast for 404, just set empty array
            setPrescriptions([]);
          } else {
            showToast(error.message || 'Failed to load prescriptions', 'error');
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPrescriptions();

    // Cleanup function
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [showToast]); // Only depend on showToast

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Open prescription image viewer
  const openViewer = (prescription: PrescriptionResponse) => {
    setViewPrescription(prescription);
  };

  // Open response modal
  const openResponseModal = (prescription: PrescriptionResponse) => {
    setResponseModal(prescription);
    setPrice('');
    setNotes('');
  };

  // Handle response submission with better error handling
  const handleResponseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!responseModal) return;
    
    try {
      // Validate inputs
      const priceValue = parseFloat(price);
      if (isNaN(priceValue) || priceValue <= 0) {
        throw new Error('Please enter a valid price greater than 0');
      }
      
      // Send response
      const response = await pharmacyService.respondToPrescription(responseModal.id, {
        price: priceValue,
        notes: notes.trim()
      });
      
      // Update prescription list
      setPrescriptions(prev => 
        prev.map(p => p.id === responseModal.id ? response : p)
      );
      
      // Close modal and show success message
      setResponseModal(null);
      showToast('Response sent successfully', 'success');
    } catch (error: any) {
      if (error.response?.status === 400) {
        showToast(error.response?.data?.message || 'Invalid response data. Please check the price.', 'error');
      } else {
        showToast(error.message || 'Failed to send response', 'error');
      }
    }
  };

  // Start chat with user
  const startChat = (userId: number) => {
    navigate(`/chat/${userId}`);
  };

  return (
    <div>
      {/* Prescriptions List */}
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Prescription Requests</h2>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : prescriptions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prescriptions.map((prescription) => (
              <div key={prescription.id} className="card overflow-hidden">
                <div 
                  className="h-40 bg-cover bg-center cursor-pointer"
                  style={{ backgroundImage: `url(${prescription.medicine.image})` }}
                  onClick={() => openViewer(prescription)}
                >
                  <div className="flex justify-end p-2">
                    <span className={`badge ${
                      prescription.status === 'pending' ? 'badge-warning' :
                      prescription.status === 'accepted' ? 'badge-success' :
                      'badge-error'
                    }`}>
                      {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{prescription.medicine.name}</h3>
                    <span className="text-sm text-gray-500">
                      {prescription.price ? `${prescription.price.toFixed(2)} ETB` : 'No price set'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-3">
                    Uploaded: {formatDate(prescription.created_at)}
                  </p>
                  
                  {prescription.notes && (
                    <p className="text-sm text-gray-600 mb-3">{prescription.notes}</p>
                  )}
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => openViewer(prescription)}
                      className="btn-outline flex-1 py-1.5 flex items-center justify-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </button>
                    
                    {prescription.status === 'pending' && (
                      <button
                        onClick={() => openResponseModal(prescription)}
                        className="btn-primary flex-1 py-1.5 flex items-center justify-center gap-1"
                      >
                        <Check className="h-4 w-4" />
                        <span>Respond</span>
                      </button>
                    )}
                    
                    {prescription.status === 'accepted' && (
                      <button
                        onClick={() => startChat(prescription.patient)}
                        className="btn-primary flex-1 py-1.5 flex items-center justify-center gap-1"
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
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No prescriptions</h3>
            <p className="text-gray-500">
              You have no prescription requests at the moment.
            </p>
          </div>
        )}
      </div>
      
      {/* Prescription Viewer Modal */}
      {viewPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium">View Prescription</h3>
              <button
                onClick={() => setViewPrescription(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-4">
              <img
                src={viewPrescription.medicine.image}
                alt="Prescription"
                className="w-full rounded-lg"
              />
            </div>
            
            <div className="flex justify-end gap-3 p-4 border-t">
              <button
                onClick={() => setViewPrescription(null)}
                className="btn-outline"
              >
                Close
              </button>
              
              {viewPrescription.status === 'pending' && (
                <button
                  onClick={() => {
                    setViewPrescription(null);
                    openResponseModal(viewPrescription);
                  }}
                  className="btn-primary"
                >
                  Respond
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Response Modal */}
      {responseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Respond to Prescription</h3>
              <button
                onClick={() => setResponseModal(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleResponseSubmit} className="space-y-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price (ETB)
                </label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="input"
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="input h-24"
                  placeholder="Add any notes or instructions..."
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setResponseModal(null)}
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Send Response
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionsTab;