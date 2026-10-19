import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { latLng } from 'leaflet'
import { isUndefined } from 'lodash'

import { useConfig } from '../stores/config'
import { usePanes } from '../stores/panes'

import MapModal  from './MapModal.jsx'
import Nav from './Nav.jsx'
import PaneContainer from './PaneContainer.jsx'

const App = ({ config }) => {
  const init = useConfig((s) => s.init)
  const groups = useConfig((s) => s.groups)
  const geolocate = useConfig((s) => s.geolocate)
  const setView = useConfig((s) => s.setView)

  useEffect(() => init(config), [init, config])

  const panes = usePanes((state) => state.panes)
  const mapRefs = useRef({})
  const isSyncing = useRef(false)

  const setMapRef = (id) => (map) => {
    if (map) {
      mapRefs.current[id] = map

      const moveHandler = () => {
        if (isSyncing.current) return
        handleSync(id)
        setView({ center: map.getCenter(), zoom: map.getZoom() })
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

  const handleZoom = (delta, center) => {
    const source = Object.values(mapRefs.current)[0]
    if (!source) return

    isSyncing.current = true
    Object.values(mapRefs.current).forEach((map) => {
      if (isUndefined(center)) {
        map.setZoom(map.getZoom() + delta)
      } else {
        map.setZoomAround(center, map.getZoom() + delta)
      }
    })
    isSyncing.current = false

    setView({ center: source.getCenter(), zoom: source.getZoom() })
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

  const handleGeolocate = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const source = Object.values(mapRefs.current)[0]
      if (!source) return

      // zoom so that the accuracy circle (radius in meters) fits into the map,
      // but not further than geolocate.maxZoom from the config
      const center = [position.coords.latitude, position.coords.longitude]
      const bounds = latLng(center).toBounds(position.coords.accuracy * 2)
      const zoom = Math.min(source.getBoundsZoom(bounds), geolocate?.maxZoom ?? Infinity)

      isSyncing.current = true
      Object.values(mapRefs.current).forEach((map) => {
        map.setView(center, zoom, { animate: false })
      })
      isSyncing.current = false

      setView({ center, zoom })
    },
    () => console.warn('geolocation failed'))
  }

  return groups && (
    <main>
      <Nav onZoom={handleZoom} onGeolocate={handleGeolocate} />
      <div className="d-flex vh-100">
        <PaneContainer
          id="root"
          panes={panes}
          setMapRef={setMapRef}
        />
      </div>
      <MapModal />
    </main>
  )
}

App.propTypes = {
  config: PropTypes.object
}

export default App
