import { create } from 'zustand'

export const useConfig = create((set) => ({
  init: (data) => set(data)
}))
