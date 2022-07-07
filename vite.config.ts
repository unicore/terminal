import { resolve } from 'path'
import { defineConfig } from 'vite'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'
import presetUno from '@unocss/preset-uno'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import VueI18n from '@intlify/vite-plugin-vue-i18n'
import NodeGlobalsPolyfillPlugin from '@esbuild-plugins/node-globals-polyfill'
import NodeModulesPolyfillPlugin from '@esbuild-plugins/node-modules-polyfill'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'

import nodePolyfills from 'rollup-plugin-node-polyfills'

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
      fullInstall: false,
    }),
  ],
  resolve: {
    alias: {
      src: resolve(__dirname, 'src'),
      '~': resolve(__dirname, 'src'),
      crypto: 'crypto-browserify',
      assert: 'assert-browserify',
      'readable-stream': 'vite-compatible-readable-stream',
      util: 'util',
      sys: 'util',
      events: 'rollup-plugin-node-polyfills/polyfills/events',
      stream: 'rollup-plugin-node-polyfills/polyfills/stream',
      path: 'rollup-plugin-node-polyfills/polyfills/path',
      querystring: 'rollup-plugin-node-polyfills/polyfills/qs',
      punycode: 'rollup-plugin-node-polyfills/polyfills/punycode',
      url: 'rollup-plugin-node-polyfills/polyfills/url',
      http: 'rollup-plugin-node-polyfills/polyfills/http',
      https: 'rollup-plugin-node-polyfills/polyfills/http',
      os: 'rollup-plugin-node-polyfills/polyfills/os',
      constants: 'rollup-plugin-node-polyfills/polyfills/constants',
      _stream_duplex: 'rollup-plugin-node-polyfills/polyfills/readable-stream/duplex',
      _stream_passthrough: 'rollup-plugin-node-polyfills/polyfills/readable-stream/passthrough',
      _stream_readable: 'rollup-plugin-node-polyfills/polyfills/readable-stream/readable',
      _stream_writable: 'rollup-plugin-node-polyfills/polyfills/readable-stream/writable',
      _stream_transform: 'rollup-plugin-node-polyfills/polyfills/readable-stream/transform',
      timers: 'rollup-plugin-node-polyfills/polyfills/timers',
      console: 'rollup-plugin-node-polyfills/polyfills/console',
      vm: 'rollup-plugin-node-polyfills/polyfills/vm',
      zlib: 'rollup-plugin-node-polyfills/polyfills/zlib',
      tty: 'rollup-plugin-node-polyfills/polyfills/tty',
      domain: 'rollup-plugin-node-polyfills/polyfills/domain',
    },
  },
  server: {
    https: false,
    port: 3001,
    proxy: {
      '/api': 'https://gaia.holdings',
      '/upload': 'https://storage.intellect.run',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  build: {
    target: 'es2021',
    minify: true,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 2048,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/')) {
            const modules = ['quasar', '@quasar', 'vue', '@vue']
            const chunk = modules.find((module) => id.includes(`${module}`))
            return chunk ? `vendor-${chunk}` : 'vendor'
          }
        },
      },
      plugins: [
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        nodePolyfills(),
      ],
    },
  },
})
