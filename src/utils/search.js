import { latLngBounds } from 'leaflet'

// search for places with nominatim, see https://nominatim.org/release-docs/latest/api/Search/,
// the usage policy forbids searching while typing, so this should only be called on submit
const searchPlaces = async (url, query) => {
  const params = new URLSearchParams({ q: query, format: 'jsonv2', limit: 10 })
  const response = await fetch(`${url}?${params}`)
  if (!response.ok) {
    throw new Error(`search failed with status ${response.status}`)
  }
  return response.json()
}

// the bounding box of a place from nominatim is [south, north, west, east] as strings
const getPlaceBounds = (place) => {
  const [south, north, west, east] = place.boundingbox.map(Number)
  return latLngBounds([south, west], [north, east])
}

export { getPlaceBounds, searchPlaces }
