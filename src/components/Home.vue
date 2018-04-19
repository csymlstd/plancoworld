<template>
  <main class="home-page">
    <div class="column home-welcome">
      <div>
        <h1 class="title is-1 has-text-white">PlanCo World</h1>
        <h2 class="subtitle is-5 has-text-white">Collect, organize and share your creations of Planet Coaster.</h2>

        <login v-if="!user.authenticated"></login>
        <!-- <div v-show="user.authenticated">
        <router-link :to="{ name: 'Parks' }" class="button is-primary is-medium show" data-cycle>Explore Parks</router-link>
        <router-link :to="{ name: 'Blueprints' }" class="button is-primary is-medium" data-cycle>Explore Blueprints</router-link>
        <router-link :to="{ name: 'Billboards' }" class="button is-primary is-medium" data-cycle>Explore Billboards</router-link>
        <router-link :to="{ name: 'Kits' }" class="button is-primary is-medium" data-cycle>Explore Kits</router-link>
        <router-link :to="{ name: 'Guides' }" class="button is-primary is-medium" data-cycle>Explore Guides</router-link>
        </div> -->

        <!-- <div class="box home-promos">
          <div>
            <strong class="has-text-grey">New Planet Coaster DLC &amp; v1.6!</strong>
            <br />
            <router-link :to="{ name: 'GuidePage', params: { slug: 'studios-pack-v1-6' } }">See what's new in the<br /> Studios Pack and 1.6 update</router-link>
          </div>
          <div>
            <strong class="has-text-grey">Welcome to PlanCo World v1!</strong>
            <br />
            <a href="https://www.reddit.com/r/PlanetCoaster/comments/8a08wz/heyo_planco_world_is_open_for_business_a_place/" target="_blank">Read our debut on Reddit<br /> to learn what you can do</a>
          </div>
        </div> -->

        <div class="notification is-purp text-center push-up-double">
          <i class="fas fa-2x field fa-exclamation-triangle"></i>
          <p><strong>Introducing our first billboard contest &mdash; Safety First!</strong></p>
          <p class="field">Submit your signs and videos that keep your guests safe <br /> for a chance to win a Planet Coaster DLC of your choice <br /></p>
          <router-link :to="{ name: 'Billboards' }" class="button is-primary is-inverted">Learn More and Vote!</router-link>
        </div>

      </div>
    </div>
    <div class="home-gallery">
      <div class="carousel-cell" style="background: url('/assets/images/home-studios-1.jpg');" ></div>
      <div class="carousel-cell" style="background: url('/assets/images/home-adventure-1.jpg');" ></div>
      <div class="carousel-cell" style="background: url('/assets/images/home-spooky-3.jpg');" ></div>
      <div class="carousel-cell" style="background: url('/assets/images/home-adventure-2.jpg');" ></div>
      <div class="carousel-cell" style="background: url('/assets/images/home-spooky-2.jpg');" ></div>
    </div>
  </main>
</template>

<script>
import '@/styles/components/_home.scss'
import auth from '@/services/auth'
import Login from '@/components/Login'
import {store} from '@/store'
import Flickity from 'flickity'

export default {
  name: 'Home',
  store,
  components: {
    Login
  },
  data () {
    return {
      user: this.$store.state.user,
      cycle: 3,
      gallery: false,
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

    this.gallery = new Flickity('.home-gallery', {
      pageDots: false,
      prevNextButtons: false,
      pauseAutoPlayOnHover: false,
      autoPlay: 6000,
    })

    // Reset animation
    this.gallery.on('select', index => {
      this.gallery.cells[index].element.style.animation = 'none'
      setTimeout(() => { this.gallery.cells[index].element.style.animation = '' }, 10)
    })

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
