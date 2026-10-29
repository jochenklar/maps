import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

// map is the id of the map from the config, null shows the first map
const createPane = (id, parentId = null, level = 0, map = null) => {
  return {
    id,
    parentId,
    level,
    map,
    direction: null,
    children: [],
  }
}

// the pane which is changed by the filmstrip: the active pane, or the first pane inside of it if it was split,
// or the first pane if there is no active pane or it was closed
export const getActivePane = (panes, id) => {
  let pane = panes[id] ?? panes.root
  while (pane.children.length > 0) pane = panes[pane.children[0]]
  return pane
}

export const usePanes = create(
  persist(
    immer((set) => ({
      panes: {
        root: createPane('root')
      },

      // replace all panes with a tree like { direction: 'vertical', children: [{ map: 'osm' }, { map: 'dop20' }] }
      setPanes: (tree) =>
        set((state) => {
          const panes = {}
          const addPane = (node, id, parentId, level) => {
            panes[id] = createPane(id, parentId, level, node.map ?? null)
            if (node.children) {
              panes[id].direction = node.direction
              panes[id].children = node.children.map((child) => {
                const childId = crypto.randomUUID()
                addPane(child, childId, id, level + 1)
                return childId
              })
            }
          }
          addPane(tree, 'root', null, 0)
          state.panes = panes
        }),

      splitPane: (pane, direction) =>
        set((state) => {
          const id1 = crypto.randomUUID()
          const id2 = crypto.randomUUID()

          state.panes[id1] = createPane(id1, pane.id, pane.level + 1, pane.map)
          state.panes[id2] = createPane(id2, pane.id, pane.level + 1, pane.map)
          state.panes[pane.id].direction = direction
          state.panes[pane.id].children = [id1, id2]
        }),

      // remove the pane and let its sibling take the place of the parent, keeping the sibling's own panes
      removePane: (pane) =>
        set((state) => {
          const parentId = state.panes[pane.id].parentId
          const parent = state.panes[parentId]
          const sibling = state.panes[parent.children.find((childId) => childId !== pane.id)]

          const deletePane = (id) => {
            state.panes[id].children.forEach(deletePane)
            delete state.panes[id]
          }
          deletePane(pane.id)

          parent.map = sibling.map
          parent.direction = sibling.direction
          parent.children = [...sibling.children]
          delete state.panes[sibling.id]

          // the panes of the sibling move up by one level
          const moveUp = (id) => {
            state.panes[id].level--
            state.panes[id].children.forEach(moveUp)
          }
          parent.children.forEach((childId) => {
            state.panes[childId].parentId = parentId
            moveUp(childId)
          })
        }),

      changeMap: (pane, mapId) =>
        set((state) => {
          state.panes[pane.id].map = mapId
        }),
    })),
    {
      name: 'panes', // localStorage key
      version: 1, // bump to drop persisted state which is no longer compatible
      migrate: () => ({}), // drop the persisted state if the version changed
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          // drop the persisted state if it could not be parsed
          console.warn('persisted state "panes" could not be loaded and was reset', error)
          localStorage.removeItem('panes')
        }
      },
    }
  )
)
