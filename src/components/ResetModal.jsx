import React, { useCallback, useRef } from 'react'
import PropTypes from 'prop-types'

import useModal from '../hooks/useModal'
import { useConfig } from '../stores/config'
import { useUI } from '../stores/ui'

const ResetModal = ({ onReset }) => {
  const strings = useConfig((s) => s.strings)

  const showResetModal = useUI((s) => s.showResetModal)
  const closeResetModal = useUI((s) => s.closeResetModal)

  // the reset is done after the modal is hidden, since it opens the info modal again,
  // which would otherwise be shown while this modal is still fading out
  const confirmed = useRef(false)

  const handleHidden = useCallback(() => {
    closeResetModal()
    if (confirmed.current) {
      confirmed.current = false
      onReset()
    }
  }, [closeResetModal, onReset])

  const ref = useModal(showResetModal, handleHidden)

  const handleConfirm = () => {
    confirmed.current = true
    closeResetModal()
  }

  return (
    <div className="modal" ref={ref} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{strings.resetConfirm}</h5>
            <button type="button" className="btn btn-close" data-bs-dismiss="modal" aria-label={strings.close}></button>
          </div>
          <div className="modal-body">
            {strings.resetText}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-danger" onClick={handleConfirm}>
              {strings.reset}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

ResetModal.propTypes = {
  onReset: PropTypes.func
}

export default ResetModal
