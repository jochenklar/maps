import { useEffect, useState } from 'react'

// browsers only allow the location in secure contexts, i.e. with https or on localhost
const isAvailable = window.isSecureContext && 'geolocation' in navigator

// returns whether the location can be used, which is not the case if it is not available or the permission
// was denied, the permission can change while the page is open, e.g. when the user denies the prompt
const useGeolocation = () => {
  const [allowed, setAllowed] = useState(isAvailable)

  useEffect(() => {
    if (!isAvailable || !navigator.permissions) return

    let status = null
    const update = () => setAllowed(status.state !== 'denied')

    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      status = result
      update()
      status.addEventListener('change', update)
    }).catch(() => {
      // browsers without the permissions api for the location keep the button
    })

    return () => status?.removeEventListener('change', update)
  }, [])

  return allowed
}

export default useGeolocation
