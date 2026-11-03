import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { defaults as defaultControls } from 'ol/control/defaults'
import { defaults as defaultInteractions } from 'ol/interaction/defaults'
import TileLayer from 'ol/layer/Tile'
import OlMap from 'ol/Map'
import { unByKey } from 'ol/Observable'

import { findMap, useConfig } from '../stores/config'
import { useUI } from '../stores/ui'
import { createGrid } from '../utils/grid'
import { zoomMaps } from '../utils/maps'
import { getSource } from '../utils/sources'

import 'ol/ol.css'

const Map = ({ pane, view }) => {
  const groups = useConfig((s) => s.groups)
  const transition = useConfig((s) => s.tiles.transition)
  const showGrid = useUI((s) => s.showGrid)

  const map = findMap(groups, pane.map)

  // the layers are created once per pane, a newly chosen map only replaces the source of the tile layer
  const [layers] = useState(() => ({ tiles: new TileLayer(), grid: createGrid() }))
  const targetRef = useRef(null)

  // all maps share the view, so that they move and zoom together, see utils/maps.js
  useEffect(() => {
    const olMap = new OlMap({
      target: targetRef.current,
      view,
      layers: [layers.tiles, layers.grid],
      controls: defaultControls({ zoom: false, rotate: false, attributionOptions: { collapsible: false } }),
      interactions: defaultInteractions({ doubleClickZoom: false, altShiftDragRotate: false, pinchRotate: false }),
    })

    // double clicks zoom like the zoom buttons, around the clicked point
    const key = olMap.on('dblclick', (event) => zoomMaps(view, 1, event.coordinate))

    return () => {
      unByKey(key)
      olMap.dispose()
    }
  }, [view, layers])

  useEffect(() => {
    layers.tiles.setSource(map ? getSource(map, transition) : null)
  }, [layers, map, transition])

  useEffect(() => {
    layers.grid.setVisible(showGrid)
  }, [layers, showGrid])

  return <div ref={targetRef} className="h-100 w-100" />
}

Map.propTypes = {
  pane: PropTypes.object,
  view: PropTypes.object
}

export default Map
