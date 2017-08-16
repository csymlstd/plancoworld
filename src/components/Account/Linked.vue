<template>
  <div class="ui form">
    <button class="ui icon button secondary" @click="loginWithSteam()"><i class="steam icon"></i> Link Account with Steam</button>

    <div class="ui message visible">
      You can request a <a href="#">one-time login link</a> sent to your email address at any time. This will let you log back in to PlanCo World if you forget your password or lose access to your Steam account.
    </div>

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
