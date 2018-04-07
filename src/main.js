// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import { store } from './store'
import auth from './services/auth'

Vue.use(Vuex)

import Meta from 'vue-meta'
Vue.use(Meta)

import VTooltip from 'v-tooltip'
Vue.use(VTooltip)

import Clipboard from 'v-clipboard'
Vue.use(Clipboard)

import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)

import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

import VueAnalytics from 'vue-analytics'
Vue.use(VueAnalytics, {
  id: 'UA-102743872-1',
  router
})

// import Raven from 'raven-js';
// import RavenVue from 'raven-js/plugins/vue';
// Raven.config('https://1980789df2fc4270be59dd9b23d0dde9@sentry.io/197126')
// .addPlugin(RavenVue, Vue)
// .install()


Vue.config.productionTip = false

function classFromPath(path = '') {
  if(!path) return false
  let c = path.replace(/^(\/)/,'')
  c = c.replace('/','-')
  return c.toLowerCase()
}

router.beforeEach((to, from, next) => {

  let slug = classFromPath(to.name) || classFromPath(to.path)
  document.body.className = ''
  document.body.classList.add('page-'+slug)

  // http://router.vuejs.org/en/advanced/navigation-guards.html
  if(to.meta.auth === true) {
    if(!store.state.user.authenticated) {
      return next('/')
    }
  }

  if(to.name !== 'Home' && auth.checkAuth() && auth.accessTokenExpired()) {
    auth.refreshToken().then(() => {
      console.log('Token refreshed')
      return next()
    }).catch((err) => {
      console.log('error refreshing token, login again', err)
      return next('/')
    })
  }

  return next()
})

Vue.filter('truncate', function (text, length, clamp) {
  clamp = clamp || '...';
  length = length || 30;

  if (text.length <= length) return text;

  var tcText = text.slice(0, length - clamp.length);
  var last = tcText.length - 1;


  while (last > 0 && tcText[last] !== ' ' && tcText[last] !== clamp[0]) last -= 1;

  // Fix for case when text dont have any `space`
  last = last || length - clamp.length;

  tcText =  tcText.slice(0, last);

  return tcText + clamp;
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  metaInfo: {
    title: 'Explore and organize your creations from Planet Coaster',
    titleTemplate: '%s • PlanCo World',
  },
  template: '<App/>',
  components: { App },
})
