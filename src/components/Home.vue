<template>
  <main class="home-page">
    <div class="column home-welcome" :style="{ backgroundImage: `url('https://plancoworld.s3.amazonaws.com/users/b83b97c7-246a-48d4-8879-911e14f6e890.jpg')` }">
      <div>
        <h1 class="title is-1 has-text-white">PlanCo World</h1>
        <h2 class="subtitle is-5 has-text-white">Collect and organize your creations of Planet Coaster.</h2>

        <router-link :to="{ name: 'Parks' }" class="button is-white is-medium show" data-cycle>Explore Other Parks</router-link>
        <router-link :to="{ name: 'Blueprints' }" class="button is-white is-medium" data-cycle>Explore Other Blueprints</router-link>
        <router-link :to="{ name: 'Billboards' }" class="button is-white is-medium" data-cycle>Explore Other Billboards</router-link>
        <router-link :to="{ name: 'Audio' }" class="button is-white is-medium" data-cycle>Explore Other Audio</router-link>

      </div>
    </div>
    <div class="column home-login">
      <login v-if="!user.authenticated"></login>
    </div>
    <div class="tags version has-addons">
      <div class="tag is-primary is-inverted">Alpha</div>
      <div class="tag">0.0.1</div>
    </div>
  </main>
</template>

<script>
import auth from '@/services/auth'
import Login from '@/components/Login'

export default {
  name: 'Home',
  components: {
    Login
  },
  data () {
    return {
      user: auth.user,
      cycle: 3
    }
  },
  mounted() {
    let cycle = this.$el.querySelectorAll('[data-cycle]')
    if(cycle) {
      let i = 0;
      let l = cycle.length
      let last
      setInterval(() => {
        last = (i == 0 ? l - 1 : i - 1)
        cycle[i].classList.add('show')
        cycle[last].classList.remove('show')
        if(i == (l - 1)) {
           i = 0;
        } else {
          i++
        }
      }, 1200 );
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  [data-cycle] {
    display: none!important;
  }

  [data-cycle].show {
    display: inline!important;
  }
</style>
