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
            <router-link :to="{ name: 'Audio' }" class="navbar-item">Audio</router-link>
          </div>
          <div class="navbar-end">
          <div class="navbar-item">
            <Search @selected="go"></Search>
          </div>
          <div class="navbar-item has-dropdown is-hoverable" v-if="user.authenticated">
            <a class="navbar-link"><span class="icon"><i class="fas fa-cloud-upload"></i></span></a>
            <div class="navbar-dropdown is-right">
              <router-link :to="{ name: 'ImportPark' }" class="navbar-item">Park</router-link>
              <router-link :to="{ name: 'ImportBlueprint' }" class="navbar-item">Blueprint</router-link>
              <router-link :to="{ name: 'ImportBillboard' }" class="navbar-item">Billboard</router-link>
              <router-link :to="{ name: 'ImportAudio' }" class="navbar-item">Audio</router-link>
              <hr class="dropdown-divider" />
              <router-link :to="{ name: 'Convert' }" class="navbar-item">Convert</router-link>
            </div>
          </div>
          <UserMenu v-if="user.authenticated"></UserMenu>
          <router-link class="navbar-item" v-if="!user.authenticated && !isHome" to="/">Login</router-link>
        </div>
        </div>
    </nav>
    <vs-notify group="notifications"></vs-notify>
    <Toolbox v-if="user.authenticated" ref="toolbox"></Toolbox>
    <router-view></router-view>

    <footer class="main">
      <div class="container">
        <p class="description">PlanCo World &copy; 2017. <br /> We are not affiliated with Planet Coaster, Frontier Developments or its licensors. <span class="planco" title="Buldcrefs">Trademarks</span> are the property of their respective owners.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import router from '@/router'
import auth from '@/services/auth'
import '@/components/ui/Notify'
import Toolbox from '@/components/Toolbox'
import UserMenu from '@/components/ui/UserMenu'
import Search from '@/components/ui/Search'

import '@/styles/vendors/_font-awesome-core.scss';
import '@/styles/vendors/_font-awesome-brands.scss';
// import '@/styles/vendors/_font-awesome-light.scss';
import '@/styles/vendors/_font-awesome-regular.scss';
import '@/styles/vendors/_font-awesome-solid.scss';

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'

auth.checkAuth()

export default {
  data() {
    return {
      user: auth.user,
      isHome: false
    }
  },
  watch: {
    $route () {
      console.log(this.$route.path)
      if(this.$route.path === '/') {
        this.isHome = true
      } else {
        this.isHome = false
      }
    }
  },
  components: {
    Toolbox,
    UserMenu,
    Search
  },
  methods: {
    go(match) {
      let type = match._type
      let name = type.charAt(0).toUpperCase() + type.slice(1)
      router.push({ name, params: { slug: match._source.slug }})
    }
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
