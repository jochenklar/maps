import React, { useEffect } from 'react'
import classNames from 'classnames'

import useModal from '../hooks/useModal'
import { findMap, useConfig } from '../stores/config'
import { usePanes } from '../stores/panes'
import { useUI } from '../stores/ui'

const MapModal = () => {
  const thumbnail = useConfig((s) => s.thumbnail)
  const groups = useConfig((s) => s.groups)
  const strings = useConfig((s) => s.strings)

  const showMapModal = useUI((s) => s.showMapModal)
  const closeMapModal = useUI((s) => s.closeMapModal)
  const currentPane = useUI((s) => s.currentPane)

  const changeMap = usePanes((s) => s.changeMap)

  // the map of the pane where the modal was opened, read from the panes, so that it is up to date after a change
  const paneMap = usePanes((s) => s.panes[currentPane?.id]?.map)
  const activeId = paneMap && findMap(groups, paneMap)?.id

  const ref = useModal(showMapModal, closeMapModal)

  // scroll the selected map into view, once the modal is shown, since it can't be scrolled while it is hidden
  useEffect(() => {
    const el = ref.current
    const handleShown = () => {
      el.querySelector('.map-card.active')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
    el.addEventListener('shown.bs.modal', handleShown)
    return () => el.removeEventListener('shown.bs.modal', handleShown)
  }, [ref])

  // the placeholders can be in any order, e.g. {z}/{y}/{x}, and {s} is the first subdomain, like in leaflet
  const thumbnailUrl = (map) => {
    const [z, x, y] = thumbnail.split('/')
    const s = map.options?.subdomains?.[0] ?? 'a'
    return map.url.replace('{z}', z).replace('{x}', x).replace('{y}', y).replace('{s}', s)
  }

  const handleClick = (map) => {
    changeMap(currentPane, map.id)
    closeMapModal()
  }

  return (
    <div className="modal" ref={ref} tabIndex="-1">
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{strings.maps}</h5>
            <button type="button" className="btn btn-close" data-bs-dismiss="modal" aria-label={strings.close}></button>
          </div>
          <div className="modal-body px-1">
            <div className="d-flex flex-column gap-4">
              {
                groups.map((group, groupIndex) => (
                  <div key={groupIndex} className="container">
                    <h6 className="mb-3">{group.name}</h6>
                    <div className="row g-3">
                      {
                        group.maps.map((map, mapIndex) => (
                          <div key={mapIndex} className="col-md-3">
                            <div
                              className={classNames('map-card card h-100', { active: map.id === activeId })}
                              onClick={() => handleClick(map)}
                            >
                              <img
                                className="card-img-top"
                                src={thumbnailUrl(map)}
                                alt={map.name}
                                fetchPriority="low"
                              />
                              <div className="card-body px-2 py-1">
                                <p className="card-text">
                                  {map.name}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MapModal
