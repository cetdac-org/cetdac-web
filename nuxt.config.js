const chineseS2T = require('chinese-s2t')

module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href:
          '/loading.css'
      },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href:
          '/barrager/css/barrager.css'
      }
    ],
    script: [
      {
        src: "https://code.jquery.com/jquery-1.9.1.min.js",
        type: "text/javascript"
      },
      {
        src: "/barrager/js/jquery.barrager.js?1",
        type: "text/javascript"
      }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  router: {
    middleware: ["i18n"]
  },
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    "~/plugins/cookies",
    '~/plugins/utils',
    { src: "~/plugins/i18n"},
    { src: "~/plugins/exchangeAxios"},
    // { src: "~/plugins/awsome", ssr: false },
    { src: "~/plugins/ga", ssr: false}
  ],
  axios:{
    withCredentials:false,
  },
  proxy: {
    //开启代理
    "/api/": {
      target:"http://localhost:4001",
      pathRewrite: {"^/api/":""}
    }
  },
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://bootstrap-vue.js.org/docs/
    'bootstrap-vue/nuxt'
  ],
  /*
  ** Global CSS
  */
 css: [
    { src: "~assets/scss/global.scss", lang: "scss" }
  ],

  performance: {
    prefetch: true
  },

  cache: true,
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    analyze: false,
    extractCSS:true,
    /*
    ** Run ESLINT on save
    */
    //publicPath: process.env.NODE_ENV === "pre"? "https://precdn.viabtc.com/static/": "https://cdn.viabtc.com/static/",
    // filenames: {
    //   manifest: "manifest.[hash:7].js",
    //   css: "style.[hash:7].css",
    //   vendor: "vendor.[hash:7].js",
    //   app: "abct.[hash:7].js",
    //   chunk: "[id].abct.[hash:7].js"
    // },
    extend(config, ctx) {
      // config.module.rules.push({
      //   test: /\.(jpe?g|png|svg|gif)$/,
      //   loader: ["srcset-loader"],
      //   exclude: /(node_modules)/,
      //   resourceQuery: /[?&](sizes|placeholder)(=|&|\[|$)/
      // });

      // if (ctx.isClient) {
      //   config.module.rules.push({
      //     enforce: "pre",
      //     test: /\.(js|vue)$/,
      //     loader: ["eslint-loader"],
      //     exclude: /(node_modules)/
      //   });
      // }
      // if (!ctx.isDev) {
      //   //生产环境，图片压缩
      //   config.module.rules.push({
      //     test: /\.(gif|png|jpe?g|svg)$/i,
      //     //test: /\.(gif|svg)$/i,
      //     loaders: [
      //       {
      //         loader: "image-webpack-loader",
      //         query: {
      //           pngquant: {
      //             quality: "65-90",
      //             speed: 4,
      //             optimizationLevel: 7,
      //             interlaced: true
      //           },
      //           gifsicle: {
      //             optimizationLevel: 7
      //           },
      //           mozjpeg: {
      //             progressive: true,
      //             //optimizationLevel: 3,
      //             quality:80
      //           }
      //         }
      //       }
      //     ]
      //   })
      // }
      // 多语言自动替换
      config.module.rules.push({
        test: /\.vue$/,
        exclude: [/node_modules/],
        loader: 'viai18n-loader',
        enforce: 'pre',
        options: {
          updateMessagesFile: ctx.isClient && ctx.isDev, // 只有在dev环境下编译client才会更新json文件（请将对应的json纳入git版本管理，正式部署不需要重新生成）
          cacheTime: 3000,
          // 用来匹配简体中文字符的 regString
          regString: '[\u4e00-\u9fa5\u3002\uff1b\uff0c\uff1a\u2018\u2019\u201c\u201d\uff08\uff09\u3001\uff1f\uff01\ufe15\u300a\u300b]+',
          // delimiter: '##', // 匹配被分隔符包夹的文案，例如分隔符 '##' 将会匹配 '##text##'
          // Loader 将会优先使用json文件里面已经有的翻译文案, 如果不存在, 则会使用以下translator来自动填充翻译
          languages: [{
            key: 'zh_Hans_CN',
            translator: (matched) => {
              // 有时候一些文案会用不同的翻译，可以在源码中的文案前面添加标记 [R]，之后用translator来自动删除
              return matched.replace(/^\[R\]+/, '')
            }
          }, {
            key: 'zh_Hant_HK',
            translator: (matched) => {
              // 自动将简体翻译成繁体的示例
              return chineseS2T.s2t(matched.replace(/^\[R\]+/, ''))
            }
          }, {
            key: 'en_US',
            // 如果某个语言未指定translator则会使用默认的(即 首个语言所使用的translator, 例如这里的zh_Hans_CN)
          }],
        }
      });
    }
  }
}
