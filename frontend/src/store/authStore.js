// src/store/authStore.js

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
      return true; // Indica sucesso
    } catch (err) {
      const errorMessage = err.response?.data?.error?.description || 'Falha no login. Verifique suas credenciais.';
      set({ 
        error: errorMessage, 
        isAuthenticated: false, 
        user: null, 
        isLoading: false 
      });
      return false; // Indica falha
    }
  },

  logout: () => {
    // Em uma autenticação baseada em sessão, não podemos "destruir" a sessão do servidor
    // diretamente do cliente. A melhor prática é limpar o estado do lado do cliente
    // e deixar o cookie expirar por conta própria ou ter um endpoint `/logout`.
    // Por enquanto, vamos apenas limpar o estado do cliente.
    set({ user: null, isAuthenticated: false, error: null });
  },
}));

export default useAuthStore;