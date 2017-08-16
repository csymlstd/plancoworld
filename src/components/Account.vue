<template>
  <div>
    <section class="hero">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            Your Account
          </h1>
        </div>
      </div>
    </section>
    <main class="container">
      <div class="columns">
        <div class="column">
          <aside class="menu">
            <ul class="menu-list">
              <li><router-link :to="{ name: 'MyAccount' }" class="item">Your Account</router-link></li>
              <li><router-link :to="{ name: 'LinkedAccounts' }" class="item">Linked Accounts</router-link></li>
              <li><a class="item">Notifications</a></li>
            </ul>

          </aside>
        </div>
        <div class="column is-three-quarters">
          <router-view></router-view>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import API from '@/services/api'
import auth from '@/services/auth'

import Upload from './ui/Upload'

export default {
  name: 'account',
  components: {
    Upload
  },
  data () {
    return {
      msg: 'Your Account',
      loading: true,
      updating: false,
      user: auth.getUser(),
    }
  },
  methods: {

  },
  mounted() {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
