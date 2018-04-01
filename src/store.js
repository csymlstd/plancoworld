import Vue from 'vue'
import Vuex from 'vuex'
import API from '@/services/api'
import Auth from '@/services/auth'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    tags: [],
    measurements: 'imperial', // or 'metric'
    toolbox: {
      open: false,
      selectMode: false,
      restricted: [],
      active: 'parks',
      context: 'user',
      pagination: {
        current: 1,
        pages: 1,
        total: 0,
        limit: 25
      },
    },
    user: {
      authenticated: false,
      profile: {
        _id: false,
        name: {},
        avatar: {
          url: 'http://placehold.it/150x150'
        }
      }
    },
    modals: {
      login: false
    },
    requesting: {
      tags: false,
    },
  },
  getters: {
    getTagGroup: (state, getters) => (model) => {
      return state.tags.filter((g) => {
        return g.model == model
      })
    }
  },
  mutations: {
    toggleModal(state, opts) {
      if(typeof state.modals[opts.modal] == 'undefined') return false
      if(typeof opts.state != 'undefined')  return state.modals[opts.modal] = opts.state
      return state.modals[opts.modal] = state.modals[opts.modal] ? false : true
    },
    addTag(state, id) {
      state.tags.push(id)
    },
    removeTag(state, n) {
      state.tags.splice(n, 1)
    },
    replaceTags(state, tags) {
      state.tags = tags
    },
    toImperial(state) {
      state.measurements = 'imperial'
    },
    toMetric(state) {
      state.measurements = 'metric'
    },
    requesting(state, property) {
      state[property] = true
    },
    setProfile(state, profile) {
      state.user.profile = Object.assign({}, state.user.profile, profile)
    },
    setAuthState(state, authenticated) {
      state.user.authenticated = authenticated
    }
  },
  actions: {
    fetchTags(context) {
      return new Promise((resolve, reject) => {
        if(context.state.tags.length == 0) {
          context.commit('requesting', 'tags')
          return API.fetch('tags').then((tags) => {
           context.commit('replaceTags', tags)
           resolve()
         })
        }

        resolve()
      })
    },
    refreshUser(context) {
      return Auth.refreshUser().then(user => {
        context.commit('setProfile', user)
        context.commit('setAuthState', true)
      }).catch(err => {
        context.commit('setProfile', {
          _id: false,
          name: {},
          avatar: {
            url: 'http://placehold.it/150x150'
          }
        })
        context.commit('setAuthState', false)
      })
    }
  }
})
