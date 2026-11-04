import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';

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

export { roleOf, homePathForRole };