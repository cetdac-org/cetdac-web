process.SERVER_BUILD = true

const Koa = require('koa')
const compress = require("koa-compress")
const mount = require("koa-mount")
const serve = require("koa-static")
const consola = require('consola')
const staticCache = require("./plugins/staticCache")
const { Nuxt, Builder } = require('nuxt')

const app = new Koa()

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(app.env === 'production')

async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    //gzip
    app.use(compress({
      filter: function (content_type) {
          return /js|css|jpe?g|png|gif|apk|svg/i.test(content_type)
      },
      threshold: 2048,
      flush: require("zlib").Z_SYNC_FLUSH
    }))

    //cdn回源
    app.use(mount("/static",serve("./.nuxt/dist",{maxage:24 * 60 * 60 * 7 * 1000, gzip:true})))

    app.use(staticCache(path.join(__dirname, "static"), {
        maxAge: 24 * 60 * 60 * 7,
        filter:["js","css","jpg","png","apk","svg"]
    }))
    await nuxt.ready()
  }

  app.use(ctx => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
