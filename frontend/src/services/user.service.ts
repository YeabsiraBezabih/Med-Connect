import api from './api';
import { AxiosError } from 'axios';

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: 'patient' | 'pharmacy';
  phone_number: string;
  address: string;
}

export interface SearchHistory {
  id: number;
  medicine: string;
  date: string;
  pharmacies_viewed: number;
}

export interface PharmacyProfile {
  id: number;
  business_name: string;
  license_number: string;
  operating_hours: string;
  latitude: number;
  longitude: number;
  is_verified: boolean;
  user: {
    id: number;
    email: string;
    phone_number: string;
    address: string;
  };
}

export interface Prescription {
  id: number;
  patient: number;
  medicine: number | null;
  pharmacy: PharmacyProfile | null;
  prescription_image: string;
  status: 'pending' | 'approved' | 'rejected' | 'filled';
  notes: string;
  created_at: string;
  updated_at: string;
  chat_room_id?: number | null;
  chat_room_url?: string | null;
}

export interface Order {
  id: number;
  patient: number;
  pharmacy: number;
  prescription: number | null;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  shipping_address: string;
  created_at: string;
  updated_at: string;
}

const userService = {
  // Get current user's profile
  getCurrentUser: async (): Promise<UserProfile> => {
    const response = await api.get('/users/users/me/');
    return response.data;
  },

  // Get user's prescriptions
  getPrescriptions: async (): Promise<Prescription[]> => {
    try {
      const response = await api.get('/pharmacy/prescriptions/');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      // If it's a 404 or empty response, return empty array
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 404 || !axiosError.response?.data) {
        return [];
      }
      throw error;
    }
  },

  // Get user's orders
  getOrders: async (): Promise<Order[]> => {
    try {
      const response = await api.get('/pharmacy/orders/');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      // If it's a 404 or empty response, return empty array
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 404 || !axiosError.response?.data) {
        return [];
      }
      throw error;
    }
  },

  // Get user's search history
  getSearchHistory: async (): Promise<SearchHistory[]> => {
    try {
      const response = await api.get('/users/search-history/');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      // If it's a 404 or empty response, return empty array
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 404 || !axiosError.response?.data) {
        return [];
      }
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await api.patch('/users/users/me/', data);
    return response.data;
  },
};

export default userService; 