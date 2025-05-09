import axios from 'axios';

const api = axios.create({
  baseURL: 'https://med-connect-oafn.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
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

        const response = await axios.post('https://med-connect-oafn.onrender.com/api/users/token/refresh/', {
          refresh: refreshToken
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear tokens and show a toast, then trigger navigation
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // Dispatch a custom event to notify the app to redirect
        window.dispatchEvent(new CustomEvent('medconnect:unauthorized'));
        // Optionally, show a toast (if available globally)
        if (window.showGlobalToast) {
          window.showGlobalToast('Session expired. Please log in again.', 'error');
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api; 