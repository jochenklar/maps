import { existsSync, readFileSync } from 'node:fs'
import { defineConfig } from 'vite'

import maps from './src/plugin/vite-plugin-maps.js'

// the config for development is in maps.json, which is ignored by git, see README.md
const config = existsSync('maps.json') ? JSON.parse(readFileSync('maps.json', 'utf-8')) : {}

export default defineConfig({
  plugins: [maps(config)],
})
