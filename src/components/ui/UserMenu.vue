<template>
  <div class="navbar-item has-dropdown is-hoverable">
    <div class="navbar-link"><div class="ui avatar"><img :src="user.avatar.url" v-if="user.avatar" /><img src="http://via.placeholder.com/150x150?text=%20" v-else /></div></div>
    <div class="navbar-dropdown is-right">
      <router-link to="/my/account" class="navbar-item">{{ user.name.display }}</router-link>
      <router-link to="/my/account" class="navbar-item">Your Account</router-link>
      <a href="#" @click="logout()" class="navbar-item">Logout</a>
    </div>
  </div>
</template>

<script>
import router from '@/router'
import auth from '@/services/auth'
import { store } from '@/store'

export default {
  store,
  computed: {
    user() {
      return this.$store.state.user.profile
    }
  },
  methods: {
    logout() {
      auth.logout()
    },
    initDropdown() {
      $('.dropdown.account').dropdown({
        action: 'select'
      })
    }
  },
  mounted () {
    this.$store.dispatch('refreshUser')
  }
}
</script>
