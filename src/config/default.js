// the default config, maps.config.js is merged into it: objects are merged, all other values,
// including arrays like groups, are replaced
export default {
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
  groups: [
    {
      name: 'Maps',
      maps: [
        {
          id: 'osm',
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
