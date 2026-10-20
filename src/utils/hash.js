// the url hash stores the view and the pane layout, e.g.
// #panes=v(tile.openstreetmap.org,berlin/geoportal/luftbilder/2026-dop20rgb)&map=14/52.51000/13.37628
//
// panes=id               a single pane, showing the map with this id, see getMapId in stores/config.js
// panes=v(a,b), h(a,b)   a pane split vertically (side by side) or horizontally (on top of each other)
// map=zoom/lat/lng       like on openstreetmap.org
// show=grid,labels       the overlays which are shown, missing if none

const directions = {
  vertical: 'v',
  horizontal: 'h',
}

// the overlays by their name in the url and their flag in the ui store
const overlays = {
  grid: 'showGrid',
  crosshair: 'showCrosshair',
  labels: 'showLabels',
}

// map ids are used without encoding, so they are restricted to letters, numbers, '_', '-', '.', '~' and '/'
const isValidMapId = (id) => /^[\w.~/-]+$/.test(id)

// the precision of the coordinates depending on the zoom, like in leaflet-hash
const getPrecision = (zoom) => Math.max(0, Math.ceil(Math.log(zoom) / Math.LN2))

const formatView = ({ center, zoom }) => {
  const [lat, lng] = Array.isArray(center) ? center : [center.lat, center.lng]
  const precision = getPrecision(zoom)
  return `${zoom}/${lat.toFixed(precision)}/${lng.toFixed(precision)}`
}

const formatPanes = (panes, getMapId, id = 'root') => {
  const pane = panes[id]
  if (pane.children.length === 0) {
    return getMapId(pane.map)
  }
  const children = pane.children.map((childId) => formatPanes(panes, getMapId, childId))
  return `${directions[pane.direction]}(${children.join(',')})`
}

const formatShow = (flags) => Object.keys(overlays).filter((name) => flags[overlays[name]]).join(',')

const formatHash = ({ view, panes, flags, getMapId }) => {
  const show = formatShow(flags)
  return `#panes=${formatPanes(panes, getMapId)}&map=${formatView(view)}` + (show ? `&show=${show}` : '')
}

const parseView = (string) => {
  const [zoom, lat, lng] = string.split('/').map(Number)
  if ([zoom, lat, lng].some(Number.isNaN) || Math.abs(lat) > 90) {
    throw new Error(`invalid view "${string}"`)
  }
  return { center: [lat, lng], zoom }
}

// returns the flags of all overlays, the ones which are not listed are false
const parseShow = (string) => {
  const names = string ? string.split(',') : []
  names.filter((name) => !overlays[name]).forEach((name) => console.warn(`unknown overlay "${name}"`))
  return Object.fromEntries(Object.entries(overlays).map(([name, flag]) => [flag, names.includes(name)]))
}

// parse the layout into a tree like { direction: 'vertical', children: [{ map: 'osm' }, { map: 'dop20' }] }
const parsePanes = (string, maxLevel) => {
  let position = 0

  const expect = (char) => {
    if (string[position] !== char) {
      throw new Error(`invalid panes "${string}", expected "${char}" at position ${position}`)
    }
    position++
  }

  const parseNode = (level) => {
    if (level > maxLevel) {
      throw new Error(`invalid panes "${string}", too many levels`)
    }

    const direction = Object.keys(directions).find((key) => directions[key] === string[position])
    if (direction && string[position + 1] === '(') {
      position += 2
      const first = parseNode(level + 1)
      expect(',')
      const second = parseNode(level + 1)
      expect(')')
      return { direction, children: [first, second] }
    }

    const match = string.slice(position).match(/^[\w.~/-]+/)
    if (!match) {
      throw new Error(`invalid panes "${string}", expected a map id at position ${position}`)
    }
    position += match[0].length
    return { map: match[0] }
  }

  const tree = parseNode(0)
  if (position !== string.length) {
    throw new Error(`invalid panes "${string}", unexpected "${string.slice(position)}"`)
  }
  return tree
}

// returns { panes, view, flags }, panes and view are undefined if they are missing or invalid,
// layouts with panes deeper than maxLevel are invalid, flags is undefined if the hash is empty,
// otherwise the overlays which are not in show are turned off, so that a link shows exactly its state
const parseHash = (hash, { maxLevel }) => {
  const params = new URLSearchParams(hash.replace(/^#/, ''))
  const result = {}

  if (params.has('panes')) {
    try {
      result.panes = parsePanes(params.get('panes'), maxLevel)
    } catch (error) {
      console.warn(error.message)
    }
  }

  if (params.has('map')) {
    try {
      result.view = parseView(params.get('map'))
    } catch (error) {
      console.warn(error.message)
    }
  }

  if (params.has('panes') || params.has('map') || params.has('show')) {
    result.flags = parseShow(params.get('show'))
  }

  return result
}

export { formatHash, isValidMapId, parseHash }
