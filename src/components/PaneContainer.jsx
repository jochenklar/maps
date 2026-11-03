import React from 'react'
import PropTypes from 'prop-types'

import Pane from './Pane.jsx'

const PaneContainer = ({ id, panes, view }) => {
  const pane = panes[id]

  if (pane.children.length === 0) {
    return (
      <Pane pane={pane} view={view} />
    )
  }

  const directionClass = pane.direction === 'horizontal' ? (
    'pane-container d-flex flex-column flex-fill'
  ) : (
    'pane-container d-flex flex-row flex-fill'
  )

  return (
    <div className={directionClass}>
      {
        pane.children.map((childId) => (
          <PaneContainer
            key={childId}
            id={childId}
            panes={panes}
            view={view}
          />
        ))
      }
    </div>
  )
}

PaneContainer.propTypes = {
  id: PropTypes.string,
  panes: PropTypes.object,
  view: PropTypes.object
}

export default PaneContainer
