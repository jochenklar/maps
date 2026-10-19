import React from 'react'
import PropTypes from 'prop-types'

import { useConfig } from '../stores/config'
import { usePanes } from '../stores/panes'
import { useUI } from '../stores/ui'

const PaneNav = ({ pane }) => {
  const splitPane = usePanes((state) => state.splitPane)
  const removePane = usePanes((state) => state.removePane)
  const openMapModal = useUI((s) => s.openMapModal)
  const maxLevel = useConfig((s) => s.panes.maxLevel)

  return (
    <nav className="position-absolute bottom-0 d-flex">
      <div className="d-flex gap-2 ms-3 mb-3">
        <div className="btn-group shadow rounded-3">
          <button className="btn btn-control" onClick={() => openMapModal(pane)} title="Choose map">
            <i className="bi bi-map"></i>
          </button>
        </div>

        {
          (pane.level < maxLevel || pane.level > 0) && (
            <div className="btn-group shadow rounded-3">
              {
                pane.level < maxLevel && (
                  <>
                    <button
                      className="btn btn-control" onClick={() => splitPane(pane, 'vertical')}
                      title="Split side by side"
                    >
                      <i className="bi bi-arrows-expand-vertical"></i>
                    </button>
                    <button
                      className="btn btn-control" onClick={() => splitPane(pane, 'horizontal')}
                      title="Split on top of each other"
                    >
                      <i className="bi bi-arrows-expand"></i>
                    </button>
                  </>
                )
              }
              {
                pane.level > 0 && (
                  <button className="btn btn-control" onClick={() => removePane(pane)} title="Close pane">
                    <i className="bi bi-x-lg"></i>
                  </button>
                )
              }
            </div>
          )
        }
      </div>
    </nav>
  )
}

PaneNav.propTypes = {
  pane: PropTypes.object
}

export default PaneNav
