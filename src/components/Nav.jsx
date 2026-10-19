import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { useUI } from '../stores/ui'

import Search from './Search.jsx'

const Nav = ({ onSearch, onZoom, onGeolocate, onReset }) => {
  const showGrid = useUI((s) => s.showGrid)
  const toggleGrid = useUI((s) => s.toggleGrid)
  const showCrosshair = useUI((s) => s.showCrosshair)
  const toggleCrosshair = useUI((s) => s.toggleCrosshair)

  return (
    <nav className="position-absolute top-0 w-100 d-flex">
      <Search onSelect={onSearch} />

      <div className="d-flex align-items-start gap-2 mt-3 me-3">
        <div className="btn-group shadow rounded-3">
          <button className="btn btn-control" onClick={() => onZoom(1)} title="Zoom in">
            <i className="bi bi-plus-lg"></i>
          </button>
          <button className="btn btn-control" onClick={() => onZoom(-1)} title="Zoom out">
            <i className="bi bi-dash-lg"></i>
          </button>
        </div>
        <div className="btn-group shadow rounded-3">
          <button className="btn btn-control" onClick={onGeolocate} title="My location">
            <i className="bi bi-geo-alt"></i>
          </button>
        </div>
        <div className="btn-group shadow rounded-3">
          <button className={classNames('btn btn-control', { active: showGrid })} onClick={toggleGrid} title="Grid">
            <i className="bi bi-grid-3x3"></i>
          </button>
          <button
            className={classNames('btn btn-control', { active: showCrosshair })}
            onClick={toggleCrosshair} title="Center marker"
          >
            <i className="bi bi-crosshair"></i>
          </button>
        </div>
        <div className="btn-group shadow rounded-3">
          <button className="btn btn-control" onClick={onReset} title="Reset">
            <i className="bi bi-arrow-counterclockwise"></i>
          </button>
        </div>
      </div>
    </nav>
  )
}

Nav.propTypes = {
  onSearch: PropTypes.func,
  onZoom: PropTypes.func,
  onGeolocate: PropTypes.func,
  onReset: PropTypes.func
}

export default Nav
