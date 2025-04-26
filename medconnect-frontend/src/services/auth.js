import api from './index';

// Login with JWT
export const login = async (credentials) => {
  try {
    const response = await api.post('/users/token/', credentials);
    // Save tokens to localStorage
    localStorage.setItem('token', response.data.access);
    localStorage.setItem('refresh', response.data.refresh);
    return true;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred during login' };
  }
};

// Register a new user and log them in automatically
export const register = async (userData) => {
  try {
    const response = await api.post('/users/users/', userData);
    // Save tokens to localStorage if present
    if (response.data.access && response.data.refresh) {
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred during registration' };
  }
};

// Logout (JWT blacklist)
export const logout = async () => {
  try {
    const refresh = localStorage.getItem('refresh');
    if (refresh) {
      await api.post('/users/users/logout/', { refresh });
    }
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// Get current user info
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/users/users/me/');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get user data' };
  }
}; 