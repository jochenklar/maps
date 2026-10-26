# @jochenklar/maps

A web app to compare tiled maps side by side. The screen can be split into panes, each showing a map chosen
from a configured list, and all panes move and zoom together. It includes a place search (using
[Nominatim](https://nominatim.org)), geolocation, a coordinate grid and a center marker. The view and the
layout of the panes are stored in the url, so that they can be shared.

The app is a React component: a project is a small [Vite](https://vite.dev) app, which renders the component
with a `maps.config.js` containing the maps to show, and builds it into a static site.


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

Install this package from GitHub, React and Vite (Node.js 24 is used for development, see `.nvmrc`):

```bash
npm install github:jochenklar/maps react react-dom vite @vitejs/plugin-react
```

Add a `vite.config.js` with the React plugin, the options for scss silence the deprecation warnings of Bootstrap:

```js
import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        silenceDeprecations: ['import', 'legacy-js-api', 'global-builtin', 'color-functions'],
      },
    },
  },
})
```

Add an `index.html` with the title of the page and, for link previews in messengers and social media, the
[Open Graph](https://ogp.me) tags, since their crawlers don't run javascript:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Berlin Maps</title>
    <meta property="og:title" content="Berlin Maps" />
    <meta property="og:url" content="https://maps.example.com" />
    <meta property="og:image" content="https://maps.example.com/share.png" />
    <link rel="icon" type="image/svg+xml" href="/icon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/main.jsx"></script>
  </body>
</html>
```

Add a `main.jsx`, which renders the app with the config. It imports Bootstrap and its icons, then the styles of
the app and then the styles of the project, e.g. a `maps.css`:

```jsx
import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Maps } from '@jochenklar/maps'

import '@jochenklar/maps/bootstrap.scss'
import '@jochenklar/maps/style.scss'
import './maps.css'

import config from './maps.config.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Maps config={config} />
  </StrictMode>,
)
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

Optionally, add a `public/` directory for static files, like the favicon. Its content is copied into the build.
The `maps.css` can be used to set the colors with the
[CSS variables of Bootstrap](https://getbootstrap.com/docs/5.3/customize/css-variables/).

A `.gitignore` should contain at least:

```
node_modules/
dist/
```

The project then looks like this:

```
my-maps/
├── index.html
├── main.jsx
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

The config is merged into the [default config](src/config/default.js), so only the values which differ
from the defaults need to be set. Objects are merged, all other values, including arrays like `groups`, are
replaced. With an empty config `{}`, only the default config is used.

| Key | Default | Description |
| --- | --- | --- |
| `brand.text` | | The title of the page and of the info, or titles by language like `{ de, en }`. Without it, the `<title>` from `index.html` is used. |
| `info` | | HTML which is shown in the info, which opens on the first visit and with the info button, or HTML by language like `{ de, en }`. Without `info`, there is no info button. |
| `view.center` | `[52.51, 13.37628]` | The initial center as `[lat, lng]`. |
| `view.zoom` | `10` | The initial zoom level. |
| `geolocate.maxZoom` | `18` | The maximal zoom level when moving to the current location. |
| `search.url` | `https://nominatim.openstreetmap.org/search` | The url of a [Nominatim search API](https://nominatim.org/release-docs/latest/api/Search/). |
| `search.maxZoom` | `18` | The maximal zoom level when moving to a search result. |
| `panes.maxLevel` | `3` | How often panes can be split inside each other. |
| `thumbnail` | `'13/4400/2686'` | The tile (`zoom/x/y`) which is shown for each map in the map selection. |
| `external` | OpenStreetMap, Google Maps, Google Earth | The external maps in the options menu, which open the current view, like `[{ name, url }]`. `{zoom}`, `{lat}` and `{lng}` in the `url` are replaced, e.g. `https://www.google.com/maps/@{lat},{lng},{zoom}z`, urls without them get `#map=zoom/lat/lng` appended, like on openstreetmap.org. The `url` can also be a function, which gets the view as `{ zoom, lat, lng }` and returns the url, e.g. for Google Earth, which needs a camera distance instead of a zoom level. The `name` can also be given by language like `{ de, en }`, `[]` hides them. To add one to the defaults, use `import { defaults } from '@jochenklar/maps'` and `external: [...defaults.external, { name, url }]`. |
| `i18n` | English and German | The texts of the interface by language, see [src/config/i18n.js](src/config/i18n.js), e.g. `{ de: { search: 'Ortssuche' } }` to change a single string or `{ fr: { … } }` to add a language. The first language of the browser which has texts is used, otherwise English. Missing strings fall back to English, `searchAttribution` is HTML. |
| `groups` | OpenStreetMap | The maps, in groups like `[{ name, maps }]`, see below. The `name` of a group can also be given by language like `{ de, en }`. |

Each map in `groups` has a `name`, a tile `url` with `{z}`, `{x}` and `{y}` placeholders (and optionally `{s}`
for subdomains), and `options` with the `attribution`, `minZoom` and `maxZoom` of the tile layer.

Maps are identified in the url by the path of their tile url before the placeholders, or the hostname if there is
no path, e.g. `tile.openstreetmap.org` or `berlin/geoportal/luftbilder/2026-dop20rgb`. These ids should be unique
and only contain letters, numbers, `_`, `-`, `.`, `~` and `/`, otherwise a warning is shown in the console.

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

The demo app for development is in `demo/`, which is set up like a project, but uses the component from `src/`
directly. `npm run dev` starts it with the config from `demo/maps.config.js`. Other commands:

```bash
npm run build    # build into demo/dist/
npm run preview  # serve the build
npm run lint     # run eslint
```

The same commands are available as `make dev`, `make build`, `make lint` and `make preview`. Checks for each
commit are configured for [pre-commit](https://pre-commit.com) in `.pre-commit-config.yaml`.
