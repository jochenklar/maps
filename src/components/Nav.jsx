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

      <div className="btn-group mt-3 me-3">
        <button className="btn btn-outline-secondary" onClick={() => onZoom(1)} >
          <i className="bi bi-plus-lg"></i>
        </button>
        <button className="btn btn-outline-secondary" onClick={() => onZoom(-1)} >
          <i className="bi bi-dash-lg"></i>
        </button>
        <button className="btn btn-outline-secondary" onClick={onGeolocate}>
          <i className="bi bi-geo-alt"></i>
        </button>
        <button className={classNames('btn btn-outline-secondary', { active: showGrid })} onClick={toggleGrid}>
          <i className="bi bi-grid-3x3"></i>
        </button>
        <button
          className={classNames('btn btn-outline-secondary', { active: showCrosshair })}
          onClick={toggleCrosshair}
        >
          <i className="bi bi-crosshair"></i>
        </button>
        <button className="btn btn-outline-secondary" onClick={onReset}>
          <i className="bi bi-arrow-counterclockwise"></i>
        </button>
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
