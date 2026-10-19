import { defineConfig } from 'vite'

import maps from './src/plugins/vite-plugin-maps.js'

export default defineConfig({
  plugins: [maps()],
  server: {
    port: 8080
  },
})
