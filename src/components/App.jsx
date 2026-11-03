import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import View from 'ol/View'

import { useConfig } from '../stores/config'
import { usePanes } from '../stores/panes'
import { useUI } from '../stores/ui'
import { fitMapsToExtent, geolocateMaps, setMapsView, setZoomLimits, storeViewOnChange, zoomMaps } from '../utils/maps'
import { getPlaceExtent } from '../utils/search'
import { getExternalUrl, getShareUrl, syncUrl } from '../utils/url'

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

  // the openlayers view which is shared by the maps of all panes, so that they move and zoom together,
  // the zoom levels are kept at integers, see utils/maps.js
  const [view] = useState(() => new View({ constrainResolution: true }))

  // before the init, so that the view from the url hash is stored
  useEffect(() => storeViewOnChange(view), [view])

  useEffect(() => {
    init(config)

    // start at the persisted view or the one from the config, the url hash overrides it in syncUrl
    const { groups, view: configView } = useConfig.getState()
    const { center, zoom } = useUI.getState().view ?? configView
    setZoomLimits(view, configView, groups)
    setMapsView(view, center, zoom)

    return syncUrl(view)
  }, [init, config, view])

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
    const { center, zoom } = useConfig.getState().view
    setMapsView(view, center, zoom)
  }, [view])

  return groups && (
    <main>
      <Nav
        onZoom={(delta) => zoomMaps(view, delta)}
        onSearch={(place) => fitMapsToExtent(view, getPlaceExtent(place), searchMaxZoom)}
        onGeolocate={() => geolocateMaps(view, geolocateMaxZoom)}
        onCopyLink={() => navigator.clipboard.writeText(getShareUrl())}
        onOpenExternal={(url) => window.open(getExternalUrl(url), '_blank', 'noopener')}
        onReset={openResetModal}
      />
      <div className="d-flex panes">
        <PaneContainer id="root" panes={panes} view={view} />
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
