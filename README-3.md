
# Catch All And Error

## 404.vue & nuxt config

1. pages/404.vue - create

```
<template>
  <div>
    <h1>Custom Not Found</h1>
    <p>Route path is {{ $route.path }}</p>
    <p>Route query is {{ $route.query }}</p>
  </div>
</template>

<script>
// for generated, you need http server (S3, GC Storage, etc...) to be able to handle 404 fallback...
export default {
  layout: 'minimal',
  created() { // can do redirection here
  }
}
</script>
```

2. nuxt.config.js - insert

```
  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'custom404',
        path: '*',
        component: resolve(__dirname, 'pages/404.vue')
      })
    }
  },
```


## Using _.vue

3. pages/_.vue - another method for catch all

```
<template>
  <h1>Catch All</h1>
</template>
```


## Nuxt Error Page (Best)

Note: default is always assumed if not specified

https://medium.com/@mavrickmaster/custom-error-pages-with-nuxt-js-3c70e6c51aff

1. layouts/minimal.vue - create new layout

```
<template>
  <v-app dark>
    <v-toolbar fixed app>
      <v-toolbar-title v-text="title" />
      <v-btn color="primary" flat nuxt to="/">Go Home</v-btn>
    </v-toolbar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      title: 'Minimal Layout'
    }
  }
}
</script>
```

2. Create file layouts/error.vue

- For your error page
- best solution

```
<template>
  <div>
    <h1 v-if="error.statusCode === 404">Page not found (using layouts/error.vue)</h1>
    <h1 v-else>An error occurred</h1>
    <p>Route path is {{ $route.path }}</p>
    <p>Route query is {{ $route.query }}</p>
    <nuxt-link to="/">Home page</nuxt-link>
  </div>
</template>

<script>
export default {
  props: ['error'],
  layout: 'default',
  mounted() {
    alert('You can do a redirect also when mounted')
    // this.$router.push('/dynamic/2')
  }
}
</script>
```

3. Make it able to handle in static pages - nuxt.config.js

```
generate: {
  fallback: true // if you want to use '404.html' instead of the default '200.html'
  // fallback: 'my-fallback/file.html' // if your hosting needs a custom location
},
```


npm i -D serve

npx serve -s -l 8080 dist