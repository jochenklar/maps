import React from 'react'
import PropTypes from 'prop-types'

import { findMap, useConfig } from '../stores/config'
import { usePanes } from '../stores/panes'
import { useUI } from '../stores/ui'

const PaneNav = ({ pane }) => {
  const splitPane = usePanes((state) => state.splitPane)
  const removePane = usePanes((state) => state.removePane)
  const openMapModal = useUI((s) => s.openMapModal)
  const showLabels = useUI((s) => s.showLabels)
  const groups = useConfig((s) => s.groups)
  const maxLevel = useConfig((s) => s.panes.maxLevel)
  const strings = useConfig((s) => s.strings)

  return (
    <nav className="position-absolute bottom-0 start-0 d-flex flex-column align-items-start mw-100">
      {
        showLabels && (
          <div className="pane-label bg-white shadow rounded-3 small px-2 py-1 mx-3 mb-3 text-truncate">
            {findMap(groups, pane.map)?.name}
          </div>
        )
      }
      <div className="d-flex gap-2 ms-3 mb-3">
        <div className="btn-group shadow rounded-3">
          <button className="btn btn-control" onClick={() => openMapModal(pane)} title={strings.chooseMap}>
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
                      title={strings.splitVertical}
                    >
                      <i className="bi bi-arrows-expand-vertical"></i>
                    </button>
                    <button
                      className="btn btn-control" onClick={() => splitPane(pane, 'horizontal')}
                      title={strings.splitHorizontal}
                    >
                      <i className="bi bi-arrows-expand"></i>
                    </button>
                  </>
                )
              }
              {
                pane.level > 0 && (
                  <button className="btn btn-control" onClick={() => removePane(pane)} title={strings.closePane}>
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
