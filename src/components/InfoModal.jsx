import React from 'react'

import useModal from '../hooks/useModal'
import { useConfig } from '../stores/config'
import { useUI } from '../stores/ui'

const InfoModal = () => {
  const brand = useConfig((s) => s.brand)
  const info = useConfig((s) => s.info)
  const strings = useConfig((s) => s.strings)

  const showInfoModal = useUI((s) => s.showInfoModal)
  const closeInfoModal = useUI((s) => s.closeInfoModal)

  const ref = useModal(showInfoModal, closeInfoModal)

  return (
    <div className="modal" ref={ref} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {brand.text ?? document.title}
            </h5>
            <button type="button" className="btn btn-close" data-bs-dismiss="modal" aria-label={strings.close}></button>
          </div>
          <div className="modal-body" dangerouslySetInnerHTML={{ __html: info }} />
        </div>
      </div>
    </div>
  )
}

export default InfoModal
