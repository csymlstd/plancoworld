import Vue from 'vue'
import Vuex from 'vuex'
import API from '@/services/api'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    tags: []
  },
  getters: {
    getTagGroup: (state, getters) => (model) => {
      return state.tags.filter((g) => {
        return g.model == model
      })
    }
  },
  mutations: {
    addTag(state, id) {
      state.tags.push(id)
    },
    removeTag(state, n) {
      state.tags.splice(n, 1)
    },
    replaceTags(state, tags) {
      state.tags = tags
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
