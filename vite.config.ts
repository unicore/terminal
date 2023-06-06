import { resolve } from 'path'
import { defineConfig } from 'vite'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import vue from '@vitejs/plugin-vue'
import { createHtmlPlugin } from 'vite-plugin-html'
import Unocss from 'unocss/vite'
import presetUno from '@unocss/preset-uno'
import Pages from 'vite-plugin-pages'
import pluginRewriteAll from 'vite-plugin-rewrite-all'
import Layouts from 'vite-plugin-vue-layouts'
import VueI18n from '@intlify/vite-plugin-vue-i18n'
import { NodeGlobalsPolyfillPlugin } from 'unicore-esbuild-plugins/node-globals-polyfill/dist'
import { NodeModulesPolyfillPlugin } from 'unicore-esbuild-plugins/node-modules-polyfill/dist'
import progress from 'vite-plugin-progress'
import svgLoader from 'vite-svg-loader'
import { chunkSplitPlugin } from 'vite-plugin-chunk-split'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import nodePolyfills from 'rollup-plugin-node-polyfills/dist'
import { visualizer } from 'rollup-plugin-visualizer'

import config from './src/config'

export default defineConfig({
  plugins: [
    progress(),
    vue({ template: { transformAssetUrls } }),
    svgLoader({
      defaultImport: 'url',
    }),
    createHtmlPlugin({
      inject: {
        data: {
          SITE_TITLE: config.siteTitle || 'VOSHOD.IO | платформа токенизации бизнеса',
          SITE_DESCRIPTION: config.siteDescription || 'Управляй развитием бизнеса в закрытых клубах и получай доход согласно интеллектуальному вкладу',
          SITE_IMAGE: config.siteImage || 'https://ia.media-imdb.com/images/rock.jpg',
        },
      },
    }),
    quasar({ sassVariables: 'src/assets/style/quasar-variables.sass' }),
    pluginRewriteAll(),
    Pages({
      routeStyle: 'nuxt',
      dirs: [
        { dir: 'src/pages', baseRoute: '' },
        { dir: 'src/pages/blank', baseRoute: '' },
      ],
      extendRoute(route) {
        if (route.path.startsWith('/lk')) {
          return {
            ...route,
            meta: {
              ...(route.meta || {}),
              requiresAuth: !route.meta?.allowNonAuth,
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
    chunkSplitPlugin({
      strategy: 'single-vendor',
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
      long: resolve(__dirname, 'node_modules/long/umd/index.js'),
      bytebuffer: resolve(__dirname, 'node_modules/bytebuffer/dist/bytebuffer.js'),
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
      '/personal-data': 'https://platform.simply.estate/private-api',
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
      plugins: [
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        nodePolyfills(),
        visualizer(),
      ],
    },
  },
})
