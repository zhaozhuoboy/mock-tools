// https://nuxt.com/docs/api/configuration/nuxt-config
import { startUpload } from "./upload"

// 本地环境
const local = !(process.env.OSS_PROD_INFO || process.env.OSS_TEST_INFO)
// 预发、生产环境
const prod = process.env.BUILD_ENV === 'prod'
// dev
const isDev = process.env.NODE_ENV !== 'production'

export default defineNuxtConfig({
  devtools: { enabled: true },

  devServer: {
    port: 6780
  },
  // 配置打包之后静态文件的 publicPath 和路径
  // 如何静态资源不需要上传cdn， cdnURL 为空
  app: {
    // cdnURL: 'https://danny-static.oss-cn-beijing.aliyuncs.com',
    buildAssetsDir: 'static/web/mock',
  },
  runtimeConfig: {
  },

  srcDir: 'src/',
  css: ['~/assets/css/main.scss'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/css/common.scss" as *;'
        }
      }
    },
    ssr: {
      // 原有配置上追加这三个
      noExternal: ['naive-ui', 'vueuc'],
    }
  },

  modules: [
    'nuxtjs-naive-ui',
    '@pinia/nuxt'
  ],
  // nuxt 的生命周期，在 nitro 服务器生成 public 资源之后开始将静态资源上传CDN
  hooks: {
    'nitro:build:public-assets': () => {
      // 静态资源上传 CDN
      // startUpload()
    }
  }
})
