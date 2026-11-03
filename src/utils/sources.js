import XYZ from 'ol/source/XYZ'

// the tile source of a map from the config, {s} is replaced by each of the subdomains, like in leaflet
const createSource = (map, transition) => new XYZ({
  urls: [...(map.options?.subdomains ?? 'abc')].map((s) => map.url.replace('{s}', s)),
  attributions: map.options?.attribution,
  minZoom: map.options?.minZoom ?? 0,
  maxZoom: map.options?.maxZoom ?? 18,
  transition
})

// the sources by map, openlayers caches the tiles by source, so that a map which is chosen again in a pane
// reuses its source and shows its tiles from the cache
const sources = new WeakMap()

const getSource = (map, transition) => {
  if (!sources.has(map)) sources.set(map, createSource(map, transition))
  return sources.get(map)
}

export { getSource }
