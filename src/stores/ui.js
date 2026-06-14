import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export const useUI = create(
  immer((set) => ({
    showMapModal: false,
    openMapModal: () => set({ showMapModal: true }),
    closeMapModal: () => set({ showMapModal: false }),
  })),
)
