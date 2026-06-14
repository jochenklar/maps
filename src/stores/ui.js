import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export const useUI = create(
  immer((set) => ({
    showMapModal: false,
    currentPane: null,
    openMapModal: (pane) => set({ showMapModal: true, currentPane: pane }),
    closeMapModal: (pane) => set({ showMapModal: false, currentPane: null }),
  })),
)
