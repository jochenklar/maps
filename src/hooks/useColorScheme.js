import { useEffect } from 'react'

// sets the color mode of bootstrap to the color scheme of the system, also when it changes while the page is
// open, e.g. in the evening, only the interface is dark, the maps are not changed
const useColorScheme = () => {
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const update = () => { document.documentElement.dataset.bsTheme = query.matches ? 'dark' : 'light' }

    update()
    query.addEventListener('change', update)

    return () => query.removeEventListener('change', update)
  }, [])
}

export default useColorScheme
