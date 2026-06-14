import React, { useEffect, useRef } from 'react'
import { Modal } from 'bootstrap'

import { useConfig } from '../stores/config'
import { useUI } from '../stores/ui'

const MapModal = () => {
  const ref = useRef(null)
  const instance = useRef(null)

  const thumbnail = useConfig((s) => s.thumbnail)
  const groups = useConfig((s) => s.groups)

  const isOpen = useUI((s) => s.showMapModal)

  useEffect(() => {
    instance.current = new Modal(ref.current)
    const el = ref.current
    const handleHidden = () => useUI.getState().closeMapModal()
    el.addEventListener('hidden.bs.modal', handleHidden)
    return () => {
      el.removeEventListener('hidden.bs.modal', handleHidden)
      instance.current.dispose()
    }
  }, [])

  // drive visibility from the store
  useEffect(() => {
    if (isOpen) {
      instance.current?.show()
    } else {
      instance.current?.hide()
    }
  }, [isOpen])

  const backgroundImage = (map) => {
    const thumbnailUrl = map.url.replace('{z}/{x}/{y}', thumbnail)
    return `url("${thumbnailUrl}")`
  }

  return (
    <div className="modal" ref={ref} tabIndex="-1">
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Maps</h5>
            <button type="button" className="btn btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
                            <div className="map-card card h-100">
                              <div className="card-img-top" style={{backgroundImage: backgroundImage(map)}} />
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
