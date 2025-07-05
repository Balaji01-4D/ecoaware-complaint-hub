
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookie-based auth
});

// Add request interceptor to handle requests
apiClient.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.log('Response error:', error.response?.status, error.config?.url);
    
    if (error.response?.status === 401) {
      // Only redirect to login if we're not already on the login page
      // and if we're not making an auth check request
      const isAuthCheck = error.config?.url?.includes('/auth/me');
      const isLoginPage = window.location.pathname === '/login';
      
      console.log('401 error - isAuthCheck:', isAuthCheck, 'isLoginPage:', isLoginPage);
      
      if (!isLoginPage && !isAuthCheck) {
        // Clear any potentially malformed cookies
        document.cookie = 'Authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost;';
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
