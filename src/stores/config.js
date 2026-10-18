import { create } from 'zustand'

export const useConfig = create((set) => ({
  init: (data) => set(data),
  setView: (view) => set((state) => ({ view: { ...state.view, ...view } })),
}))
