import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { omit, uniqueId } from 'lodash'

const createPane = (id, parentId = null, level = 0) => {
  return {
    id,
    parentId,
    level,
    direction: null,
    children: [],
  }
}

export const usePanes = create(
  persist(
    (set) => ({
      panes: {
        root: createPane('root')
      },

      splitPane: (pane, direction) =>
        set((state) => {
          const id1 = uniqueId('node')
          const id2 = uniqueId('node')
          return {
            panes: {
              ...state.panes,
              [id1]: createPane(id1, pane.id, pane.level + 1),
              [id2]: createPane(id2, pane.id, pane.level + 1),
              [pane.id]: { ...state.panes[pane.id], direction, children: [id1, id2] },
            },
          }
        }),

      removePane: (pane) =>
        set((state) => {
          const parentId = state.panes[pane.id].parentId
          const parent = state.panes[parentId]
          return {
            panes: {
              ...omit(state.panes, parent.children),
              [parentId]: { ...state.panes[parentId], direction: null, children: [] },
            },
          }
        }),
    }),
    {
      name: 'panes' // localStorage key
    }
  )
)
