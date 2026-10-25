import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import { layerGroup, polyline } from 'leaflet'

// possible distances between two grid lines in degrees, from coarse to fine
const steps = [
  10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05, 0.02, 0.01, 0.005, 0.002, 0.001, 0.0005, 0.0002, 0.0001
]

// the minimal distance between two vertical grid lines in pixels
const minDistance = 100

// the lines are drawn in their own pane and are styled in style.scss
const options = {
  pane: 'grid',
  className: 'grid-line',
  interactive: false,
}

const Grid = () => {
  const map = useMap()

  useEffect(() => {
    if (!map.getPane('grid')) map.createPane('grid')
    const layer = layerGroup().addTo(map)

    const draw = () => {
      layer.clearLayers()

      // use the finest step which keeps the lines minDistance apart, this depends only on the zoom
      // and not on the size of the pane, so that all panes show the same grid
      const pixelsPerDegree = map.options.crs.scale(map.getZoom()) / 360
      const step = steps.findLast((s) => s * pixelsPerDegree >= minDistance) ?? steps[0]

      const bounds = map.getBounds()

      // draw a bit beyond the visible area, so that the lines don't end while panning
      const padded = bounds.pad(0.5)
      const south = Math.max(padded.getSouth(), -90)
      const north = Math.min(padded.getNorth(), 90)
      const west = padded.getWest()
      const east = padded.getEast()

      // use integer multiples of the step to avoid accumulating rounding errors
      for (let i = Math.ceil(west / step); i * step <= east; i++) {
        layer.addLayer(polyline([[south, i * step], [north, i * step]], options))
      }
      for (let i = Math.ceil(south / step); i * step <= north; i++) {
        layer.addLayer(polyline([[i * step, west], [i * step, east]], options))
      }
    }

    draw()
    map.on('moveend', draw)

    return () => {
      map.off('moveend', draw)
      layer.remove()
    }
  }, [map])

  return null
}

export default Grid
