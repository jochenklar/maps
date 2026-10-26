import i18n from './i18n'

// the default config, maps.config.js is merged into it: objects are merged, all other values,
// including arrays like groups, are replaced
export default {
  brand: {},
  view: {
    center: [
      52.51,
      13.37628,
    ],
    zoom: 10,
  },
  geolocate: {
    maxZoom: 18,
  },
  search: {
    url: 'https://nominatim.openstreetmap.org/search',
    maxZoom: 18,
  },
  panes: {
    maxLevel: 3,
  },
  thumbnail: '13/4400/2686',
  // the external maps which can show the current view, {zoom}, {lat} and {lng} in the url are replaced,
  // urls without them get the view appended as #map=zoom/lat/lng, like on openstreetmap.org,
  // the url can also be a function which gets { zoom, lat, lng } and returns the url
  external: [
    {
      name: 'OpenStreetMap',
      url: 'https://www.openstreetmap.org/',
    },
    {
      name: 'Google Maps',
      url: 'https://www.google.com/maps/@{lat},{lng},{zoom}z',
    },
    {
      name: 'Google Earth',
      // google earth uses the distance of the camera in meters instead of a zoom level, it is estimated from
      // the meters per pixel at the zoom level for a screen of about 800 pixels height and its 35° field of view
      url: ({ zoom, lat, lng }) => {
        const metersPerPixel = 156543 * Math.cos(lat * Math.PI / 180) / 2 ** zoom
        const distance = Math.round(800 * metersPerPixel / (2 * Math.tan(17.5 * Math.PI / 180)))
        return `https://earth.google.com/web/@${lat},${lng},0a,${distance}d,35y,0h,0t,0r`
      },
    },
  ],
  // the texts of the interface by language, the language is taken from the browser, see src/config/i18n.js
  i18n,
  groups: [
    {
      name: 'Maps',
      maps: [
        {
          name: 'OpenStreetMap',
          url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          options: {
            attribution: '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
            minZoom: 0,
            maxZoom: 19,
          },
        },
      ],
    },
  ],
}
