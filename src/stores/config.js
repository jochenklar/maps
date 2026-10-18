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
      partialize: (state) => ({ view: state.view }),
    },
  ),
)
