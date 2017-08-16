<template>
  <div class="field">
    <div class="field">
      <button class="button is-fullwidth is-dark is-medium" @click="loginWithSteam()">Log in through Steam</button>
    </div>
    <p class="field text-center">or</p>
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
        <button class="button is-primary is-fullwidth" type="submit">Login</button>
        <a class="button is-link">Send One-Time Login Link</a>
      </div>
    </form>
  </div>
</template>

<script>
import auth from '@/services/auth'

export default {

  data() {
    return {
      credentials: {
        email: '',
        password: ''
      },
      error: false
    }
  },

  methods: {

    login(e) {
      e.preventDefault()
      let credentials = {
        email: this.credentials.email,
        password: this.credentials.password
      }

      auth.login(credentials, 'parks').then(() => {

      }).catch((err) => {
        if(err) this.error = err
      })
    },

    loginWithSteam() {
      auth.loginWithSteam()
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
