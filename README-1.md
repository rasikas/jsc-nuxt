## Install Auth Module

1. npm install @nuxtjs/auth

we already installed @nuxtjs/axios so no need to do it


2. nuxt.config.js - insert - add auth module
  modules: [
    ...
    '@nuxtjs/auth'
  ]

3. nuxt.config.js - insert - auth module settings (working for me) - token based flow
  modules: [
    ...
    '@nuxtjs/auth'
  ]

  auth: {
    // redirect: {
    //   // login: '/login', // page to redirect to on auth failure, default is /login
    //   // logout: '/', // page to redirect to on auth failure, default is /
    //   home: false
    // },
    strategies: {
      local: {
        endpoints: {
          logout: { url: '/api/auth/logout', method: 'get' },
          // user: false // { url: 'http://127.0.0.1:3000/api/auth/user', method: 'get', propertyName: false }
          login: { url: '/api/auth/login', method: 'post', propertyName: 'token' }, // not used...
          user: { url: '/api/auth/me', method: 'get', propertyName: 'user' } // not user...
        },
        tokenRequired: true,
        tokenType: 'Bearer'
      }
    }
  },


4. layouts/default.vue - replace content

```
<template>
  <v-app dark>
    <!-- Left Menu -->
    <v-navigation-drawer :mini-variant="miniVariant" :clipped="clipped" v-model="drawer" fixed app>
      <v-list>
        <template v-for="(item, i) in items">
          <v-list-tile :to="item.to" :key="i" v-if="!item.auth || $auth.$state.loggedIn" router exact>
            <v-list-tile-action>
              <v-icon v-html="item.icon" />
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-text="item.title" />
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <!-- Toolbar -->
    <v-toolbar :clipped-left="clipped" fixed app>
      <v-toolbar-side-icon @click="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
      <template v-if="$auth.$state.loggedIn">
        <v-btn @click.stop="$auth.logout()">Logout [{{ $auth.user }}]</v-btn>
      </template>
      <template v-else>
        <v-btn color="primary" flat nuxt to="/login">Login</v-btn>
      </template>
    </v-toolbar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer :fixed="fixed" app>
      <span>&copy; None</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        { icon: 'apps', title: 'Home', to: '/' },
        { icon: 'bubble_chart', title: 'Dynamic Routes', to: '/dynamic/a' },
        { icon: 'bubble_chart', title: 'Public', to: '/public' },
        { icon: 'bubble_chart', title: 'Secure', to: '/secure' },
        { icon: 'bubble_chart', title: 'Authors', to: '/authors', auth: true },
        { icon: 'bubble_chart', title: 'Categories', to: '/categories', auth: true },
        { icon: 'bubble_chart', title: 'Books', to: '/books', auth: true },
        { icon: 'bubble_chart', title: 'Not Found', to: '/notfound' }
      ],
      miniVariant: false,
      title: 'Vuetify.js'
    }
  }
}
</script>

```

5. pages/index.vue - replace content

Show if user is logged in or not

```
<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <div class="text-xs-center">{{ title }}</div>
      <v-card>
        <v-card-title class="headline">Welcome to the Vuetify + Nuxt.js template</v-card-title>
        <v-card-text>
          <p>User status: {{ $auth.$state.loggedIn ? 'Logged In' : 'Guest' }}</p>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data: () => ({
    title: 'Title Before Async Data'
  }),
  asyncData({ params, env }) {
    console.log('asyncData', params, process.server, env)
    return { title: 'Title After Async Data' }
  }
  // async fetch ({ store, params }) {
  //   await store.dispatch('GET_STARS');
  // }
}
</script>
```

6. pages/public.uve - create

Public site, we will test some VueJS quirks

