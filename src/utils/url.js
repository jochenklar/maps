import { debounce } from 'lodash'

import { findMap, useConfig } from '../stores/config'
import { usePanes } from '../stores/panes'
import { useUI } from '../stores/ui'

import { formatHash, parseHash } from './hash'
import { setMapsView } from './maps'

// apply the panes, the view and the overlays from the url hash, this overrides the persisted state
const applyHash = (mapsRef) => {
  const { maxLevel } = useConfig.getState().panes
  const { panes, view, flags } = parseHash(window.location.hash, { maxLevel })
  if (panes) usePanes.getState().setPanes(panes)
  if (flags) useUI.setState(flags)
  if (view) setMapsView(mapsRef, view.center, view.zoom)
}

// the url hash for the current panes, view and overlays
const getHash = () => {
  const { groups, view: configView } = useConfig.getState()
  const { view: uiView, ...flags } = useUI.getState()
  const view = uiView ?? configView
  const { panes } = usePanes.getState()
  const getMapId = (id) => findMap(groups, id)?.id
  return formatHash({ view, panes, flags, getMapId })
}

// the url to share the current location, built from the stores, since the url hash is written debounced
const getShareUrl = () => new URL(getHash(), window.location.href).href

// write the panes, the view and the overlays to the url hash, so that the url can be shared,
// debounced since the view changes with every move and browsers limit replaceState
const writeHash = debounce(() => {
  window.history.replaceState(null, '', getHash())
}, 300)

// keep the url hash and the stores in sync, returns a function to stop syncing
const syncUrl = (mapsRef) => {
  const handleHashChange = () => applyHash(mapsRef)

  applyHash(mapsRef)
  writeHash()

  const unsubscribeUI = useUI.subscribe(writeHash)
  const unsubscribePanes = usePanes.subscribe(writeHash)
  window.addEventListener('hashchange', handleHashChange)

  return () => {
    unsubscribeUI()
    unsubscribePanes()
    window.removeEventListener('hashchange', handleHashChange)
    writeHash.cancel()
  }
}

export { getShareUrl, syncUrl }
