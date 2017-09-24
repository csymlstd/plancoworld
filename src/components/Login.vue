<template>
  <div class="field">
    <div class="field">
      <button class="button is-dark is-medium" :class="{ 'is-loading': loading.steam }" @click="loginWithSteam()"><span class="icon"><i class="fab fa-steam"></i></span> <span>Login with Steam</span></button>
    </div>
    <div class="field" v-if="!steamOnly">
      <a class="has-text-white">Login with Email</a>
    </div>
    <!-- <p class="field text-center">or</p>
    <form @submit="login">
      <div class="ui message error visible" v-if="error">
        {{ error.error }}
      </div>
      <div class="field">
        <div class="control"><input type="email" class="input is-medium" placeholder="Email Address" v-model="credentials.email"></div>
      </div>
      <div class="field">
        <div class="control"><input type="password" class="input is-medium" placeholder="Password" v-model="credentials.password"></div>
      </div>
      <div class="text-center">
        <button class="button is-primary is-fullwidth" type="submit" :class="{ 'is-loading': loading.login }">Login</button>
        <a class="button is-link">Send One-Time Login Link</a>
      </div>
    </form> -->
  </div>
</template>

<script>
import auth from '@/services/auth'

export default {
  props: {
    steamOnly: false
  },
  data() {
    return {
      credentials: {
        email: '',
        password: ''
      },
      error: false,
      loading: {
        login: false,
        steam: false
      }
    }
  },

  methods: {

    login(e) {
      e.preventDefault()
      this.loading.login = true
      let credentials = {
        email: this.credentials.email,
        password: this.credentials.password
      }

      auth.login(credentials, 'parks').then(() => {
        this.loading.steam = false
        this.$store.commit('toggleModal', { modal: 'login', state: false })
      }).catch((err) => {
        this.loading.steam = false
        if(err) this.error = err
      })
    },

    loginWithSteam() {
      this.loading.steam = true
      auth.loginWithSteam().then(() => {
        this.loading.steam = false
        this.$store.commit('toggleModal', { modal: 'login', state: false })
        this.$notify('notifications','Welcome back to PlanCo World!')
      }).catch(() => {
        this.loading.steam = false
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.description {
  font-size: 1rem;
  color: color('grey');
  margin-top: 0.25em;
  text-align: center;
}
</style>
