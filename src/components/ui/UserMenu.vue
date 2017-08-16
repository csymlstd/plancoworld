<template>
  <div class="navbar-item has-dropdown is-hoverable">
    <div class="navbar-link"><div class="ui avatar image"><img :src="user.avatar ? user.avatar.url : 'http://placehold.it/100x100'" style="width: auto;" /></div></div>
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

export default {
  data() {
    return {
      user: auth.getUser()
    }
  },
  methods: {
    logout() {
      auth.logout()
      router.push('/')
    },
    initDropdown() {
      $('.dropdown.account').dropdown({
        action: 'select'
      })
    }
  },
  mounted () {
    auth.refreshUser().then(() => {
      this.user = auth.getUser()
    })
  }
}
</script>
