import i18n from './i18n'

// the default config, maps.config.js is merged into it: objects are merged, all other values,
// including arrays like groups, are replaced
export default {
  brand: {
    text: 'Maps',
  },
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
