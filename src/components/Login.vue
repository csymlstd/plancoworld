<template>
  <div>
    <div class="field" v-if="!form">
      <button class="button is-dark is-medium" :class="{ 'is-loading': loading.steam }" @click="loginWithSteam()"><span class="icon"><i class="fab fa-steam"></i></span> <span>Login with Steam</span></button>
    </div>
    <div class="field" v-if="!form && !steamOnly">
      <a @click="loginWithEmail()" class="has-text-white">Login with Email</a>
    </div>
    <div class="field" v-if="form">
      <form class="field" @submit="login">
        <div class="ui message error visible" v-if="error">
          {{ error.error }}
        </div>
        <div class="field">
          <div class="control"><input type="email" class="input is-medium" placeholder="Email Address" v-model="credentials.email"></div>
        </div>
        <div class="level">
          <button class="button is-primary is-medium" type="submit" :class="{ 'is-loading': loading.login }">Send One-Time Login Link</button>
          or
          <button class="button is-dark is-medium" :class="{ 'is-loading': loading.steam }" @click="loginWithSteam()"><span class="icon"><i class="fab fa-steam"></i></span> <span>Login with Steam</span></button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import auth from '@/services/auth'


export default {
  props: {
    steamOnly: false,
    form: false,
  },
  data() {
    return {
      credentials: {
        email: '',
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
      }

      auth.loginLink(credentials).then(user => {
        this.loading.login = false
        this.$store.commit('setProfile', user)
        this.$store.commit('setAuthState', true)
        this.$store.commit('toggleModal', { modal: 'login', state: false })
      }).catch((err) => {
        console.log(err)
        this.loading.login = false
        this.error = err
      })
    },
    loginWithEmail() {
      this.$store.commit('toggleModal', { modal: 'login', state: true })
    },
    loginWithSteam() {
      this.loading.steam = true

      setTimeout(() => {
        this.loading.steam = false
      }, 3000)

      auth.loginWithSteam().then(user => {
        this.loading.steam = false
        this.$store.commit('setProfile', user)
        this.$store.commit('setAuthState', true)
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
