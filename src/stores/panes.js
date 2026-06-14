import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { uniqueId } from 'lodash'

const createPane = (id, parentId = null, level = 0, map = [0, 0]) => {
  return {
    id,
    parentId,
    level,
    map,
    direction: null,
    children: [],
  }
}

export const usePanes = create(
  persist(
    immer((set) => ({
      panes: {
        root: createPane('root')
      },
      splitPane: (pane, direction) =>
        set((state) => {
          const id1 = uniqueId('node')
          const id2 = uniqueId('node')

          state.panes[id1] = createPane(id1, pane.id, pane.level + 1, pane.map)
          state.panes[id2] = createPane(id2, pane.id, pane.level + 1, pane.map)
          state.panes[pane.id].direction = direction
          state.panes[pane.id].children = [id1, id2]
        }),

      removePane: (pane) =>
        set((state) => {
          const parentId = state.panes[pane.id].parentId
          const parent = state.panes[parentId]

          for (const childId of parent.children) {
            if (childId != pane.id) {
              parent.map = state.panes[childId].map
            }
            delete state.panes[childId]
          }

          parent.direction = null
          parent.children = []
        }),

      changeMap: (pane, groupIndex, mapIndex) =>
        set((state) => {
          state.panes[pane.id].map = [groupIndex, mapIndex]
        }),
    })),
    {
      name: 'panes' // localStorage key
    }
  )
)
