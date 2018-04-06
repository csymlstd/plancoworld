import router from '@/router'
import jwt from 'jwt-decode'
import moment from 'moment'
import axios from 'axios'

import api from '@/services/api'
import { store } from '@/store'

export default {

  user: {
    authenticated: false,
    profile: {
      name: {},
      avatar: {
        url: '//placehold.it/150x150'
      }
    }
  },

  tokens: {
    access_token: {}
  },

  login(credentials, redirect) {
    return api.post('auth', credentials).then((response) => {
      localStorage.setItem('access_token', response.access_token)
      localStorage.setItem('refresh_token', response.refresh_token)

      document.body.classList.add('logged-in')
      return response.user

      if(redirect) {
        router.push(redirect)
      }

    })
  },

  loginLink(credentials) {
    return api.post('auth/login-link', credentials, false)
  },

  loginLinkVerify(token) {
    return api.post('auth/login-link/verify', {
      token
    }, false).then(response => {
      localStorage.setItem('access_token', response.access_token)
      localStorage.setItem('refresh_token', response.refresh_token)

      document.body.classList.add('logged-in')
      return response.user
    })
  },

  loginWithSteam(redirect) {
    return new Promise((resolve, reject) => {
      let catchToken = window.addEventListener('message', (message) => {
        if(message.data.message === 'Token') {
          let auth = JSON.parse(message.data.auth)
          document.body.classList.add('logged-in')
          localStorage.setItem('access_token', auth.access_token)
          localStorage.setItem('refresh_token', auth.refresh_token)
          window._urq.push(['setFeedbackForumUserName', auth.user.name.display])

          message.source.close()
          resolve(auth.user)
          //window.removeEventListener('message', catchToken, false)
        }
      })

      let dualScreenLeft = (window.screenLeft != undefined) ? window.screenLeft : screen.left;
      let dualScreenTop = (window.screenTop != undefined) ? window.screenTop : screen.top;
      let width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
      let height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

      let left = ((width / 2) - (600 / 2)) + dualScreenLeft;
      let top = ((height / 2) - (755 / 2)) + dualScreenTop;
      let steamWindow = window.open(api.url()+'auth/steam', 'steamAuth', 'height=600,width=755,top='+top+',left='+left+',resizable,scrollbars,chrome=yes,centerscreen')
      if(window.focus) steamWindow.focus()
    })

    // api.post('auth/steam').then((response) => {
    //   let steamUrl = response.redirect;
    //   if(steamUrl) {
    //     steamWindow.location = steamUrl
    //     if(window.focus) steamWindow.focus()
    //     //window.location.href = steamUrl;
    //   }
    // }).catch((err) => {
    //
    // })
  },

  getUser() {
    return store.state.user
  },

  refreshUser() {
    return api.fetch('user').then((user) => {
      return user
    })
  },

  // verifySteam(params) {
  //   localStorage.setItem('access_token', params.access_token)
  //   localStorage.setItem('refresh_token', params.refresh_token)
  //
  //   return api.fetch('user').then((user) => {
  //     this.user.authenticated = true
  //     this.user.profile = user
  //     router.push('/parks')
  //   })
  //
  // },
  //
  // authorizeSteam(params) {
  //   let code = params.code
  //   return api.post('auth/steam/authorize', { code }).then((response) => {
  //     localStorage.setItem('access_token', response.access_token)
  //     localStorage.setItem('refresh_token', response.refresh_token)
  //
  //     this.user.authenticated = true
  //     this.user.profile = response.user
  //
  //     router.push('/parks')
  //   })
  //
  // },

  refreshToken() {
      let refresh_token = localStorage.getItem('refresh_token')
      if(!refresh_token || refresh_token == 'undefined') this.logout()
      let body = {
        refresh_token
      }

      let authHeader = this.getAuthHeader()
      // Uses .http for the Vue global
      return api.post('auth/refresh', body, {
        headers: { 'Authorization': authHeader }
      }).then((response) => {
        localStorage.setItem('access_token', response.access_token)

        this.tokens.access_token = {}
        this.user.authenticated = true
      })
  },

  signup(creds, redirect) {
    api.post('auth/register', creds, false).then((response) => {
      localStorage.setItem('access_token', response.access_token)
      localStorage.setItem('refresh_token', response.refresh_token)

      this.user.authenticated = true

      if(redirect) {
        router.go(redirect)
      }

    }).catch((err) => {

    })
  },

  // @todo delete token on server
  logout() {
    api.post('auth/logout', { token: localStorage.getItem('refresh_token') })
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    document.body.classList.remove('logged-in')
    store.commit('setProfile', {
      _id: false,
      name: {},
      avatar: {
        url: '//placehold.it/150x150'
      }
    })
    store.commit('setAuthState', false)
  },

  isLoggedIn() {
    return this.checkAuth()
  },

  checkAuth() {
    let token = localStorage.getItem('access_token')
    if(token) {
      document.body.classList.add('logged-in')
    } else {
      document.body.classList.remove('logged-in')
    }

    return token ? true : false
  },

  // getScope() {
  //   let scope = this.user.scope
  //   if(scope.length == 0) {
  //     let token = this.decodedAccessToken()
  //     if(!token) return false
  //     scope = token.scope
  //   }
  //   return scope
  // },

  accessTokenExpired() {
    let token = this.decodedAccessToken()
    if(token === false) return true
    let expired = moment.unix(token.exp).isBefore()
    return expired
  },

  decodedAccessToken() {
    let token = localStorage.getItem('access_token')
    if(!token) {
      return false
    } else {
      return jwt(token)
    }
  },

  getAuthHeader() {
    return 'Bearer ' + localStorage.getItem('access_token')
  },

  isOwner(model) {
    return (store.state.user.authenticated && typeof model.user !== 'undefined' && typeof store.state.user.profile !== 'undefined') ? (model.user._id == store.state.user.profile._id) : false
  }
}
