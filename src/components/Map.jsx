import React from 'react'
import PropTypes from 'prop-types'
import { MapContainer, TileLayer } from 'react-leaflet'

import { useConfig } from '../stores/config'
import { useUI } from '../stores/ui'

import Grid from './Grid.jsx'

import 'leaflet/dist/leaflet.css'

const Map = ({ mapRef, pane }) => {
  const config = useConfig()
  const showGrid = useUI((s) => s.showGrid)

  const [groupIndex, mapIndex] = pane.map
  const map = config.groups?.[groupIndex].maps?.[mapIndex]

  return map && (
    <MapContainer
      ref={mapRef}
      center={config.view.center}
      zoom={config.view.zoom}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
      doubleClickZoom={false}
      minZoom={map.options.minZoom}
      maxZoom={map.options.maxZoom}
    >
      <TileLayer
        url={map.url}
        attribution={map.options.attribution}
        minZoom={map.options.minZoom}
        maxZoom={map.options.maxZoom}
      />
      {showGrid && <Grid />}
    </MapContainer>
  )
}

Map.propTypes = {
  mapRef: PropTypes.object,
  pane: PropTypes.object
}

export default Map
