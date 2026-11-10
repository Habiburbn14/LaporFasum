import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

export const isNativePlatform = () => Capacitor.isNativePlatform();

/**
 * Platform-aware storage used by the Zustand auth persist middleware.
 * - Native (Android/iOS): Capacitor Preferences (persists across app restarts)
 * - Web: sessionStorage
 *
 * Returning promises is supported by zustand's createJSONStorage.
 */
export const persistedAuthStorage = {
  getItem: async (name) => {
    if (isNativePlatform()) {
      const { value } = await Preferences.get({ key: name });
      return value ?? null;
    }
    return sessionStorage.getItem(name);
  },
  setItem: async (name, value) => {
    if (isNativePlatform()) {
      await Preferences.set({ key: name, value });
    } else {
      sessionStorage.setItem(name, value);
    }
  },
  removeItem: async (name) => {
    if (isNativePlatform()) {
      await Preferences.remove({ key: name });
    } else {
      sessionStorage.removeItem(name);
      // legacy key
      sessionStorage.removeItem('access_token');
    }
  },
};

export const clearPersistedAuth = () => {
  if (isNativePlatform()) {
    Preferences.remove({ key: 'auth-storage' }).catch(() => {});
  } else {
    sessionStorage.removeItem('auth-storage');
    sessionStorage.removeItem('access_token');
  }
};