import React from 'react'
import PropTypes from 'prop-types'

import { findMap, useConfig } from '../stores/config'
import { useUI } from '../stores/ui'

// the legend image of the map of the pane in the lower right corner, if the map has one and it is shown
const Legend = ({ pane }) => {
  const showLegend = useUI((s) => s.showLegend)
  const groups = useConfig((s) => s.groups)
  const strings = useConfig((s) => s.strings)

  const map = findMap(groups, pane.map)

  if (!showLegend || !map?.legend) return null

  return (
    <div className="pane-legend d-none d-md-block position-absolute bottom-0 end-0 bg-white shadow rounded-3 p-2 me-3">
      <img className="d-block mw-100" src={map.legend} alt={strings.legend} />
    </div>
  )
}

Legend.propTypes = {
  pane: PropTypes.object
}

export default Legend
