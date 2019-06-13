import pkg from './package'

export default {
  server: {
    port: 8080, // default: 3000
    host: '0.0.0.0' // default: localhost
  },
  mode: 'universal',
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' }
    ]
  },

  generate: {
    fallback: true // if you want to use '404.html' instead of the default '200.html', uses layouts/error.vue
    // fallback: 'my-fallback/file.html' // if your hosting needs a custom location
  },

  // router: {
  //   extendRoutes(routes, resolve) {
  //     routes.push({
  //       name: 'custom404',
  //       path: '*',
  //       component: resolve(__dirname, 'pages/404.vue')
  //     })
  //   }
  // },

  // generate: {
  //   https://github.com/nuxt/nuxt.js/issues/1018
  //   routes: function () {
  //     let posts = axios.get('https://api.com/posts', {params: {size: 10}}).then((res) => { // get about 10 records from API to populate page
  //       return res.data.posts.map((post) => {
  //         return '/feed/' + post.id
  //       })
  //     })
  //     let users = axios.get('https://api.com/users', {params: {size: 10}}).then((res) => { // get about 10 records from API to populate page
  //       return res.data.content.map((user) => {
  //         return '/user/' + user.id
  //       })
  //     })
  //     return Promise.all([posts, users]).then(values => {
  //       return values.join().split(',');
  //     })
  //   }
  // },

  // Customize the progress-bar color
  loading: { color: '#fff' },

  // Global CSS
  css: ['~/assets/style/app.styl'],

  // Plugins to load before mounting the App
  plugins: ['@/plugins/vuetify', '@/plugins/axios'],

  // Nuxt.js modules
  modules: [
    '@nuxtjs/axios', // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/auth' //,
  ],
  // Axios module configuration
  axios: {
    baseURL: 'http://localhost:3000'
    // See https://github.com/nuxt-community/axios-module#options
    // cannot use proxy for nuxt generated
    // proxy: true
  },
  // proxy: {
  //   '/api/': 'http://localhost:3000'
  // },

  auth: {
    // redirect: {
    //   // login: '/login', // page to redirect to on auth failure, default is /login
    //   // logout: '/', // page to redirect to on auth failure, default is /
    //   home: false
    // },
    strategies: {
      local: {
        endpoints: {
          login: { url: '/api/auth/login', method: 'post', propertyName: 'token' }, // not used...
          logout: { url: '/api/auth/logout', method: 'get' },
          // user: false // { url: 'http://127.0.0.1:3000/api/auth/user', method: 'get', propertyName: false }
          user: { url: '/api/auth/me', method: 'get', propertyName: 'user' } // or should we get rid of this?
        },
        tokenRequired: true,
        tokenType: 'Bearer'
      }
    }
  },

  // Build configuration
  build: {
    // You can extend webpack config here
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
