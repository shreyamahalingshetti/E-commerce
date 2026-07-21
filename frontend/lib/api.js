import axios from 'axios';
import { getToken, removeToken } from './auth';

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 20000 // 20 seconds for low network / backend cold starts
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // Handle 401 Unauthorized (invalid/expired token)
    if (error.response && error.response.status === 401) {
      removeToken();
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    // Determine if error is eligible for retry (Network Error, Timeout, 502/503/504)
    const isNetworkOrServerError =
      !error.response ||
      error.code === 'ECONNABORTED' ||
      (error.response && error.response.status >= 500);

    if (config && isNetworkOrServerError) {
      config._retryCount = config._retryCount || 0;

      if (config._retryCount < MAX_RETRIES) {
        config._retryCount += 1;
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, config._retryCount - 1);

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, delay));
        return api(config);
      }
    }

    // Format human-readable error messages for client interface
    if (typeof window !== 'undefined' && !navigator.onLine) {
      error.message = 'You are currently offline. Please check your internet connection.';
    } else if (!error.response) {
      error.message = 'Unable to connect to backend server. Please verify your connection or backend URL setting.';
    } else if (error.code === 'ECONNABORTED') {
      error.message = 'Connection timed out due to slow network. Please try again.';
    } else if (error.response && error.response.status >= 500) {
      error.message = 'Server is currently experiencing issues. Please try again in a few moments.';
    }

    return Promise.reject(error);
  }
);

export default api;

