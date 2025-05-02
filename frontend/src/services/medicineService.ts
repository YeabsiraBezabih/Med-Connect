import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface Pharmacy {
  id: number;
  name: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
}

export interface Medicine {
  id: number;
  name: string;
  price: number;
  stock: number;
  requires_prescription: boolean;
  pharmacy: Pharmacy;
  distance: number;
}

// Function to search medicines by name (for autocomplete)
export const searchMedicines = async (query: string): Promise<string[]> => {
  try {
    const response = await axios.get<Medicine[]>(`${API_URL}/pharmacy/medicines/`, {
      params: { search: query }
    });
    // Extract unique medicine names from the response
    return [...new Set(response.data.map((med: Medicine) => med.name))];
  } catch (error) {
    console.error('Error searching medicines:', error);
    return [];
  }
};

// Function to search nearby pharmacies that have the medicine
export const searchNearbyPharmacies = async (
  name: string,
  latitude: number,
  longitude: number,
  radius: number = 10
): Promise<Medicine[]> => {
  try {
    const response = await axios.get<Medicine[]>(`${API_URL}/pharmacy/medicines/search_nearby/`, {
      params: {
        name,
        lat: latitude,
        lng: longitude,
        radius
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching nearby pharmacies:', error);
    throw error;
  }
}; 