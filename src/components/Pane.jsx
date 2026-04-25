import React from 'react'
import PropTypes from 'prop-types'

import Map from './Map.jsx'
import PaneNav from './PaneNav.jsx'

const Pane = ({ pane, setMapRef, onSplit, onRemove }) => {
  return (
    <section className="position-relative flex-fill">
      <div className="pane h-100">
        <Map
          map={pane.map}
          mapRef={setMapRef(pane.id)}
          center={[52, 13]}
          zoom={10}
        />
      </div>
      <PaneNav
        pane={pane}
        onSplit={onSplit}
        onRemove={onRemove}
      />
    </section>
  )
}

Pane.propTypes = {
  pane: PropTypes.object,
  setMapRef: PropTypes.func,
  onSplit: PropTypes.func,
  onRemove: PropTypes.func
}

export default Pane
