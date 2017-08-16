// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import Vuex from 'vuex'
import App from './App'
import router from './router'
import auth from './services/auth'

import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';

// Raven.config('https://1980789df2fc4270be59dd9b23d0dde9@sentry.io/197126')
// .addPlugin(RavenVue, Vue)
// .install()

// Vue.use(Vuex)

Vue.config.productionTip = false

function classFromPath(path = '') {
  let c = path.replace(/^(\/)/,'')
  c = c.replace('/','-')
  return c
}

router.beforeEach((to, from, next) => {

  document.querySelector('html').classList.add('page-'+classFromPath(to.path))
  document.querySelector('html').classList.remove('page-'+classFromPath(from.path))

  // http://router.vuejs.org/en/advanced/navigation-guards.html
  if(to.meta.auth === true) {
    if(!auth.user.authenticated) {
      return next('/')
    }
  }

  if(to.name !== 'Home' && auth.checkAuth() && auth.accessTokenExpired()) {
    auth.refreshToken(this).then(() => {
      console.log('Token refreshed')
      return next()
    }).catch((err) => {
      console.log('error refreshing token, login again', err)
      return next('/')
    })
  }

  return next()
})

// const store = new Vuex.Store({
//   state: {
//     count: 0
//   },
//   mutations: {
//     increment (state) {
//       state.count++
//     }
//   }
// })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  //store,
  template: '<App/>',
  components: { App }
})
