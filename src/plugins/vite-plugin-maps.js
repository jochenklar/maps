import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react'

// the directory of this package, which contains index.html and src/
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

const virtualId = 'virtual:maps-config'
const resolvedVirtualId = '\0' + virtualId

const maps = ({ config = 'maps.config.js' } = {}) => {
  // the directory of the project using this package, which contains maps.config.js
  const cwd = process.cwd()
  const configPath = path.resolve(cwd, config)

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
      resolveId: (id) => {
        if (id === virtualId) return resolvedVirtualId
      },
      load(id) {
        if (id === resolvedVirtualId) {
          if (!existsSync(configPath)) {
            this.error(`config file not found: ${configPath}`)
          }
          return `export { default } from ${JSON.stringify(configPath)}`
        }
      },
    },
  ]
}

export default maps
