import React from 'react'
import PropTypes from 'prop-types'
import { MapContainer, TileLayer } from 'react-leaflet'

import { findMap, useConfig } from '../stores/config'
import { useUI } from '../stores/ui'

import Grid from './Grid.jsx'

import 'leaflet/dist/leaflet.css'

const Map = ({ mapRef, pane }) => {
  const config = useConfig()
  const showGrid = useUI((s) => s.showGrid)

  // the view is only used when the map is created, so it is read without subscribing,
  // otherwise all maps would re-render on every move
  const view = useUI.getState().view ?? config.view

  const map = findMap(config.groups, pane.map)

  return map && (
    <MapContainer
      ref={mapRef}
      center={view.center}
      zoom={view.zoom}
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
