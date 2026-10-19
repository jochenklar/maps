import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useConfig = create(
  persist(
    (set) => ({
      view: null,
      init: (data) => set((state) => ({ ...data, view: state.view ?? data.view })),
      setView: (view) => set((state) => ({ view: { ...state.view, ...view } })),
    }),
    {
      name: 'config', // localStorage key
      version: 1, // bump to drop persisted state which is no longer compatible
      migrate: () => ({}), // drop the persisted state if the version changed
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          // drop the persisted state if it could not be parsed
          console.warn('persisted state "config" could not be loaded and was reset', error)
          localStorage.removeItem('config')
        }
      },
      partialize: (state) => ({ view: state.view }),
    },
  ),
)
