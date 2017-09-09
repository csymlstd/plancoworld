<template>
  <div class="box">
    <button class="button is-medium is-dark" v-if="!isConnected()" @click="loginWithSteam()"><span class="icon"><i class="fab fa-steam"></i></span> <span>Link Account with Steam</span></button>
    <button class="button is-medium is-dark" v-if="isConnected()" @click="loginWithSteam()"><span class="icon"><i class="fab fa-steam"></i></span> <span>Disconnect from Steam</span></button>

  </div>
</template>

<script>
import API from '@/services/api'
import auth from '@/services/auth'

export default {
  name: 'account',
  components: {

  },
  data () {
    return {
      msg: 'Your Account',
      loading: true,
      updating: false,
      uploadAvatar: false,
      user: auth.user.profile,
    }
  },
  methods: {
    isConnected() {
      return auth.user.profile.oauth.steam.id ? true : false
    },
    getUser (params = {}) {
      return API.fetch('user', params).then((data) => {
        Object.assign(this.user, data)
        auth.user.profile = data
        return data
      }).catch((err) => {
        console.log(err)
      })
    },
    loginWithSteam() {
      auth.loginWithSteam()
    }
  },
  mounted() {
    this.getUser().then(() => {
      this.loading = false
    }).catch((err) => {

    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
