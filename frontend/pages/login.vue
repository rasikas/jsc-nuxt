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
