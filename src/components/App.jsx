import React, { useCallback, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import { useConfig } from '../stores/config'
import { usePanes } from '../stores/panes'
import { useUI } from '../stores/ui'
import { fitMapsToBounds, geolocateMaps, setMapRef, setMapsView, zoomMaps } from '../utils/maps'
import { getPlaceBounds } from '../utils/search'
import { getShareUrl, syncUrl } from '../utils/url'

import InfoModal from './InfoModal.jsx'
import MapModal  from './MapModal.jsx'
import Nav from './Nav.jsx'
import PaneContainer from './PaneContainer.jsx'
import ResetModal from './ResetModal.jsx'

const App = ({ config }) => {
  const init = useConfig((s) => s.init)
  const groups = useConfig((s) => s.groups)
  const geolocateMaxZoom = useConfig((s) => s.geolocate?.maxZoom)
  const searchMaxZoom = useConfig((s) => s.search?.maxZoom)
  const info = useConfig((s) => s.info)
  const brandText = useConfig((s) => s.brand?.text)
  const lang = useConfig((s) => s.lang)

  const panes = usePanes((state) => state.panes)
  const openResetModal = useUI((s) => s.openResetModal)

  // the leaflet maps of all panes by pane id, and whether they are currently synced, see utils/maps.js
  const mapsRef = useRef({ maps: {}, isSyncing: false })

  useEffect(() => {
    init(config)
    return syncUrl(mapsRef)
  }, [init, config])

  useEffect(() => {
    if (brandText) document.title = brandText
  }, [brandText])

  useEffect(() => {
    if (lang) document.documentElement.lang = lang
  }, [lang])

  // reset the panes and the ui to their initial state and move the maps to the view from the config,
  // the persisted state and the url hash are updated by the stores, it is confirmed in the ResetModal
  const handleReset = useCallback(() => {
    usePanes.setState(usePanes.getInitialState())
    useUI.setState(useUI.getInitialState())

    // use the merged config, since the view might only be set in the defaults
    const { view } = useConfig.getState()
    setMapsView(mapsRef, view.center, view.zoom)
  }, [])

  return groups && (
    <main>
      <Nav
        onZoom={(delta) => zoomMaps(mapsRef, delta)}
        onSearch={(place) => fitMapsToBounds(mapsRef, getPlaceBounds(place), searchMaxZoom)}
        onGeolocate={() => geolocateMaps(mapsRef, geolocateMaxZoom)}
        onCopyLink={() => navigator.clipboard.writeText(getShareUrl())}
        onReset={openResetModal}
      />
      <div className="d-flex panes">
        <PaneContainer
          id="root"
          panes={panes}
          setMapRef={(id) => setMapRef(mapsRef, id)}
        />
      </div>
      <MapModal />
      <ResetModal onReset={handleReset} />
      {info && <InfoModal />}
    </main>
  )
}

App.propTypes = {
  config: PropTypes.object
}

export default App
