import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['import', 'color-functions', 'global-builtin'],
      },
    },
  },
})
