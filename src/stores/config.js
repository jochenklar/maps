import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { isValidMapId } from '../utils/hash'

// find a map from the config by its id, fall back to the first map if the id is unknown
export const findMap = (groups, id) => {
  const maps = groups?.flatMap((group) => group.maps) ?? []
  return maps.find((map) => map.id === id) ?? maps[0]
}

export const useConfig = create(
  persist(
    (set) => ({
      view: null,
      init: (data) => {
        data.groups.flatMap((group) => group.maps).forEach((map) => {
          if (!isValidMapId(map.id ?? '')) {
            console.warn(`map "${map.name}" needs an id with only letters, numbers, "_", "-" and "."`)
          }
        })
        set((state) => ({ ...data, view: state.view ?? data.view }))
      },
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
