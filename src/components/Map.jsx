import React from 'react'
import PropTypes from 'prop-types'
import { MapContainer, TileLayer } from 'react-leaflet'

import { useConfig } from '../stores/config'

import 'leaflet/dist/leaflet.css'

const Map = ({ mapRef, pane }) => {
  const config = useConfig()

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
    >
      <TileLayer url={map.url} attribution={map.attribution} />
    </MapContainer>
  )
}

Map.propTypes = {
  mapRef: PropTypes.object,
  pane: PropTypes.object
}

export default Map
