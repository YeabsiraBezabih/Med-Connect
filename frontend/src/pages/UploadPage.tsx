import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Image, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import useGeolocation from '../hooks/useGeolocation';
import { uploadFileToSupabase } from '../utils/supabase';
import api from '../utils/api';

// Mock data
import { getPharmaciesForPrescription } from '../utils/mockData';

interface PharmacyOffer {
  id: string;
  name: string;
  distance: number;
  price: number;
  eta: string; // estimated time for fulfillment
  address: string;
}

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [offers, setOffers] = useState<PharmacyOffer[]>([]);
  const [prescription, setPrescription] = useState<any>(null);
  
  const { isAuthenticated } = useAuth();
  const { position, requestLocation } = useGeolocation();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Reset state when unmounting
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(selectedFile.type)) {
        showToast('Please upload a JPEG, PNG, or PDF file', 'error');
        return;
      }
      
      // Check file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        showToast('File size should be less than 5MB', 'error');
        return;
      }
      
      setFile(selectedFile);
      
      // Create preview for images
      if (selectedFile.type.startsWith('image/')) {
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);
      } else {
        // For PDF, just show an icon or text
        setPreview(null);
      }
    }
  };

  // Handle file upload
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      showToast('Please select a file to upload', 'error');
      return;
    }
    
    if (!isAuthenticated) {
      showToast('Please log in to upload a prescription', 'warning');
      navigate('/login', { state: { from: '/upload' } });
      return;
    }
    
    if (!position) {
      showToast('Please enable location to find nearby pharmacies', 'warning');
      requestLocation();
      return;
    }
    
    setUploading(true);
    try {
      // 1. Upload file to Supabase
      const downloadURL = await uploadFileToSupabase(file, (progress) => {
        // Optionally, update progress UI here
      });

      // 2. Send prescription info to backend (including downloadURL and location)
      const response = await api.post('/pharmacy/prescriptions/', {
        prescription_image: downloadURL,
        latitude: Number(position.latitude.toFixed(6)),
        longitude: Number(position.longitude.toFixed(6)),
        // Add other fields as needed (e.g., notes, patient info)
      });
      setPrescription(response.data);
      setUploading(false);
      setSubmitted(true);
      showToast('Prescription uploaded successfully!', 'success');
    } catch (error) {
      setUploading(false);
      showToast('Failed to upload prescription. Please try again.', 'error');
    }
  };

  // Clear the selected file
  const clearFile = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(null);
  };

  // Start chat with a pharmacy
  const selectPharmacy = (pharmacyId: string) => {
    // In a real app, we'd make an API call to start a chat
    navigate(`/chat/${pharmacyId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Upload Prescription</h1>
        
        {!submitted ? (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Upload your prescription image or PDF
                </label>
                
                {!file ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                    <div className="text-center">
                      <Image className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-2">
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <span className="text-blue-600 hover:text-blue-500">Click to upload</span>
                          <span className="text-gray-500"> or drag and drop</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept="image/jpeg,image/png,application/pdf"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, or PDF up to 5MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    {preview ? (
                      <div className="border rounded-lg overflow-hidden">
                        <img 
                          src={preview} 
                          alt="Prescription preview" 
                          className="max-h-80 mx-auto"
                        />
                      </div>
                    ) : (
                      <div className="border rounded-lg p-4 flex items-center justify-center bg-gray-50">
                        <div className="text-center">
                          <Image className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-500">{file.name}</p>
                        </div>
                      </div>
                    )}
                    
                    <button
                      type="button"
                      onClick={clearFile}
                      className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70 transition-all"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      Uploading a prescription will notify pharmacies near you. They will make
                      offers based on your prescription, and you can choose which pharmacy to
                      contact.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!file || uploading}
                  className={`btn-primary flex items-center gap-2 ${
                    (!file || uploading) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5" />
                      <span>Upload Prescription</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Your prescription has been successfully uploaded.
                  </p>
                </div>
              </div>
            </div>
            {prescription && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Prescription Details</h2>
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <img
                    src={prescription.prescription_image}
                    alt="Prescription"
                    className="max-h-60 rounded-lg border"
                  />
                  <div className="flex-1 space-y-2">
                    <div><span className="font-medium">Status:</span> {prescription.status}</div>
                    <div><span className="font-medium">Latitude:</span> {prescription.latitude}</div>
                    <div><span className="font-medium">Longitude:</span> {prescription.longitude}</div>
                    <div><span className="font-medium">Created At:</span> {new Date(prescription.created_at).toLocaleString()}</div>
                    {/* Add more fields as needed */}
                  </div>
                </div>
            </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;