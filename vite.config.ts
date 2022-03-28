import { resolve } from 'path'
import { defineConfig } from 'vite'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import { presetUno } from 'unocss'
import VueI18n from '@intlify/vite-plugin-vue-i18n'
import NodeGlobalsPolyfillPlugin from '@esbuild-plugins/node-globals-polyfill'

export default defineConfig({
  plugins: [
    vue({ template: { transformAssetUrls } }),
    quasar({ sassVariables: 'src/assets/style/quasar-variables.sass' }),
    Pages({
      routeStyle: 'nuxt',
      dirs: [
        { dir: 'src/pages', baseRoute: '' },
        { dir: 'src/pages/blank', baseRoute: '' },
      ],
      extendRoute(route) {
        if (route.path.startsWith('/secured')) {
          return {
            ...route,
            meta: {
              ...(route.meta || {}),
              requiresAuth: true,
            },
          }
        }

        return route
      },
    }),
    Layouts(),
    Unocss({
      presets: [presetUno()],
    }),
    VueI18n({
      include: resolve(__dirname, './src/locales/**'),
    }),
  ],
  define: {
    global: {},
  },
  resolve: {
    alias: {
      src: resolve(__dirname, 'src'),
      '~': resolve(__dirname, 'src'),
      process: 'process/browser',
      stream: 'stream-browserify',
      zlib: 'browserify-zlib',
      util: 'util',
      crypto: 'crypto-browserify',
      assert: 'assert-browserify',
    },
  },
  server: {
    https: false,
    port: 3001,
  },
  optimizeDeps: {
    include: ['bip39'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
  build: {
    commonjsOptions: {
      include: [/bip39/, /node_modules/],
      transformMixedEsModules: true,
    },
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1024,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/')) {
            const modules = ['quasar', '@quasar', 'vue', '@vue']
            const chunk = modules.find((module) => id.includes(`/node_modules/${module}`))
            return chunk ? `vendor-${chunk}` : 'vendor'
          }
        },
      },
    },
  },
})
