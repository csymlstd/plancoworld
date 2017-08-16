<template>
  <div id="app">
    <nav class="navbar">
        <div class="navbar-brand">
          <router-link class="navbar-item logo" to="/">PlanCo World</router-link>
          <router-link class="navbar-item" to="/parks">Parks</router-link>
          <router-link class="navbar-item" to="/blueprints">Blueprints</router-link>
          <router-link class="navbar-item" to="/billboards">Billboards</router-link>
          <router-link class="navbar-item" to="/audio">Audio</router-link>
        </div>

        <div class="navbar-end">
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link"><span class="icon"><i class="fas fa-cloud-upload"></i></span></a>
            <div class="navbar-dropdown is-right">
              <router-link :to="{ name: 'Import', params: { model: 'Park' } }" class="navbar-item">Park</router-link>
              <router-link :to="{ name: 'Import', params: { model: 'Blueprint' } }" class="navbar-item">Blueprint</router-link>
              <router-link :to="{ name: 'ImportBillboard' }" class="navbar-item">Billboard</router-link>
              <a class="navbar-item">Audio</a>
            </div>
          </div>
          <UserMenu v-if="user.authenticated"></UserMenu>
          <router-link class="navbar-item" v-if="!user.authenticated" to="/">Login</router-link>
        </div>
    </nav>
    <vs-notify group="notifications"></vs-notify>
    <Toolbox v-if="user.authenticated" ref="toolbox"></Toolbox>
    <router-view></router-view>

    <footer class="main">
      <div class="container">
        <p class="description">PlanCo World &copy; 2017. <br /> We are not affiliated with Frontier Developments. <span class="planco" title="Trademarks">Buldcrefs</span> mentioned on this <span class="planco" title="website">murlstess</span> are the property of their respective <span class="planco" title="owners">pohdes</span>.</p>
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

import '@/styles/vendors/_font-awesome-core.scss';
import '@/styles/vendors/_font-awesome-brands.scss';
// import '@/styles/vendors/_font-awesome-light.scss';
import '@/styles/vendors/_font-awesome-regular.scss';
import '@/styles/vendors/_font-awesome-solid.scss';

auth.checkAuth()

export default {
  data() {
    return {
      user: auth.user
    }
  },
  components: {
    Toolbox,
    UserMenu
  },
  methods: {

  },
  mounted () {

  }
}
</script>

<!-- BUG: using lang="scss" causes relative file issue with $icons-font-path set in styles/_app.scss -->
<style>
[v-cloak] {
  display: none!important;
}

.vs-notify{ position:fixed; width:300px; z-index:9999; }
.vs-notify .ntf { font-size:14px; padding:10px; margin:0 5px 5px; color:#fff; background:#44A4FC; border-left:5px solid #187FE7; box-sizing:border-box; text-align:left; cursor:pointer; }
.vs-notify .warn   { background:#ffb648; border-left-color:#f48a06; }
.vs-notify .error  { background:#E54D42; border-left-color:#B82E24; }
.vs-notify .success { background:#68CD86; border-left-color:#42A85F; }

.ntf-left-enter-active, .ntf-left-leave-active, .ntf-right-enter-active, .ntf-right-leave-active, .ntf-top-enter-active, .ntf-top-leave-active,
.ntf-bottom-enter-active, .ntf-bottom-leave-active{ transition: all 0.3s; }
.ntf-left-enter,  .ntf-left-leave-to { opacity:0; transform:translateX(-300px); }
.ntf-right-enter, .ntf-right-leave-to{ opacity:0; transform:translateX(300px); }
.ntf-fade-enter-active, .ntf-fade-leave-active{ transition: opacity 0.5s; }
.ntf-fade-enter, .ntf-fade-leave-to{ opacity: 0; }
.ntf-top-enter,  .ntf-top-leave-to{ opacity:0; transform: translateY(-120px); }
.ntf-bottom-enter, .ntf-bottom-leave-to{ opacity:0; transform: translateY(120px); }
</style>
