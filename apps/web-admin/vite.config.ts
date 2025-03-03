import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import fs from 'fs'
import { defineConfig, loadEnv, ConfigEnv } from 'vite'
import DefineOptions from 'unplugin-vue-define-options/vite'
import viteCompression from 'vite-plugin-compression'
import UnoCSS from 'unocss/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

const viteConfig = defineConfig((mode: ConfigEnv) => {
  const env = loadEnv(mode.mode, process.cwd())

  const optimizeDepsElementPlusIncludes = ['element-plus/es']
  fs.readdirSync('node_modules/element-plus/es/components').map(dirname => {
    fs.access(`node_modules/element-plus/es/components/${dirname}/style/css.mjs`, err => {
      if (!err) {
        optimizeDepsElementPlusIncludes.push(`element-plus/es/components/${dirname}/style/css`)
      }
    })
  })

  return {
    // vueSetupExtend(),
    plugins: [
      vue(),
      DefineOptions(),
      viteCompression(),
      UnoCSS({ presets: [] }),
      vueJsx(),
      vueDevTools(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    optimizeDeps: {
      include: optimizeDepsElementPlusIncludes,
    },
    root: process.cwd(),
    resolve: {
      alias: {
        '@': resolve(__dirname, '.', 'src'),
        // '@': './src',
      },
    },
    base: mode.command === 'serve' ? './' : env.VITE_PUBLIC_PATH,
    // base: '/PengBlogAdmin/',
    server: {
      host: '0.0.0.0',
      port: env.VITE_PORT as unknown as number,
      open: JSON.parse(env.VITE_OPEN),
      hmr: true,
      proxy: {
        '/api': {
          target: env.VITE_DEV_SERVER_GATEWAY as string,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
    build: {
      outDir: 'dist',
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name].[hash].js`,
          chunkFileNames: `assets/[name].[hash].js`,
          assetFileNames: `assets/[name].[hash].[ext]`,
          compact: true,
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'],
            echarts: ['echarts'],
          },
        },
      },
    },
    css: { preprocessorOptions: { css: { charset: false } } },
    define: {
      __NEXT_VERSION__: JSON.stringify(process.env.npm_package_version),
      __NEXT_NAME__: JSON.stringify(process.env.npm_package_name),
    },
  }
})

export default viteConfig
