import React from 'react'
import PropTypes from 'prop-types'

import Map from './Map.jsx'
import PaneNav from './PaneNav.jsx'

const Pane = ({ pane, mapRef }) => {
  return (
    <section className="position-relative flex-fill">
      <div className="pane h-100">
        <Map mapRef={mapRef} />
      </div>
      <PaneNav pane={pane} mapRef={mapRef} />
    </section>
  )
}

Pane.propTypes = {
  pane: PropTypes.object,
  mapRef: PropTypes.func
}

export default Pane
