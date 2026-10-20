import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { runnerImport } from 'vite'

import react from '@vitejs/plugin-react'

// the directory of this package, which contains index.html and src/
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

// the config and the styles of the project, see load below
const virtualIds = ['virtual:maps-config', 'virtual:maps-css']

// the title, the url and the image for link previews from the brand, they are written into index.html,
// since the crawlers of messengers and social media don't run javascript
const getMetaTags = ({ text, href, image } = {}) => {
  // a text by language like { de, en } uses english or the first language, since crawlers have no language
  const title = typeof text === 'object' ? (text.en ?? Object.values(text)[0]) : text
  const tag = (attrs) => ({ tag: 'meta', attrs, injectTo: 'head' })

  // crawlers need a full url for the image, so a path, e.g. of a file in public/, is resolved against href
  const imageUrl = image && (href ? new URL(image, href).href : image)

  return [
    title && { tag: 'title', children: title.replace(/&/g, '&amp;').replace(/</g, '&lt;'), injectTo: 'head' },
    title && tag({ property: 'og:title', content: title }),
    href && tag({ property: 'og:url', content: href }),
    imageUrl && tag({ property: 'og:image', content: imageUrl }),
  ].filter(Boolean)
}

const maps = ({ config = 'maps.config.js' } = {}) => {
  // the directory of the project using this package, which contains maps.config.js, maps.css and public/
  const cwd = process.cwd()
  const configPath = path.resolve(cwd, config)
  const cssPath = path.resolve(cwd, 'maps.css')

  return [
    react(),
    {
      name: 'maps',
      config: () => ({
        root,
        publicDir: path.resolve(cwd, 'public'),
        build: {
          outDir: path.resolve(cwd, 'dist'),
          emptyOutDir: true,
        },
        server: {
          fs: {
            allow: [root, cwd],
          },
        },
        css: {
          preprocessorOptions: {
            scss: {
              quietDeps: true,
              silenceDeprecations: ['import', 'legacy-js-api', 'global-builtin', 'color-functions'],
            },
          },
        },
      }),
      transformIndexHtml: async () => {
        if (!existsSync(configPath)) return []

        // load maps.config.js like the app does, so that it can import html with ?raw,
        // but without vite.config.js, which uses this plugin
        const { module } = await runnerImport(configPath, { configFile: false })
        return getMetaTags(module.default.brand)
      },
      resolveId: (id) => {
        if (virtualIds.includes(id)) return '\0' + id
      },
      load(id) {
        if (id === '\0virtual:maps-config') {
          // without a config file, only the default config is used, see src/config/default.js
          if (!existsSync(configPath)) {
            return 'export default {}'
          }
          return `export { default } from ${JSON.stringify(configPath)}`
        }
        if (id === '\0virtual:maps-css') {
          // the styles of the project are optional, they are loaded after the styles of the app
          return existsSync(cssPath) ? `import ${JSON.stringify(cssPath)}` : ''
        }
      },
    },
  ]
}

export default maps
