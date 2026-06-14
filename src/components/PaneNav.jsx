import React from 'react'
import PropTypes from 'prop-types'

import { usePanes } from '../stores/panes'
import { useUI } from '../stores/ui'

const PaneNav = ({ pane }) => {
  const splitPane = usePanes((state) => state.splitPane)
  const removePane = usePanes((state) => state.removePane)
  const openMapModal = useUI((s) => s.openMapModal)

  return (
    <nav className="position-absolute bottom-0 d-flex">
      <div className="ms-3 mb-3">
        <button className="btn btn-outline-secondary" onClick={() => openMapModal(pane)}>
          <i className="bi bi-map"></i>
        </button>

        <div className="btn-group ms-2">
          {
            pane.level < 3 && (
              <>
                <button className="btn btn-outline-secondary" onClick={() => splitPane(pane, 'vertical')}>
                  <i className="bi bi-arrows-expand-vertical"></i>
                </button>
                <button className="btn btn-outline-secondary" onClick={() => splitPane(pane, 'horizontal')}>
                  <i className="bi bi-arrows-expand"></i>
                </button>
              </>
            )
          }
          {
            pane.level > 0 && (
              <button className="btn btn-outline-secondary" onClick={() => removePane(pane)}>
                <i className="bi bi-x-lg"></i>
              </button>
            )
          }
        </div>
      </div>
    </nav>
  )
}

PaneNav.propTypes = {
  pane: PropTypes.object
}

export default PaneNav
