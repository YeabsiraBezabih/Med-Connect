import React, { useState, useEffect } from 'react';
import { Search, MapPin, AlertCircle } from 'lucide-react';
import useGeolocation from '../hooks/useGeolocation';
import { useToast } from '../contexts/ToastContext';
import { searchMedicines, searchNearbyPharmacies, Medicine } from '../services/medicineService';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MapView from '../components/MapView';

const OPENROUTESERVICE_API_KEY = "5b3ce3597851110001cf62487ed54cf83d424fc0af1792483fb0fb84";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<string | null>(null);
  const [pharmacies, setPharmacies] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'distance'>('distance');
  const [filterInStock, setFilterInStock] = useState(true);
  const [selectedPharmacyId, setSelectedPharmacyId] = useState<number | null>(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [radius, setRadius] = useState(10);
  
  const { position, error: geoError, requestLocation } = useGeolocation();
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();

  // Handle input change for search
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length > 1) {
      try {
        const results = await searchMedicines(value);
        setSuggestions(results);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (medicine: string) => {
    setSearchTerm(medicine);
    setSelectedMedicine(medicine);
    setSuggestions([]);
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchTerm.trim().length < 2) {
      showToast('Please enter a medicine name', 'error');
      return;
    }
    
    if (!position) {
      showToast('Location sharing is required to search for medicines nearby. Please enable location.', 'error');
      requestLocation();
      return;
    }
    
    setSelectedMedicine(searchTerm);
  };

  // Sort pharmacies
  const sortedPharmacies = () => {
    if (!pharmacies.length) return [];
    
    // Apply filters
    let filtered = pharmacies;
    if (filterInStock) {
      filtered = filtered.filter(p => p.stock > 0);
    }
    
    // Apply sorting
    return filtered.sort((a, b) => {
      if (sortBy === 'price') {
        return a.price - b.price;
      } else {
        return a.distance - b.distance;
      }
    });
  };

  // Load pharmacies when medicine is selected and location is available
  useEffect(() => {
    const fetchPharmacies = async () => {
      if (selectedMedicine && position) {
        setLoading(true);
        try {
          const results = await searchNearbyPharmacies(
            selectedMedicine,
            position.latitude,
            position.longitude,
            radius,
            sortBy
          );
          setPharmacies(results);
        } catch (error) {
          console.error('Error fetching pharmacies:', error);
          showToast('Failed to fetch pharmacies', 'error');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPharmacies();
  }, [selectedMedicine, position, showToast, sortBy, radius]);

  // Show geolocation error if any
  useEffect(() => {
    if (geoError) {
      showToast(geoError, 'error');
    }
  }, [geoError, showToast]);

  // When pharmacies change, reset selected pharmacy to the first
  useEffect(() => {
    if (sortedPharmacies().length > 0) {
      setSelectedPharmacyId(sortedPharmacies()[0].pharmacy.id);
    } else {
      setSelectedPharmacyId(null);
    }
  }, [pharmacies, sortBy, filterInStock]);

  // MapView expects pharmacies as array of {id, name, latitude, longitude, address}
  const mapPharmacies = sortedPharmacies().map((med) => ({
    id: med.pharmacy.id,
    name: med.pharmacy.name,
    latitude: med.pharmacy.latitude,
    longitude: med.pharmacy.longitude,
    address: med.pharmacy.address,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Find Medicine</h1>
      
        {/* Search form */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search for a medicine..."
                className="input pl-10"
                disabled={!position}
              />
              {suggestions.length > 0 && (
                <div className="absolute z-10 w-full bg-white mt-1 border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                      onClick={() => handleSelectSuggestion(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {!position && (
              <div className="text-red-600 text-center font-semibold mt-2">
                Location sharing is required to search for medicines nearby. Please enable location.
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                type="submit" 
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <Search className="h-5 w-5" />
                <span>Search</span>
              </button>
              
              {!position && (
                <button 
                  type="button"
                  onClick={requestLocation}
                  className="btn-outline flex items-center justify-center gap-2"
                >
                  <MapPin className="h-5 w-5" />
                  <span>Enable Location</span>
                </button>
              )}
            </div>
          </form>
        </div>
        
        {/* Results */}
        {selectedMedicine && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-semibold">
                Showing results for: <span className="text-blue-600">{selectedMedicine}</span>
              </h2>
              
              <div className="flex flex-wrap gap-2">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'price' | 'distance')}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="distance">Sort by Distance</option>
                  <option value="price">Sort by Price</option>
                </select>
                <select
                  value={radius}
                  onChange={e => setRadius(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value={1}>1 km</option>
                  <option value={2}>2 km</option>
                  <option value={5}>5 km</option>
                  <option value={10}>10 km</option>
                  <option value={20}>20 km</option>
                  <option value={50}>50 km</option>
                </select>
                <span className="text-sm text-gray-500">Radius: {radius} km</span>
                <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <input 
                    type="checkbox"
                    checked={filterInStock}
                    onChange={(e) => setFilterInStock(e.target.checked)}
                    className="text-blue-500 focus:ring-blue-500"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : sortedPharmacies().length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sortedPharmacies().map((medicine) => (
                  <div key={medicine.id} className="card hover:shadow-lg overflow-hidden">
                    <div className="p-5">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-semibold text-lg">{medicine.pharmacy.name}</h3>
                        <span className={`badge ${medicine.stock > 0 ? 'badge-success' : 'badge-error'}`}>
                          {medicine.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-gray-600 mb-3">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{medicine.pharmacy.address}</span>
                      </div>
                      
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-gray-600">
                          <span className="font-semibold text-gray-900">{medicine.distance.toFixed(1)} km</span> away
                        </div>
                        <div>
                          <span className="font-bold text-xl text-gray-900">{medicine.price.toFixed(2)} ETB</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col xs:flex-row gap-2">
                        {isAuthenticated ? (
                          <Link 
                            to={`/chat/${medicine.pharmacy.id}`}
                            className="btn-primary flex-1 text-center"
                          >
                            Chat with Pharmacy
                          </Link>
                        ) : (
                          <Link 
                            to={`/login?redirect=/chat/${medicine.pharmacy.id}`}
                            className="btn-primary flex-1 text-center"
                          >
                            Login to Chat
                          </Link>
                        )}
                        <a 
                          href={`tel:${medicine.pharmacy.phone}`}
                          className="btn-outline flex-1 text-center"
                        >
                          Call
                        </a>
                        <button
                          className="btn-outline flex-1 text-center"
                          onClick={() => {
                            setSelectedPharmacyId(medicine.pharmacy.id);
                            setShowMapModal(true);
                          }}
                        >
                          View on Map
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <div className="flex justify-center mb-4">
                  <AlertCircle className="h-12 w-12 text-yellow-500" />
                </div>
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Results Found</h3>
                <p className="text-yellow-700">
                  We couldn't find any pharmacies with {selectedMedicine} near your location.
                  Try searching for a different medicine or expanding your search radius.
                </p>
              </div>
            )}

            {selectedMedicine && position && mapPharmacies.length > 0 && selectedPharmacyId && (
              <div className="my-8">
                <h3 className="text-lg font-semibold mb-2 text-center">Map View</h3>
                <MapView
                  userLocation={{ lat: position.latitude, lng: position.longitude }}
                  pharmacies={mapPharmacies}
                  selectedPharmacyId={selectedPharmacyId}
                  onSelectPharmacy={setSelectedPharmacyId}
                  apiKey={OPENROUTESERVICE_API_KEY}
                />
              </div>
            )}

            {/* Map Modal for single pharmacy */}
            {showMapModal && selectedPharmacyId && (
              <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-4 relative flex flex-col max-h-[90vh]">
                  <button onClick={() => setShowMapModal(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
                  <h2 className="text-xl font-bold mb-2 text-center">Pharmacy Location</h2>
                  <div className="flex-1 overflow-y-auto mb-2 px-1" style={{ minHeight: 300 }}>
                    <MapView
                      userLocation={{ lat: position.latitude, lng: position.longitude }}
                      pharmacies={mapPharmacies}
                      selectedPharmacyId={selectedPharmacyId}
                      onSelectPharmacy={() => {}}
                      apiKey={OPENROUTESERVICE_API_KEY}
                      singlePharmacyMode={true}
                    />
                  </div>
                  <a
                    href={`https://maps.google.com/?q=${mapPharmacies.find(p => p.id === selectedPharmacyId)?.latitude},${mapPharmacies.find(p => p.id === selectedPharmacyId)?.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full mt-4 text-center"
                  >
                    View on Google Maps
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;