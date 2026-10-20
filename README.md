# @jochenklar/maps

A web app to compare tiled maps side by side. The screen can be split into panes, each showing a map chosen
from a configured list, and all panes move and zoom together. It includes a place search (using
[Nominatim](https://nominatim.org)), geolocation, a coordinate grid and a center marker. The view and the
layout of the panes are stored in the url, so that they can be shared.

The app is a [Vite](https://vite.dev) plugin: a project only contains a `maps.config.js` with the maps to show,
and the plugin provides the app and builds it into a static site.


## Setting up a new project

Create a directory with a `package.json`:

```json
{
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

Install this package from GitHub and Vite (Node.js 24 is used for development, see `.nvmrc`):

```bash
npm install github:jochenklar/maps vite
```

Add a `vite.config.js`, which only uses the plugin:

```js
import { defineConfig } from 'vite'
import maps from '@jochenklar/maps/vite'

export default defineConfig({
  plugins: [maps()],
})
```

Add a `maps.config.js` with the maps to show, see [Configuration](#configuration):

```js
export default {
  brand: {
    text: 'Berlin Maps',
  },
  view: {
    center: [52.51, 13.37628],
    zoom: 12,
  },
  groups: [
    {
      name: 'Maps',
      maps: [
        {
          name: 'OpenStreetMap',
          url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          options: {
            attribution: '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
            maxZoom: 19,
          },
        },
        {
          name: 'OpenTopoMap',
          url: 'https://tile.opentopomap.org/{z}/{x}/{y}.png',
          options: {
            attribution: '<a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)',
            maxZoom: 17,
          },
        },
      ],
    },
  ],
}
```

Longer HTML for `info` is easier to keep in its own file, which can be imported as text with `?raw`:

```js
import infoDe from './info.de.html?raw'
import infoEn from './info.en.html?raw'

export default {
  info: {
    de: infoDe,
    en: infoEn,
  },
  // ...
}
```

Similarly, the list of maps, which tends to get long, can be kept in a `maps.json` and imported:

```js
import groups from './maps.json'

export default {
  groups,
  // ...
}
```

`maps.json` then contains the array of groups, like `groups` above:

```json
[
  {
    "name": "Maps",
    "maps": [
      {
        "name": "OpenStreetMap",
        "url": "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        "options": {
          "attribution": "<a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap contributors</a>",
          "maxZoom": 19
        }
      }
    ]
  }
]
```

Optionally, add a `public/` directory for static files. Its content is copied into the build, and a
`public/icon.svg` is used as the favicon. A `maps.css` is loaded after the styles of the app, e.g. to set
the colors with the [CSS variables of Bootstrap](https://getbootstrap.com/docs/5.3/customize/css-variables/).

A `.gitignore` should contain at least:

```
node_modules/
dist/
```

The project then looks like this:

```
my-maps/
├── maps.config.js
├── maps.css
├── package.json
├── package-lock.json
├── public/
│   └── icon.svg
└── vite.config.js
```

Start the development server with `npm run dev`. `npm run build` builds the static site into `dist/`, which can
be served by any web server, and `npm run preview` serves the build locally.


## Configuration

`maps.config.js` is merged into the [default config](src/config/default.js), so only the values which differ
from the defaults need to be set. Objects are merged, all other values, including arrays like `groups`, are
replaced. Without a `maps.config.js`, only the default config is used.

| Key | Default | Description |
| --- | --- | --- |
| `brand.text` | `'Maps'` | The title of the page and of the info, or titles by language like `{ de, en }`. |
| `brand.href` | | The public url of the site, used for link previews. |
| `brand.image` | | The image of link previews, a url or a path relative to `brand.href`, e.g. `share.png` for a `public/share.png`. |
| `info` | | HTML which is shown in the info, which opens on the first visit and with the info button, or HTML by language like `{ de, en }`. Without `info`, there is no info button. |
| `view.center` | `[52.51, 13.37628]` | The initial center as `[lat, lng]`. |
| `view.zoom` | `10` | The initial zoom level. |
| `geolocate.maxZoom` | `18` | The maximal zoom level when moving to the current location. |
| `search.url` | `https://nominatim.openstreetmap.org/search` | The url of a [Nominatim search API](https://nominatim.org/release-docs/latest/api/Search/). |
| `search.maxZoom` | `18` | The maximal zoom level when moving to a search result. |
| `panes.maxLevel` | `3` | How often panes can be split inside each other. |
| `thumbnail` | `'13/4400/2686'` | The tile (`zoom/x/y`) which is shown for each map in the map selection. |
| `i18n` | English and German | The texts of the interface by language, see [src/config/i18n.js](src/config/i18n.js), e.g. `{ de: { search: 'Ortssuche' } }` to change a single string or `{ fr: { … } }` to add a language. The first language of the browser which has texts is used, otherwise English. Missing strings fall back to English, `searchAttribution` is HTML. |
| `groups` | OpenStreetMap | The maps, in groups like `[{ name, maps }]`, see below. |

Each map in `groups` has a `name`, a tile `url` with `{z}`, `{x}` and `{y}` placeholders (and optionally `{s}`
for subdomains), and `options` with the `attribution`, `minZoom` and `maxZoom` of the tile layer.

Maps are identified in the url by the path of their tile url before the placeholders, or the hostname if there is
no path, e.g. `tile.openstreetmap.org` or `berlin/geoportal/luftbilder/2026-dop20rgb`. These ids should be unique
and only contain letters, numbers, `_`, `-`, `.`, `~` and `/`, otherwise a warning is shown in the console.

For link previews in messengers and social media, the build writes a `<title>` and [Open Graph](https://ogp.me)
tags into `index.html`: the brand text (in English or the first language), `brand.href` as url and `brand.image`
as image.

The public Nominatim instance may only be used lightly, see its
[usage policy](https://operations.osmfoundation.org/policies/nominatim/). For sites with more traffic, set
`search.url` to another instance.


## Links

The url hash contains the layout of the panes and the view, e.g.

```
#panes=v(tile.openstreetmap.org,h(tile.opentopomap.org,tile.openstreetmap.org))&map=14/48.1370/11.5750
```

- `panes=id` is a single pane showing the map with this id.
- `panes=v(a,b)` is a pane split vertically (side by side), `panes=h(a,b)` one split horizontally (on top of each
  other), and `a` and `b` can be split again.
- `map=zoom/lat/lng` is the view, like on openstreetmap.org.
- `show=grid,crosshair,labels` lists the overlays which are shown: the coordinate grid, the center marker and the
  names of the maps. It is left out if none are shown.

Without a hash, the last layout and view are restored from the browser's local storage.


## Development

Clone the repository and install the dependencies:

```bash
git clone git@github.com:jochenklar/maps
cd maps
npm install
```

The repository uses the plugin itself, so `npm run dev` starts the app with the config from a `maps.config.js` and
the styles from a `maps.css` in the root of the repository, which are ignored by git, or with the default config if
there is none. Other commands:

```bash
npm run build    # build into dist/
npm run preview  # serve the build
npm run lint     # run eslint
```

The same commands are available as `make dev`, `make build`, `make lint` and `make preview`. Checks for each
commit are configured for [pre-commit](https://pre-commit.com) in `.pre-commit-config.yaml`.
