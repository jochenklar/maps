import React from 'react'
import PropTypes from 'prop-types'

import Pane from './Pane.jsx'

const PaneContainer = ({ id, panes, setMapRef }) => {
  const pane = panes[id]

  if (pane.children.length === 0) {
    return (
      <Pane pane={pane} mapRef={setMapRef(pane.id)} />
    )
  }

  const directionClass = pane.direction === 'horizontal' ? (
    'd-flex flex-column flex-fill'
  ) : (
    'd-flex flex-row flex-fill'
  )

  return (
    <div className={directionClass}>
      {
        pane.children.map((childId) => (
          <PaneContainer
            key={childId}
            id={childId}
            panes={panes}
            setMapRef={setMapRef}
          />
        ))
      }
    </div>
  )
}

PaneContainer.propTypes = {
  id: PropTypes.number,
  panes: PropTypes.array,
  setMapRef: PropTypes.func
}

export default PaneContainer
