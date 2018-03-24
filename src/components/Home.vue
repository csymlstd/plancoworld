<template>
  <main class="home-page">
    <div class="column home-welcome">
      <div>
        <h1 class="title is-1 has-text-white">PlanCo World</h1>
        <h2 class="subtitle is-5 has-text-white">Collect, organize and share your creations of Planet Coaster.</h2>

        <login v-if="!user.authenticated"></login>
        <div v-show="user.authenticated">
        <router-link :to="{ name: 'Parks' }" class="button is-primary is-medium show" data-cycle>Explore Parks</router-link>
        <router-link :to="{ name: 'Blueprints' }" class="button is-primary is-medium" data-cycle>Explore Blueprints</router-link>
        <router-link :to="{ name: 'Billboards' }" class="button is-primary is-medium" data-cycle>Explore Billboards</router-link>
        <router-link :to="{ name: 'Kits' }" class="button is-primary is-medium" data-cycle>Explore Kits</router-link>
        <router-link :to="{ name: 'Guides' }" class="button is-primary is-medium" data-cycle>Explore Guides</router-link>
        </div>

      </div>
    </div>
  </main>
</template>

<script>
import '@/styles/components/_home.scss'
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

      let tick = () => {
        last = (i == 0 ? l - 1 : i - 1)
        cycle[i].classList.add('show')
        cycle[last].classList.remove('show')
        if(i == (l - 1)) {
           i = 0;
        } else {
          i++
        }
      }

      tick()
      setInterval(() => {
        tick()
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
