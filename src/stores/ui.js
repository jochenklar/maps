import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export const useUI = create(
  persist(
    immer((set) => ({
      showMapModal: false,
      showInfoModal: true,
      currentPane: null,
      showGrid: false,
      showCrosshair: false,
      view: null, // the current center and zoom of the maps, null shows the view from the config
      openMapModal: (pane) => set({ showMapModal: true, currentPane: pane }),
      closeMapModal: () => set({ showMapModal: false, currentPane: null }),
      openInfoModal: () => set({ showInfoModal: true }),
      closeInfoModal: () => set({ showInfoModal: false }),
      toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
      toggleCrosshair: () => set((state) => ({ showCrosshair: !state.showCrosshair })),
      setView: (view) => set((state) => ({ view: { ...state.view, ...view } })),
    })),
    {
      name: 'ui', // localStorage key
      version: 1, // bump to drop persisted state which is no longer compatible
      migrate: () => ({}), // drop the persisted state if the version changed
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          // drop the persisted state if it could not be parsed
          console.warn('persisted state "ui" could not be loaded and was reset', error)
          localStorage.removeItem('ui')
        }
      },
      partialize: (state) => ({
        showInfoModal: state.showInfoModal,
        showGrid: state.showGrid,
        showCrosshair: state.showCrosshair,
        view: state.view,
      }),
    },
  ),
)
