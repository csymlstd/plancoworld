<template>
  <div class="">
    Logging In From Steam
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
    if(params.code) {
      auth.authorizeSteam(params)
    } else {
      router.push('/')
    }

  }

}
</script>
