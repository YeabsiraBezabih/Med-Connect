import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add a request interceptor to add the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Debug log for requests
    console.log('Making request:', {
      method: config.method,
      url: config.url,
      data: config.data,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for handling token refresh
api.interceptors.response.use(
  (response) => {
    // Debug log for successful responses
    console.log('Response received:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error is a 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(`${API_URL}/users/token/refresh/`, {
          refresh: refreshToken
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Log error details
    console.error('Response error:', {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });

    // Extract error message from response
    const errorMessage = error.response?.data?.detail || 
                        error.response?.data?.message || 
                        error.message || 
                        'An error occurred';
    
    error.message = errorMessage;
    return Promise.reject(error);
  }
);

export default api; 