```
<template>
  <div>
    <v-alert :value="true" type="success">You should see this page without need to authenticate!</v-alert>
    Test: [{{ countVal }}]
    <v-btn @click="test">TEST</v-btn>
  </div>
</template>

<script>
import _cloneDeep from 'lodash.clonedeep'

const XrudStore = {
  namespaced: true,
  state: {
    count: { counter: 0 }
  },
  getters: { getCount: state => state.count },
  actions: { increment: ({ commit }) => commit('increment') },
  mutations: {
    increment(state) { state.count.counter++ },
    setCounter(state, payload) { state.count = payload }
  }
}

export default {
  middleware: ['auth'],
  options: { auth: false },
  data: () => ({
    countVal: 'NA'
  }),
  computed: {
    computedCount() {
      return this.$store.getters['blah/getCount']
    }
  },
  created() {
    if (process.client) {
      console.log('public.vue created() client')
      // register a new module only if doesn't exist
      if (!(this.$store && this.$store.state && this.$store.state[name])) {
        console.log('Dynamic Vuex module created...')
        this.$store.registerModule('blah', _cloneDeep(XrudStore)) // { preserveState: true } has no effect
        // TEST START - Uncomment code so that no error occurs
        this.$store.state['blah'] = {} // required for nuxt
        this.$store.commit(`blah/setCounter`, { counter: 0 }) // required for nuxt generated...
        // TEST EMD
        console.log('Vuex store state', this.$store.state)
      }
      // window.addEventListener('click', e => alert('clicked')) // Cannot Generate! Direct Call Will Fail
    } else {
      console.log('public.vue created() server')
      const generateError = false
      if (generateError) {
        window.addEventListener('click', () => alert('clicked')) // Cannot Generate! Direct Call Will Fail
      }
    }
  },
  mounted() {
    if (process.client) console.log('public.vue mounted() client')
    else console.log('public.vue mounted() server - NEVER!')
  },
  methods: {
    test() {
      this.$store.dispatch('blah/increment')
      const counter = this.computedCount.counter
      this.countVal = counter ? counter : 'No Count Yet'
    }
  }
}
</script>
```

7. pages/login.vue - create

We did not use loginWith because current implementation could not handle 2FA / OTP

```
<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-card-text>
            <v-container>
              <form @keydown.enter="login">
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field label="Email" v-model="email" type="text" required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field label="Password" v-model="password" type="password" required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12 class="text-xs-center">
                    <v-btn @click="login" :disabled="loading" :loading="loading">
                      Sign In
                      <span slot="loader" class="custom-loader">
                        <v-icon light>cached</v-icon>
                      </span>
                    </v-btn>
                  </v-flex>
                </v-layout>
                <v-alert v-if="!!error" :value="!!error" type="error">{{ error }}</v-alert>
                <v-alert show v-if="$auth.$state.redirect">
                  You have to login before accessing to
                  <strong>{{ $auth.$state.redirect }}</strong>
                </v-alert>
              </form>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<style scoped>
.login-button {
  border: 0;
}
</style>

<script>
// import busyOverlay from '@/components/BusyOverlay'
export default {
  middleware: ['auth'],
  // components: { busyOverlay },
  data() {
    return {
      loading: false,
      email: '',
      username: '',
      password: '',
      error: null
    }
  },
  created() {},
  methods: {
    async login() {
      this.error = null
      try {
        const { data } = await this.$axios.post('/api/auth/login', {
          email: this.email,
          password: this.password
        })
        this.$auth.setToken('local', `Bearer ${data.token}`)
        this.$auth.strategy._setToken(`Bearer ${data.token}`) // this.$axios.defaults.headers.common['Authorization']
        const rv = await this.$axios.get('/api/auth/me')
        this.$auth.setUser(rv.data)
        this.$router.push('/secure')
      } catch (e) {
        this.error = e + ''
      }
    }
  }
}
</script>
```

8. pages/secure.vue - create

Secure site allowable only if logged in

```
<template>
  <div>
    <v-alert show variant="warning">This is a secure page!</v-alert>
    <h1>State</h1>
    <pre>{{ state }}</pre>
    <h1>Scopes</h1>
    <p>
      User: {{ $auth.hasScope('user') }}<br />
      Test: {{ $auth.hasScope('test') }}<br />
      Admin: {{ $auth.hasScope('admin') }}
    </p>
    <h1>Token</h1>
    <pre>{{ $auth.token || '-' }}</pre>
    <hr />
    <v-btn @click="$auth.fetchUser()">Fetch User</v-btn>
    <v-btn @click="$auth.logout()">Logout</v-btn>
  </div>
</template>

<script>
export default {
  middleware: ['auth'],
  computed: {
    state() {
      return JSON.stringify(this.$auth.$state, undefined, 2)
    }
  }
}
</script>

```



9. nuxt.config.js - insert

```
axios: {
  baseURL: 'http://localhost:3000'
}
```

10. plugins/axios.js - create

```
export default function({ $axios, app, redirect }) {
  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status)
    if (code === 401) {
      // unauthorized - sign out user & redirect done by auth module, default to /login route
      app.$auth.setUser(false)
      // Do not redirect below as auth module knows what to do after you set user as false
      // redirect('/login')
    }
  })
}
```
