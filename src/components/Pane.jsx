import React from 'react'
import PropTypes from 'prop-types'

import { useUI } from '../stores/ui'

import Crosshair from './Crosshair.jsx'
import Map from './Map.jsx'
import PaneNav from './PaneNav.jsx'

const Pane = ({ pane, mapRef }) => {
  const showCrosshair = useUI((s) => s.showCrosshair)
  const setActivePane = useUI((s) => s.setActivePane)

  return (
    <section className="position-relative flex-fill" onPointerDownCapture={() => setActivePane(pane.id)}>
      <div className="pane h-100">
        <Map mapRef={mapRef} pane={pane} />
      </div>
      {showCrosshair && <Crosshair />}
      <PaneNav pane={pane} />
    </section>
  )
}

Pane.propTypes = {
  pane: PropTypes.object,
  mapRef: PropTypes.func
}

export default Pane
