<template>
  <div class="">
    Logging in to steam
  </div>
</template>

<script>
import auth from '@/services/auth'
import router from '@/router'
import axios from 'axios'

export default {

  data() {
    return {
      error: false
    }
  },
  methods: {

  },
  mounted() {
    let params = this.$route.query
    if(params.access_token && params.refresh_token) {
      auth.verifySteam(params)
    } else {
      router.push('/')
    }

  }

}
</script>
