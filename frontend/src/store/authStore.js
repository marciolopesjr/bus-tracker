import { create } from 'zustand';
import apiClient from '../apiClient';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,

  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/api/auth/login', { username, password });
      set({ 
        user: response.data.user, 
        isAuthenticated: true, 
        isLoading: false 
      });
      return true; // Indicate success
    } catch (err) {
      const errorMessage = err.response?.data?.error?.description || 'Login failed. Please check your credentials.';
      set({ 
        error: errorMessage, 
        isAuthenticated: false, 
        user: null, 
        isLoading: false 
      });
      return false; // Indicate failure
    }
  },

  logout: () => {
    // In a session-based auth, we can't directly "destroy" the server session
    // from the client. The best practice is to clear the client-side state
    // and let the cookie expire on its own or have a `/logout` endpoint.
    // For now, we'll just clear the client state.
    set({ user: null, isAuthenticated: false, error: null });
  },
}));

export default useAuthStore;