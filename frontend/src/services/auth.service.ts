import api from './api';
import { UserProfile } from './user.service';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData extends Omit<UserProfile, 'id'> {
  password: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: UserProfile;
}

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const PHARMACY_ID_KEY = 'pharmacyId';

const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      // First, try to get the tokens
      const response = await api.post('/users/token/', credentials);
      const { access, refresh } = response.data;
      
      if (!access || !refresh) {
        throw new Error('Invalid token response from server');
      }
      
      // Store tokens with correct keys
      localStorage.setItem(ACCESS_TOKEN_KEY, access);
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
      
      try {
        // Get user profile
        const userResponse = await api.get('/users/users/me/');
        const user = userResponse.data;
        
        // If user is a pharmacy, store the pharmacy ID
        if (user.user_type === 'pharmacy') {
          if (user.pharmacy_profile && user.pharmacy_profile.id) {
            localStorage.setItem(PHARMACY_ID_KEY, user.pharmacy_profile.id.toString());
          } else {
            localStorage.removeItem(PHARMACY_ID_KEY);
            throw new Error('Pharmacy profile not found. Please contact support or re-register as a pharmacy.');
          }
        } else {
          localStorage.removeItem(PHARMACY_ID_KEY);
        }
        
        return {
          access,
          refresh,
          user
        };
      } catch (profileError: any) {
        // If getting profile fails, clear tokens and throw error
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(PHARMACY_ID_KEY);
        throw new Error(profileError.message || 'Failed to get user profile');
      }
    } catch (error: any) {
      // Clear any existing tokens
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(PHARMACY_ID_KEY);
      
      // Extract error message
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message ||
                          error.message ||
                          'Login failed';
      
      throw new Error(errorMessage);
    }
  },

  register: async (data: RegisterData): Promise<UserProfile> => {
    try {
      const response = await api.post('/users/users/register/', data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message ||
                          error.message ||
                          'Registration failed';
      
      throw new Error(errorMessage);
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('pharmacyId');
    localStorage.removeItem('medconnect_token');
    localStorage.removeItem('medconnect_user');
  },

  refreshToken: async (): Promise<string> => {
    try {
      const refresh = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refresh) {
        throw new Error('No refresh token found');
      }

      const response = await api.post('/users/token/refresh/', { refresh });
      const { access } = response.data;
      
      if (!access) {
        throw new Error('Invalid refresh token response');
      }
      
      localStorage.setItem(ACCESS_TOKEN_KEY, access);
      return access;
    } catch (error: any) {
      // Clear tokens on refresh error
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(PHARMACY_ID_KEY);
      throw error;
    }
  },

  getCurrentUser: async (): Promise<UserProfile> => {
    try {
      const response = await api.get('/users/users/me/');
      const user = response.data;
      
      // Update pharmacy ID if user is a pharmacy
      if (user.user_type === 'pharmacy' && user.pharmacy_profile?.id) {
        localStorage.setItem(PHARMACY_ID_KEY, user.pharmacy_profile.id.toString());
      }
      
      return user;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message ||
                          error.message ||
                          'Failed to get user profile';
      
      throw new Error(errorMessage);
    }
  },

  getToken: (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getPharmacyId: (): number | null => {
    const id = localStorage.getItem(PHARMACY_ID_KEY);
    return id ? parseInt(id, 10) : null;
  }
};

export default authService; 