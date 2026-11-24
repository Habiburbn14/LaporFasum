import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';
import { persistedAuthStorage, clearPersistedAuth } from '../lib/storage';

const baseUrl = import.meta.env.VITE_BASE_URL || '';

// Role mapping: 1 = user/warga, 2 = admin kecamatan, 3 = admin kabupaten
export const ROLE = {
  USER: 1,
  ADMIN_KECAMATAN: 2,
  ADMIN_KABUPATEN: 3,
};

const roleOf = (user) => {
  if (!user) return null;
  const raw = user.id_role ?? user.role ?? null;
  if (raw === null || raw === undefined || raw === '') return null;
  const parsed = Number(raw);
  return Number.isNaN(parsed) ? null : parsed;
};

const homePathForRole = (role) => {
  if (role === ROLE.ADMIN_KABUPATEN) return '/admin/master';
  if (role === ROLE.ADMIN_KECAMATAN) return '/admin/triage';
  return '/';
};

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
          // Add timeout to axios request
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout
          
          const res = await axios.get(`${baseUrl}/auth/me`, {
            headers: { Authorization: `Bearer ${get().token}` },
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          set({ user: res.data, loading: false });
        } catch (error) {
          if (error.name === 'AbortError' || error.name === 'CanceledError') {
            console.warn('[AuthStore] fetchUser timeout (8s)');
          } else {
            console.error('Token kadaluarsa atau tidak valid:', error);
          }
          get().logout();
        }
      },

      login: async (token, userData) => {
        await persistedAuthStorage.setItem('access_token', token);
        set({ token });
        if (userData) {
          set({ user: userData, loading: false });
        } else {
          await get().fetchUser();
        }
      },

      logout: () => {
        persistedAuthStorage.removeItem('access_token');
        clearPersistedAuth();
        set({ user: null, token: null, loading: false });
      },

      updateUser: (userData) => set({ user: userData }),
      setLoading: (loading) => set({ loading }),

      // Helpers
      role: () => roleOf(get().user),
      isUser: () => roleOf(get().user) === ROLE.USER,
      isAdminKecamatan: () => roleOf(get().user) === ROLE.ADMIN_KECAMATAN,
      isAdminKabupaten: () => roleOf(get().user) === ROLE.ADMIN_KABUPATEN,
      isAdmin: () => {
        const role = roleOf(get().user);
        return role === ROLE.ADMIN_KECAMATAN || role === ROLE.ADMIN_KABUPATEN;
      },
      homePath: () => homePathForRole(roleOf(get().user)),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => persistedAuthStorage),
      partialize: (state) => ({ token: state.token, user: state.user }),
      onRehydrateStorage: () => (state, error) => {
        console.log('[AuthStore] Rehydration complete, error:', error);
        if (error) {
          console.error('Gagal memuat sesi tersimpan:', error);
          useAuthStore.setState({ loading: false });
          return;
        }
        if (state && state.token) {
          console.log('[AuthStore] Token found, fetching user...');
          let completed = false;
          // Shorter timeout - 10s instead of 15s
          const timeout = setTimeout(() => {
            if (!completed) {
              console.warn('[AuthStore] fetchUser timeout (10s), forcing loading=false');
              useAuthStore.setState({ loading: false });
            }
          }, 10000);
          
          state.fetchUser().finally(() => {
            completed = true;
            clearTimeout(timeout);
            console.log('[AuthStore] fetchUser completed, loading=false');
            useAuthStore.setState({ loading: false });
          });
        } else {
          console.log('[AuthStore] No token, loading=false');
          useAuthStore.setState({ loading: false });
        }
      },
    }
  )
);

export { roleOf, homePathForRole };