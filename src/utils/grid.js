import Graticule from 'ol/layer/Graticule'
import Stroke from 'ol/style/Stroke'

// possible distances between two grid lines in degrees, from coarse to fine
const intervals = [
  10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05, 0.02, 0.01, 0.005, 0.002, 0.001, 0.0005, 0.0002, 0.0001
]

// the minimal distance between two grid lines in pixels
const targetSize = 100

// a layer with the coordinate grid, openlayers chooses the finest interval which keeps the lines targetSize apart,
// this depends only on the zoom and not on the size of the pane, so that all panes show the same grid
const createGrid = () => new Graticule({
  intervals,
  targetSize,
  strokeStyle: new Stroke({ color: 'white', width: 1 }),
  visible: false,
})

export { createGrid }
