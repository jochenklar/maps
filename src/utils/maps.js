import { circular } from 'ol/geom/Polygon'
import { unByKey } from 'ol/Observable'
import { fromLonLat, toLonLat } from 'ol/proj'

import { useUI } from '../stores/ui'

// all functions take the openlayers view, which is shared by the maps of all panes (see App.jsx), so that they
// move and zoom together, its coordinates are in web mercator, while centers outside of it are [lat, lng]

// the duration of the zoom animation in milliseconds
const duration = 250

const storeView = (view) => {
  if (!view.isDef()) return

  const [lng, lat] = toLonLat(view.getCenter())
  useUI.getState().setView({ center: [lat, lng], zoom: view.getZoom() })
}

// store the view whenever the maps move, returns a function to stop
const storeViewOnChange = (view) => {
  const keys = view.on(['change:center', 'change:resolution'], () => storeView(view))
  return () => unByKey(keys)
}

// the zoom limits of the view, the narrowest range of minZoom and maxZoom from the config and of all maps
// which set them, so that every map has tiles at every zoom level
const setZoomLimits = (view, { minZoom, maxZoom }, groups) => {
  const maps = groups.flatMap((group) => group.maps)
  view.setMinZoom(Math.max(minZoom, ...maps.map((map) => map.minZoom ?? minZoom)))
  view.setMaxZoom(Math.min(maxZoom, ...maps.map((map) => map.maxZoom ?? maxZoom)))
}

// move all maps without animation
const setMapsView = (view, center, zoom) => {
  const [lat, lng] = center
  view.cancelAnimations()
  view.setCenter(fromLonLat([lng, lat]))
  view.setZoom(zoom)
}

// zoom all maps by delta, around anchor (in web mercator) if given
const zoomMaps = (view, delta, anchor) => {
  if (!view.isDef()) return

  const zoom = view.getConstrainedZoom(view.getZoom() + delta)
  view.cancelAnimations()
  view.animate({ zoom, anchor, duration })
}

// move all maps to the center of the extent (in web mercator) and zoom so that the extent fits into the maps,
// but not further than maxZoom
const fitMapsToExtent = (view, extent, maxZoom) => {
  view.cancelAnimations()
  view.fit(extent, { maxZoom })
}

// move all maps to the current position, zoom so that the accuracy circle (radius in meters)
// fits into the map, but not further than maxZoom
const geolocateMaps = (view, maxZoom) => {
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude, accuracy } = position.coords
    const circle = circular([longitude, latitude], accuracy).transform('EPSG:4326', 'EPSG:3857')
    fitMapsToExtent(view, circle.getExtent(), maxZoom)
  },
  (error) => console.warn(`geolocation failed: ${error.message}`))
}

export { fitMapsToExtent, geolocateMaps, setMapsView, setZoomLimits, storeViewOnChange, zoomMaps }
