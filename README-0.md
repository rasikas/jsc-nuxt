# SLIDES

https://docs.google.com/presentation/d/1bOfALHMcVzKaXTfgvwaCM4eCkkxaCjuhEuOTJNK92Ds/edit?usp=sharing

## IGNORE BELOW

Scaffold the frontend

[Nuxt Structure]

[Assets]
- assets (webpacked)
- static

[Configuration File]

On and off we will visit the nuxt.config.js file and learn more about how to use it.


[Plugins]

Define JS plugins to run before instantiating root Vue instance

1. external libraries
 e.g. moment, lodash, etc
2. using Vue Plugins
 e.g. Vuetify, vue-rx, vue-notifications, etc.
3. Injecting to (client) $root and/or (server) Context
 - https://nuxtjs.org/guide/plugins#inject-in-root-amp-context



[Modules]

Nuxt.js extensions which can extend its core functionality

This is a very big topic, instead of learning to build a module from scratch, we will learn to use and install several commonly used modules
- axios
- auth
- i18n 


[Context]

[Pages]

asyncData - SERVER ONCE, CLIENT ON NAVIGATE, set component data
middleware - SERVER ONCE, CLIENT ON NAVIGATE, lets you define custom functions that can be run before rendering either a page or a group of pages.
  export default function (context) {
    context.userAgent = process.server ? context.req.headers['user-agent'] : navigator.userAgent
  }
fetch - SERVER ONCE, CLIENT ON NAVIGATE, set store data
watchQuery - SERVER ONLY, Watch query strings and execute component methods on change

head - header and html attributes
layout - define layout to use
loading - show/hide progress bar between routes
scrollToTop - lets you tell Nuxt.js to scroll to the top before rendering the page.
transition - component to let you create amazing transitions/animations between your pages
validate -  define a validator method inside your dynamic route component, false stops page render and go to error page

More things to add
- Websockets
- Apollo GraphQL
- Charts
- Tables



## SETUP
npx create-nuxt-app jsconf
Use default project name and description
Choose none for server framework
Add axios support, do not add Linter & Prettier, may clash with the settings my code is based on!
Choose vuetify as custom UI framework
Choose none for test
Choose universal for rendering mode
Use default author name
Use npm


## Change Detsuls

nuxt.config.js - insert - override default server params

  server: {
    port: 8080, // default: 3000
    host: '0.0.0.0' // default: localhost
  },


