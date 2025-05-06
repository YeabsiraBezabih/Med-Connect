import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';

interface MapViewProps {
  pharmacy: {
    lat: number;
    lng: number;
    name: string;
    address?: string;
  };
  userLocation?: { lat: number; lng: number } | null;
}

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const isValidCoord = (val: number | undefined | null) => typeof val === 'number' && !isNaN(val);

// Add your OpenRouteService API key here
const ORS_API_KEY = '5b3ce3597851110001cf62487ed54cf83d424fc0af1792483fb0fb84'; // TODO: Replace with your real key

const MapView: React.FC<MapViewProps> = ({ pharmacy, userLocation }) => {
  const [route, setRoute] = useState<[number, number][]>([]);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const hasUserLoc = userLocation && isValidCoord(userLocation.lat) && isValidCoord(userLocation.lng);

  const center = hasUserLoc
    ? {
        lat: (userLocation!.lat + pharmacy.lat) / 2,
        lng: (userLocation!.lng + pharmacy.lng) / 2,
      }
    : { lat: pharmacy.lat, lng: pharmacy.lng };

  useEffect(() => {
    const fetchRoute = async () => {
      if (!hasUserLoc || !ORS_API_KEY) {
        setRoute([
          [userLocation!.lat, userLocation!.lng],
          [pharmacy.lat, pharmacy.lng],
        ]);
        return;
      }
      setLoadingRoute(true);
      try {
        const start = `${userLocation!.lng},${userLocation!.lat}`;
        const end = `${pharmacy.lng},${pharmacy.lat}`;
        const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${start}&end=${end}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data && data.features && data.features[0] && data.features[0].geometry && data.features[0].geometry.coordinates) {
          // geometry.coordinates is an array of [lng, lat] pairs
          const coords = data.features[0].geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng]);
          setRoute(coords);
        } else {
          setRoute([
            [userLocation!.lat, userLocation!.lng],
            [pharmacy.lat, pharmacy.lng],
          ]);
        }
      } catch (e) {
        setRoute([
          [userLocation!.lat, userLocation!.lng],
          [pharmacy.lat, pharmacy.lng],
        ]);
      } finally {
        setLoadingRoute(false);
      }
    };
    if (hasUserLoc) fetchRoute();
  }, [hasUserLoc, userLocation, pharmacy]);

  if (!isValidCoord(pharmacy.lat) || !isValidCoord(pharmacy.lng)) {
    return <div className="text-red-500">Pharmacy location unavailable.</div>;
  }

  return (
    <div style={{ width: '100%', height: 'min(60vw, 400px)', maxHeight: 400, position: 'relative' }}>
      {loadingRoute && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60 z-10">
          <span className="text-blue-600 font-semibold">Loading route...</span>
        </div>
      )}
      {/* @ts-expect-error: react-leaflet types may be outdated, but these props are valid */}
      <MapContainer center={center} zoom={14} style={{ height: '100%', width: '100%' }}>
        {/* @ts-expect-error: react-leaflet types may be outdated, but these props are valid */}
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
        {hasUserLoc && (
          // @ts-expect-error: react-leaflet types may be outdated, but these props are valid
          <Marker position={[userLocation!.lat, userLocation!.lng]} icon={userIcon as any}>
            <Popup>You are here</Popup>
          </Marker>
        )}
        {/* @ts-expect-error: react-leaflet types may be outdated, but these props are valid */}
        <Marker position={[pharmacy.lat, pharmacy.lng]}>
          <Popup>
            <div>
              <strong>{pharmacy.name}</strong>
              <br />
              {pharmacy.address}
            </div>
          </Popup>
        </Marker>
        {hasUserLoc && route.length > 1 && (
          <Polyline positions={route} pathOptions={{ color: 'blue' }} />
        )}
      </MapContainer>
    </div>
  );
};

export default MapView;