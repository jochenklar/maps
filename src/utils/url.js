import { debounce } from 'lodash'

import { findMap, useConfig } from '../stores/config'
import { usePanes } from '../stores/panes'

import { formatHash, parseHash } from './hash'
import { setMapsView } from './maps'

// apply the panes and the view from the url hash, this overrides the persisted state
const applyHash = (mapsRef) => {
  const { maxLevel } = useConfig.getState().panes
  const { panes, view } = parseHash(window.location.hash, { maxLevel })
  if (panes) usePanes.getState().setPanes(panes)
  if (view) setMapsView(mapsRef, view.center, view.zoom)
}

// write the panes and the view to the url hash, so that the url can be shared,
// debounced since the view changes with every move and browsers limit replaceState
const writeHash = debounce(() => {
  const { view, groups } = useConfig.getState()
  const { panes } = usePanes.getState()
  const getMapId = (id) => findMap(groups, id)?.id
  window.history.replaceState(null, '', formatHash({ view, panes, getMapId }))
}, 300)

// keep the url hash and the stores in sync, returns a function to stop syncing
const syncUrl = (mapsRef) => {
  const handleHashChange = () => applyHash(mapsRef)

  applyHash(mapsRef)
  writeHash()

  const unsubscribeConfig = useConfig.subscribe(writeHash)
  const unsubscribePanes = usePanes.subscribe(writeHash)
  window.addEventListener('hashchange', handleHashChange)

  return () => {
    unsubscribeConfig()
    unsubscribePanes()
    window.removeEventListener('hashchange', handleHashChange)
    writeHash.cancel()
  }
}

export { syncUrl }
