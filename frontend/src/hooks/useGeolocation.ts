import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Position {
  latitude: number;
  longitude: number;
}

interface GeolocationHook {
  position: Position | null;
  error: string | null;
  loading: boolean;
  requestLocation: () => void;
}

const useGeolocation = (): GeolocationHook => {
  const [position, setPosition] = useState<Position | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { updateLocation } = useAuth();

  // Function to request location permission and get coordinates
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setPosition({ latitude, longitude });
        updateLocation(latitude, longitude);
        setLoading(false);
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access was denied. Please enable location services.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'The request to get location timed out.';
            break;
        }
        
        setError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000
      }
    );
  };

  // Attempt to get location on component mount if available in storage
  useEffect(() => {
    const storedUser = localStorage.getItem('medconnect_user');
    
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.location?.lat && user.location?.lng) {
        setPosition({
          latitude: user.location.lat,
          longitude: user.location.lng
        });
      }
    }
  }, []);

  return { position, error, loading, requestLocation };
};

export default useGeolocation;