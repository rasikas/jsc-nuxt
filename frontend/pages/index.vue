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
