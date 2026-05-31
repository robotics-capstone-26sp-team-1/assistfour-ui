import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { PrimeVueResolver } from '@primevue/auto-import-resolver'
import tailwindcss from '@tailwindcss/vite'
import vueDevTools from 'vite-plugin-vue-devtools'

const require = createRequire(import.meta.url)
const eventemitter3EsmPath = resolve(
  dirname(require.resolve('eventemitter3')),
  'dist/eventemitter3.esm.js',
)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [PrimeVueResolver()],
    }),
    tailwindcss(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      eventemitter3: eventemitter3EsmPath,
    },
  },
  optimizeDeps: {
    // Avoid Vite's dep-prebundle cycle bug with roslib/eventemitter3 in dev.
    exclude: ['roslib'],
  },
})
