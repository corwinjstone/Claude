import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingsStore = create(
  persist(
    (set) => ({
      startingBalance: 10000,
      darkMode: true,
      finnhubKey: import.meta.env.VITE_FINNHUB_KEY || '',
      fmpKey: import.meta.env.VITE_FMP_KEY || '',
      fredKey: import.meta.env.VITE_FRED_KEY || '',
      hasSeenOnboarding: false,

      updateSettings: (updates) => set((s) => ({ ...s, ...updates })),
      markOnboardingSeen: () => set({ hasSeenOnboarding: true }),
    }),
    { name: 'settings' }
  )
);
