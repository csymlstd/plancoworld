<template>
  <div>
    <section class="hero">
      <div class="container">
        <h1 class="title">
          Admin
        </h1>
      </div>
    </section>
    <main class="container">
      <div class="columns">
        <div class="column">
          <aside class="menu">
            <ul class="menu-list">
              <li><router-link :to="{ name: 'Permissions' }" class="item">Permissions</router-link></li>
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

export default {
  name: 'Admin',
  components: {

  },
  data () {
    return {
      loading: true,
      updating: false,
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
