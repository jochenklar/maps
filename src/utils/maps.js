import { latLng } from 'leaflet'
import { isUndefined } from 'lodash'

import { useUI } from '../stores/ui'

// all functions take mapsRef, a ref to { maps, isSyncing } (see App.jsx), where maps are the leaflet
// maps of all panes by pane id, and isSyncing is true while the maps are moved from here,
// so that their move events are ignored

const getFirstMap = (mapsRef) => Object.values(mapsRef.current.maps)[0]

const forEachMap = (mapsRef, callback) => {
  mapsRef.current.isSyncing = true
  Object.values(mapsRef.current.maps).forEach(callback)
  mapsRef.current.isSyncing = false
}

const storeView = (map) => {
  const { lat, lng } = map.getCenter()
  useUI.getState().setView({ center: [lat, lng], zoom: map.getZoom() })
}

// move all maps without syncing and store the view
const setMapsView = (mapsRef, center, zoom) => {
  forEachMap(mapsRef, (map) => map.setView(center, zoom, { animate: false }))
  useUI.getState().setView({ center, zoom })
}

// zoom all maps by delta, around center if given
const zoomMaps = (mapsRef, delta, center) => {
  const source = getFirstMap(mapsRef)
  if (!source) return

  forEachMap(mapsRef, (map) => {
    if (isUndefined(center)) {
      map.setZoom(map.getZoom() + delta)
    } else {
      map.setZoomAround(center, map.getZoom() + delta)
    }
  })

  storeView(source)
}

// move all maps to the center of the bounds and zoom so that the bounds fit into the map,
// but not further than maxZoom
const fitMapsToBounds = (mapsRef, bounds, maxZoom = Infinity) => {
  const source = getFirstMap(mapsRef)
  if (!source) return

  const { lat, lng } = bounds.getCenter()
  const zoom = Math.min(source.getBoundsZoom(bounds), maxZoom)

  setMapsView(mapsRef, [lat, lng], zoom)
}

// move all maps to the current position, zoom so that the accuracy circle (radius in meters)
// fits into the map, but not further than maxZoom
const geolocateMaps = (mapsRef, maxZoom) => {
  navigator.geolocation.getCurrentPosition((position) => {
    const center = latLng(position.coords.latitude, position.coords.longitude)
    fitMapsToBounds(mapsRef, center.toBounds(position.coords.accuracy * 2), maxZoom)
  },
  (error) => console.warn(`geolocation failed: ${error.message}`))
}

// returns the ref callback for the MapContainer of the pane with this id
const setMapRef = (mapsRef, id) => (map) => {
  const { maps } = mapsRef.current

  if (map) {
    maps[id] = map

    const moveHandler = () => {
      if (mapsRef.current.isSyncing) return

      const center = map.getCenter()
      const zoom = map.getZoom()
      forEachMap(mapsRef, (other) => {
        if (other !== map) other.setView(center, zoom, { animate: false })
      })

      storeView(map)
    }
    const dblclickHandler = (e) => zoomMaps(mapsRef, 1, e.latlng)
    map.on('move', moveHandler)
    map.on('dblclick', dblclickHandler)

    // stash the handler so we can remove it on cleanup
    map.__moveHandler = moveHandler
    map.__dblclickHandler = dblclickHandler
  } else {
    // remove stashed handlers
    const old = maps[id]
    if (old?.__moveHandler) old.off('move', old.__moveHandler)
    if (old?.__dblclickHandler) old.off('dblclick', old.__dblclickHandler)
    delete maps[id]
  }
}

export { fitMapsToBounds, geolocateMaps, setMapRef, setMapsView, zoomMaps }
