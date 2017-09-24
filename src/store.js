import Vue from 'vue'
import Vuex from 'vuex'
import API from '@/services/api'

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
    modals: {
      login: false
    }
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
    }
  },
  actions: {
    fetchTags(context) {
      return new Promise((resolve, reject) => {
        if(context.state.tags.length == 0) {
          return API.fetch('tags').then((tags) => {
           context.commit('replaceTags', tags)
           resolve()
         })
        }

        resolve()
      })
    }
  }
})
