import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import useGeolocation from '../hooks/useGeolocation'
import { useConfig } from '../stores/config'
import { useUI } from '../stores/ui'

import Filmstrip from './Filmstrip.jsx'
import Search from './Search.jsx'

const Nav = ({ onSearch, onZoom, onGeolocate, onCopyLink, onOpenExternal, onReset }) => {
  const showGrid = useUI((s) => s.showGrid)
  const toggleGrid = useUI((s) => s.toggleGrid)
  const showCrosshair = useUI((s) => s.showCrosshair)
  const toggleCrosshair = useUI((s) => s.toggleCrosshair)
  const showLabels = useUI((s) => s.showLabels)
  const toggleLabels = useUI((s) => s.toggleLabels)
  const openInfoModal = useUI((s) => s.openInfoModal)
  const show = useConfig((s) => s.show)
  const info = useConfig((s) => s.info)
  const external = useConfig((s) => s.external)
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

  const showOverlays = show.grid || show.crosshair || show.labels

  const buttonsClass = classNames('d-flex flex-wrap justify-content-end align-items-start gap-2 me-3', {
    'mt-2 mt-md-0 ms-3 ms-md-0': show.search,
    'ms-auto': !show.search,
  })

  return (
    <nav className="position-absolute top-0 w-100 d-flex flex-column gap-2 pt-3">
      {show.filmstrip && <Filmstrip />}

      <div className="d-flex flex-column flex-md-row">
        {show.search && <Search onSelect={onSearch} />}

        <div className={buttonsClass}>
          {
            show.zoom && (
              <div className="btn-group shadow rounded-3">
                <button className="btn btn-control" onClick={() => onZoom(1)} title={strings.zoomIn}>
                  <i className="bi bi-plus-lg"></i>
                </button>
                <button className="btn btn-control" onClick={() => onZoom(-1)} title={strings.zoomOut}>
                  <i className="bi bi-dash-lg"></i>
                </button>
              </div>
            )
          }
          {
            show.geolocate && canGeolocate && (
              <div className="btn-group shadow rounded-3">
                <button className="btn btn-control" onClick={onGeolocate} title={strings.geolocate}>
                  <i className="bi bi-cursor"></i>
                </button>
              </div>
            )
          }
          {
            showOverlays && (
              <div className="btn-group shadow rounded-3 ms-auto ms-md-0">
                {
                  show.grid && (
                    <button
                      className={classNames('btn btn-control', { active: showGrid })}
                      onClick={toggleGrid} title={strings.grid}
                    >
                      <i className="bi bi-grid-3x3"></i>
                    </button>
                  )
                }
                {
                  show.crosshair && (
                    <button
                      className={classNames('btn btn-control', { active: showCrosshair })}
                      onClick={toggleCrosshair} title={strings.crosshair}
                    >
                      <i className="bi bi-crosshair"></i>
                    </button>
                  )
                }
                {
                  show.labels && (
                    <button
                      className={classNames('btn btn-control', { active: showLabels })}
                      onClick={toggleLabels} title={strings.labels}
                    >
                      <i className="bi bi-tag"></i>
                    </button>
                  )
                }
              </div>
            )
          }
          {
            show.options && (
              <div className={classNames('btn-group shadow rounded-3', { 'ms-auto ms-md-0': !showOverlays })}>
                <button
                  className="btn btn-control dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"
                  data-bs-display="static"
                  title={strings.options}
                >
                  <i className={copied ? 'bi bi-check-lg' : 'bi bi-wrench'}></i>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow">
                  {
                    info && (
                      <li>
                        <button className="dropdown-item" onClick={openInfoModal}>
                          <i className="bi bi-info-circle me-2"></i>{strings.info}
                        </button>
                      </li>
                    )
                  }
                  <li>
                    <button className="dropdown-item" onClick={handleCopyLink}>
                      <i className="bi bi-link-45deg me-2"></i>{strings.copyLink}
                    </button>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  {
                    external.length > 0 && (
                      <>
                        {
                          external.map(({ name, url }) => (
                            <li key={name}>
                              <button className="dropdown-item" onClick={() => onOpenExternal(url)}>
                                <i className="bi bi-box-arrow-up-right me-2"></i>
                                {strings.openExternal.replace('{name}', name)}
                              </button>
                            </li>
                          ))
                        }
                        <li><hr className="dropdown-divider" /></li>
                      </>
                    )
                  }
                  <li>
                    <button className="dropdown-item" onClick={onReset}>
                      <i className="bi bi-arrow-counterclockwise me-2"></i>{strings.reset}
                    </button>
                  </li>
                </ul>
              </div>
            )
          }
        </div>
      </div>
    </nav>
  )
}

Nav.propTypes = {
  onSearch: PropTypes.func,
  onZoom: PropTypes.func,
  onGeolocate: PropTypes.func,
  onCopyLink: PropTypes.func,
  onOpenExternal: PropTypes.func,
  onReset: PropTypes.func
}

export default Nav
