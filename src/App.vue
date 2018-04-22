<template>
  <div id="app">
    <nav class="navbar" :class="{ 'transparent': isHome }" @click="menuOpen = false">
        <div class="navbar-brand">
          <router-link class="navbar-item logo" to="/">PlanCo World</router-link>
          
          <a class="navbar-link is-hidden-desktop" @click.stop="toggleMenu()"><span class="icon"><i class="far fa-lg" :class="{ 'fa-ellipsis-h': !menuOpen, 'fa-times': menuOpen }"></i></span></a>
        </div>
        
        <div :class="['navbar-menu', { 'is-active': menuOpen }]">
          <div class="navbar-start">
            <router-link :to="{ name: 'Parks' }" class="navbar-item">Parks</router-link>
            <router-link :to="{ name: 'Blueprints' }" class="navbar-item">Blueprints</router-link>
            <router-link :to="{ name: 'Billboards' }" class="navbar-item">Billboards</router-link>
            <router-link :to="{ name: 'Kits' }" class="navbar-item">Kits</router-link>
            <router-link :to="{ name: 'Guides' }" class="navbar-item">Guides</router-link>
            <!-- <router-link :to="{ name: 'Audio' }" class="navbar-item">Audio</router-link> -->
            <div class="navbar-item has-dropdown is-hoverable is-hidden-touch">
              <a class="navbar-link"><span class="icon"><i class="far fa-lg fa-ellipsis-h"></i></span></a>
              <div class="navbar-dropdown is-right">
                <a href="http://steamcommunity.com/app/493340/workshop/" target="_blank" class="navbar-item">Workshop</a>
                <a href="https://reddit.com/r/PlanetCoaster/" target="_blank" class="navbar-item">r/PlanetCoaster</a>
                <a href="http://forums.planetcoaster.com" target="_blank" class="navbar-item">Forums</a>
                <hr class="dropdown-divider" />
                <a href="https://reddit.com/r/PlanCoWorld/" target="_blank" class="navbar-item">r/PlanCoWorld</a>
              </div>
            </div>
          </div>
          <div class="navbar-end">
          <div class="navbar-item" @click.stop>
            <Search @selected="go" :placeholder="placeholder"></Search>
          </div>
          <div class="navbar-item has-dropdown is-hoverable is-hidden-touch" v-if="user.authenticated">
            <a class="navbar-link"><span class="icon"><i class="fas fa-cloud-upload"></i></span></a>
            <div class="navbar-dropdown is-right">
              <router-link :to="{ name: 'ImportPark' }" class="navbar-item" href="/parks">Park</router-link>
              <router-link :to="{ name: 'ImportBlueprint' }" class="navbar-item" href="/blueprints">Blueprint</router-link>
              <router-link :to="{ name: 'ImportBillboard' }" class="navbar-item" href="/billboards">Billboard</router-link>
              <router-link :to="{ name: 'CreateKit' }" class="navbar-item" href="/kits">Kit</router-link>
              <!-- <router-link  class="navbar-item">Audio</router-link> -->
              <!-- <hr class="dropdown-divider" /> -->
              <!-- <router-link :to="{ name: 'Convert' }" class="navbar-item">Converter</router-link>
              <router-link :to="{ name: 'Generator' }" class="navbar-item">Generator</router-link> -->
            </div>
          </div>
          <UserMenu v-if="user.authenticated"></UserMenu>
          <Login :steamOnly="true" v-if="!user.authenticated && !isHome" class="navbar-item"></Login>
        </div>
        </div>
    </nav>
    <vs-notify group="notifications"></vs-notify>
    <Toolbox v-if="user.authenticated" ref="toolbox"></Toolbox>
    <router-view></router-view>
    <vue-progress-bar></vue-progress-bar>

    <Modal @close="closeLogin" :show="loginOpen">
      <div>
        <Login :form="true"></Login>
      </div>
    </Modal>

    <footer class="main">
      <div class="container">
        <p class="description">PlanCo World &copy; 2018. <br /> We are not affiliated with Planet Coaster, Frontier Developments or its licensors. <span class="planco" title="Buldcrefs">Trademarks</span> are the property of their respective owners.</p>
        <!-- <p class="description"><a @click="viewTerms = !viewTerms">Terms of Use</a></p> -->
      </div>
    </footer>
  </div>
</template>

<script>

import router from '@/router'
import auth from '@/services/auth'
import '@/components/ui/Notify'
import Login from '@/components/Login'
import Toolbox from '@/components/Toolbox'
import Modal from '@/components/ui/Modal'
import UserMenu from '@/components/ui/UserMenu'
import Search from '@/components/ui/Search'

import '@/styles/vendors/fa/fontawesome.scss'
import '@/styles/vendors/fa/fa-brands.scss'
import '@/styles/vendors/fa/fa-light.scss'
import '@/styles/vendors/fa/fa-regular.scss'
import '@/styles/vendors/fa/fa-solid.scss'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'

let words = ['coasters','castles','ride skins','parks','scenarios','blueprints','billboards','sci-fi toilets','Chief Beef','fireworks shows','statues','lamps',
      'gift shops', 'buildings', 'starter land', 'western scenes', 'tropical parks', 'spooky rides','ferris wheels','ufos','billboard kits', 'parks you\'ve visited']

auth.checkAuth()

export default {
  computed: {
    user() {
      return this.$store.state.user
    },
    isHome() {
      return this.$route.path === '/'
    },
    loginOpen() {
      return this.$store.state.modals.login
    }
  },
  data() {
    return {
      placeholder: '',
      menuOpen: false,
      viewTerms: false,
    }
  },
  watch: {
    $route () {
      this.searchPlaceholder()
    }
  },
  components: {
    Toolbox,
    UserMenu,
    Modal,
    Search,
    Login
  },
  methods: {
    go(match) {
      let type = match._source.type
      let name = type.charAt(0).toUpperCase() + type.slice(1)
      router.push({ name, params: { slug: match._source.slug }})
    },
    closeLogin(e) {
      this.$store.commit('toggleModal',{ modal: 'login' })
    },
    searchPlaceholder() {
      this.placeholder = 'Search for ' + words[Math.floor(Math.random()*words.length)]
    },
    toggleMenu() {
      this.menuOpen = this.menuOpen ? false : true
    }
  },
  created() {
    this.$Progress.start()
    this.searchPlaceholder()
    this.$store.dispatch('fetchTags')

    // Initial Auth Check
    if(auth.checkAuth() && auth.accessTokenExpired()) {
      auth.refreshToken().then(() => {
        this.$store.dispatch('refreshUser')
      })
    } else if(auth.checkAuth()) {
      this.$store.dispatch('refreshUser')
    }

    // Init Progress Bar
    this.$router.beforeEach((to, from, next) => {
      //  does the page we want to go to have a meta.progress object
      if (to.meta.progress !== undefined) {
        let meta = to.meta.progress
        // parse meta tags
        this.$Progress.parseMeta(meta)
      }
      //  start the progress bar
      this.$Progress.start()
      //  continue to next page
      next()
    })

    //  hook the progress bar to finish after we've finished moving router-view
    this.$router.afterEach((to, from) => {
      //  finish the progress bar
      this.$Progress.finish()
    })

  },
  mounted() {
    this.$Progress.finish()
  }
}
</script>

<!-- BUG: using lang="scss" causes relative file issue with $icons-font-path set in styles/_app.scss -->
<style>
[v-cloak] {
  display: none!important;
}
</style>
