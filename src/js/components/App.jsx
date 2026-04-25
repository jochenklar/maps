import React, { useRef, useState } from 'react'
import { isUndefined, omit, uniqueId } from 'lodash'

import Nav from './Nav.jsx'
import PaneContainer from './PaneContainer.jsx'

const createPane = (id, parentId = null, level = 0) => ({
  id,
  parentId,
  level,
  direction: null,
  children: [],
})

const App = () => {
  const [panes, setPanes] = useState({ root: createPane('root') })
  const mapRefs = useRef({})
  const isSyncing = useRef(false)

  const setMapRef = (id) => (map) => {
    if (map) {
      mapRefs.current[id] = map

      const moveHandler = () => {
        if (isSyncing.current) return
        handleSync(id)
      }
      const dblclickHandler = (e) => handleZoom(1, e.latlng)
      map.on('move', moveHandler)
      map.on('dblclick', dblclickHandler)

      // stash the handler so we can remove it on cleanup
      map.__moveHandler = moveHandler
      map.__dblclickHandler = dblclickHandler
    } else {
      // remove stashed handlers
      const old = mapRefs.current[id]
      if (old?.__moveHandler) old.off('move', old.__moveHandler)
      if (old?.__dblclickHandler) old.off('dblclick', old.__dblclickHandler)
      delete mapRefs.current[id]
    }
  }

  const handleSplit = (pane, direction) => {
    setPanes((prev) => {
      const id1 = uniqueId('node')
      const id2 = uniqueId('node')

      return  {
        ...prev,
        [id1]: createPane(id1, pane.id, pane.level + 1),
        [id2]: createPane(id2, pane.id, pane.level + 1),
        [pane.id]: {
          ...prev[pane.id],
          direction,
          children: [id1, id2],
        },
      }
    })
  }

  const handleRemove = (pane) => {
    setPanes((prev) => {
      const parentId = prev[pane.id].parentId
      const parent = prev[parentId]

      return {
        ...omit(prev, parent.children),
        [parentId]: {
          ...prev[parentId],
          direction: null,
          children: [],
        },
      }
    })
  }

  const handleZoom = (delta, center) => {
    isSyncing.current = true
    Object.values(mapRefs.current).forEach((map) => {
      if (isUndefined(center)) {
        map.setZoom(map.getZoom() + delta)
      } else {
        map.setZoomAround(center, map.getZoom() + delta)
      }
    })
    isSyncing.current = false
  }

  const handleSync = (sourceId) => {
    const source = mapRefs.current[sourceId]
    if (!source) return

    const center = source.getCenter()
    const zoom = source.getZoom()

    isSyncing.current = true
    Object.entries(mapRefs.current).forEach(([id, map]) => {
      if (id === sourceId) return
      map.setView(center, zoom, { animate: false })
    })
    isSyncing.current = false
  }

  return (
    <main>
      <Nav onZoom={handleZoom} />
      <div className="d-flex vh-100">
        <PaneContainer
          id="root"
          panes={panes}
          setMapRef={setMapRef}
          onSplit={handleSplit}
          onRemove={handleRemove}
        />
      </div>
    </main>
  )
}

export default App
