// API configuration
const getApiBase = () => {
  if (typeof window !== 'undefined') {
    // Check if we're in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3001/api';
    }
    // Production URL - replace with your deployed backend URL
    return 'https://tics-u3io.onrender.com/api';
  }
  // Fallback for SSR or other environments
  return 'http://localhost:3001/api';
};

export const API_BASE = getApiBase();
