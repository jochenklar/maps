import React from 'react'
import PropTypes from 'prop-types'
import { MapContainer, TileLayer } from 'react-leaflet'

import { useConfig } from '../stores/config'

import 'leaflet/dist/leaflet.css'

const Map = ({ mapRef }) => {
  const config = useConfig()

  return config.groups && config.view && (
    <MapContainer
      ref={mapRef}
      center={config.view.center}
      zoom={config.view.zoom}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
      doubleClickZoom={false}
    >
      <TileLayer
        attribution={config.groups[0].maps[0].options?.attribution}
        url={config.groups[0].maps[0].url}
      />
    </MapContainer>
  )
}

Map.propTypes = {
  mapRef: PropTypes.object
}

export default Map
