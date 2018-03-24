<template>
  <div id="app">
    <nav class="navbar" :class="{ 'transparent': isHome }">
        <div class="navbar-brand">
          <router-link class="navbar-item logo" to="/">PlanCo World</router-link>
        </div>

        <div class="navbar-menu">
          <div class="navbar-start">
            <router-link :to="{ name: 'Parks' }" class="navbar-item">Parks</router-link>
            <router-link :to="{ name: 'Blueprints' }" class="navbar-item">Blueprints</router-link>
            <router-link :to="{ name: 'Billboards' }" class="navbar-item">Billboards</router-link>
            <router-link :to="{ name: 'Kits' }" class="navbar-item">Kits</router-link>
            <router-link :to="{ name: 'Guides' }" class="navbar-item">Guides</router-link>
            <!-- <router-link :to="{ name: 'Audio' }" class="navbar-item">Audio</router-link> -->
            <div class="navbar-item has-dropdown is-hoverable">
              <a class="navbar-link"><span class="icon"><i class="far fa-lg fa-ellipsis-h"></i></span></a>
              <div class="navbar-dropdown is-right">
                <a href="http://steamcommunity.com/app/493340/workshop/" target="_blank" class="navbar-item">Workshop</a>
                <a href="https://www.reddit.com/r/PlanetCoaster/" target="_blank" class="navbar-item">r/PlanetCoaster</a>
                <hr class="dropdown-divider" />
                <a href="https://www.reddit.com/r/PlanCoWorld/" target="_blank" class="navbar-item">r/PlanCoWorld</a>
              </div>
            </div>
          </div>
          <div class="navbar-end">
          <div class="navbar-item">
            <Search @selected="go" :placeholder="placeholder"></Search>
          </div>
          <div class="navbar-item has-dropdown is-hoverable" v-if="user.authenticated">
            <a class="navbar-link"><span class="icon"><i class="fas fa-plus-circle"></i></span></a>
            <div class="navbar-dropdown is-right">
              <router-link :to="{ name: 'ImportPark' }" class="navbar-item">Park</router-link>
              <router-link :to="{ name: 'ImportBlueprint' }" class="navbar-item">Blueprint</router-link>
              <router-link :to="{ name: 'ImportBillboard' }" class="navbar-item">Billboard</router-link>
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

    <Modal @close="closeLogin" :show="loginOpen">
      <div>
        <h2 class="title has-text-centered has-text-primary">Login to PlanCo World</h2>
        <Login :form="true"></Login>
      </div>
    </Modal>


    <footer class="main">
      <div class="container">
        <p class="description">PlanCo World &copy; 2017. <br /> We are not affiliated with Planet Coaster, Frontier Developments or its licensors. <span class="planco" title="Buldcrefs">Trademarks</span> are the property of their respective owners.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { store } from '@/store.js'

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

let words = ['coaster','castle','ride skin','park','scenario','blueprint','billboard','sci-fi toilet','Chief Beef','fireworks show','statue','custom lamp',
      'gift shop', 'building', 'starter land', 'western scene', 'tropical park', 'spooky ride','ferris wheel','ufo','billboard kit', 'park you visit']

auth.checkAuth()

export default {
  store,
  data() {
    return {
      user: auth.user,
      isHome: false,
      placeholder: ''
    }
  },
  watch: {
    $route () {
      this.searchPlaceholder()
      if(this.$route.path === '/') {
        this.isHome = true
      } else {
        this.isHome = false
      }
    }
  },
  computed: {
    loginOpen() {
      return this.$store.state.modals.login
    },
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
      this.placeholder = 'Search for a ' + words[Math.floor(Math.random()*words.length)]
    }
  },
  created() {
    this.searchPlaceholder()
    this.$store.dispatch('fetchTags')
  },
  mounted () {
    if(this.$route.path === '/') {
      this.isHome = true
    } else {
      this.isHome = false
    }
  }
}
</script>

<!-- BUG: using lang="scss" causes relative file issue with $icons-font-path set in styles/_app.scss -->
<style>
[v-cloak] {
  display: none!important;
}
</style>
