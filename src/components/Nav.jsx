import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import useGeolocation from '../hooks/useGeolocation'
import { useConfig } from '../stores/config'
import { useUI } from '../stores/ui'

import Search from './Search.jsx'

const Nav = ({ onSearch, onZoom, onGeolocate, onCopyLink, onReset }) => {
  const showGrid = useUI((s) => s.showGrid)
  const toggleGrid = useUI((s) => s.toggleGrid)
  const showCrosshair = useUI((s) => s.showCrosshair)
  const toggleCrosshair = useUI((s) => s.toggleCrosshair)
  const showLabels = useUI((s) => s.showLabels)
  const toggleLabels = useUI((s) => s.toggleLabels)
  const openInfoModal = useUI((s) => s.openInfoModal)
  const info = useConfig((s) => s.info)
  const strings = useConfig((s) => s.strings)
  const canGeolocate = useGeolocation()

  // show a check instead of the wrench for a moment after the link was copied
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(timeout)
    }
  }, [copied])

  const handleCopyLink = () => {
    onCopyLink()
      .then(() => setCopied(true))
      .catch((error) => console.warn('the link could not be copied', error))
  }

  return (
    <nav className="position-absolute top-0 w-100 d-flex flex-column flex-md-row">
      <Search onSelect={onSearch} />

      <div className="d-flex flex-wrap justify-content-end align-items-start gap-2 mt-2 mt-md-3 ms-3 ms-md-0 me-3">
        <div className="btn-group shadow rounded-3">
          <button className="btn btn-control" onClick={() => onZoom(1)} title={strings.zoomIn}>
            <i className="bi bi-plus-lg"></i>
          </button>
          <button className="btn btn-control" onClick={() => onZoom(-1)} title={strings.zoomOut}>
            <i className="bi bi-dash-lg"></i>
          </button>
        </div>
        {
          canGeolocate && (
            <div className="btn-group shadow rounded-3">
              <button className="btn btn-control" onClick={onGeolocate} title={strings.geolocate}>
                <i className="bi bi-cursor"></i>
              </button>
            </div>
          )
        }
        <div className="btn-group shadow rounded-3 ms-auto ms-md-0">
          <button
            className={classNames('btn btn-control', { active: showGrid })}
            onClick={toggleGrid} title={strings.grid}
          >
            <i className="bi bi-grid-3x3"></i>
          </button>
          <button
            className={classNames('btn btn-control', { active: showCrosshair })}
            onClick={toggleCrosshair} title={strings.crosshair}
          >
            <i className="bi bi-crosshair"></i>
          </button>
          <button
            className={classNames('btn btn-control', { active: showLabels })}
            onClick={toggleLabels} title={strings.labels}
          >
            <i className="bi bi-tag"></i>
          </button>
        </div>
        <div className="btn-group shadow rounded-3">
          <button
            className="btn btn-control dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"
            data-bs-display="static"
            title={strings.options}
          >
            <i className={copied ? 'bi bi-check-lg' : 'bi bi-wrench'}></i>
          </button>
          <ul className="dropdown-menu dropdown-menu-end shadow">
            <li>
              <button className="dropdown-item" onClick={handleCopyLink}>
                <i className="bi bi-link-45deg me-2"></i>{strings.copyLink}
              </button>
            </li>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <button className="dropdown-item" onClick={onReset}>
                <i className="bi bi-arrow-counterclockwise me-2"></i>{strings.reset}
              </button>
            </li>
          </ul>
        </div>
        {
          info && (
            <div className="btn-group shadow rounded-3">
              <button className="btn btn-control" onClick={openInfoModal} title={strings.info}>
                <i className="bi bi-info-circle"></i>
              </button>
            </div>
          )
        }
      </div>
    </nav>
  )
}

Nav.propTypes = {
  onSearch: PropTypes.func,
  onZoom: PropTypes.func,
  onGeolocate: PropTypes.func,
  onCopyLink: PropTypes.func,
  onReset: PropTypes.func
}

export default Nav
