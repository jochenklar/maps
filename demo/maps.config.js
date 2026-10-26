import infoDe from './info.de.html?raw'
import infoEn from './info.en.html?raw'

const osm = '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
const osmFrance = '<a href="https://openstreetmap.fr">OpenStreetMap France</a>'

export default {
  brand: {
    text: 'Maps (development)',
  },
  info: {
    de: infoDe,
    en: infoEn,
  },
  view: {
    center: [52.51, 13.37628],
    zoom: 12,
  },
  groups: [
    {
      name: 'OpenStreetMap',
      maps: [
        {
          name: 'Standard',
          url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          options: {
            attribution: osm,
            maxZoom: 19,
          },
        },
        {
          name: 'CyclOSM',
          url: 'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
          options: {
            attribution: `${osm}, <a href="https://www.cyclosm.org">CyclOSM</a> hosted by ${osmFrance}`,
            maxZoom: 20,
          },
        },
        {
          name: 'Humanitarian',
          url: 'https://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png',
          options: {
            attribution: `${osm}, <a href="https://www.hotosm.org">Humanitarian OpenStreetMap Team</a> hosted by ${osmFrance}`,
            maxZoom: 20,
          },
        },
      ],
    },
  ],
}
