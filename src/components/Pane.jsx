import React from 'react'
import PropTypes from 'prop-types'

import Map from './Map.jsx'
import PaneNav from './PaneNav.jsx'

const Pane = ({ pane, mapRef }) => {
  return (
    <section className="position-relative flex-fill">
      <div className="pane h-100">
        <Map mapRef={mapRef} pane={pane} />
      </div>
      <PaneNav pane={pane} />
    </section>
  )
}

Pane.propTypes = {
  pane: PropTypes.object,
  mapRef: PropTypes.func
}

export default Pane
