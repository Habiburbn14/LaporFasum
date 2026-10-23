import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL || '';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: localStorage.getItem('access_token') || null,
      loading: true,

      fetchUser: async () => {
        const token = get().token;
        if (!token) {
          set({ user: null, loading: false });
          return;
        }
        try {
          const res = await axios.get(`${baseUrl}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          set({ user: res.data, loading: false });
        } catch (error) {
          console.error('Token kadaluarsa atau tidak valid:', error);
          get().logout();
        }
      },

      login: async (token, userData) => {
        localStorage.setItem('access_token', token);
        set({ token });
        if (userData) {
          set({ user: userData, loading: false });
        } else {
          await get().fetchUser();
        }
      },

      logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_data');
        set({ user: null, token: null });
      },

      updateUser: (userData) => set({ user: userData }),
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);