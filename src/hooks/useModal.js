import { useEffect, useRef } from 'react'
import { Modal } from 'bootstrap'

// show and hide a bootstrap modal from the stores, returns the ref for the modal element,
// onHidden is called when bootstrap closes the modal, e.g. with the close button, escape or the backdrop
const useModal = (show, onHidden) => {
  const ref = useRef(null)
  const instance = useRef(null)

  useEffect(() => {
    const el = ref.current
    instance.current = new Modal(el)
    el.addEventListener('hidden.bs.modal', onHidden)
    return () => {
      // hide a shown modal without calling onHidden, otherwise its backdrop would remain after dispose
      el.removeEventListener('hidden.bs.modal', onHidden)
      instance.current.hide()
      instance.current.dispose()
    }
  }, [onHidden])

  useEffect(() => {
    if (show) {
      instance.current.show()
    } else {
      instance.current.hide()
    }
  }, [show])

  return ref
}

export default useModal
