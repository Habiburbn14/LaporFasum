import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL || '';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
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
        sessionStorage.setItem('access_token', token);
        set({ token });
        if (userData) {
          set({ user: userData, loading: false });
        } else {
          await get().fetchUser();
        }
      },

      logout: () => {
        sessionStorage.removeItem('access_token');
        set({ user: null, token: null, loading: false });
      },

      updateUser: (userData) => set({ user: userData }),
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ token: state.token, user: state.user }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setLoading(false);
          if (state.token) state.fetchUser();
        }
      },
    }
  )
);