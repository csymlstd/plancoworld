<template>
  <div class="reactions is-selectable" :class="{ 'is-open': open }">
    <div class="add-reaction" v-show="open" @mouseleave="open = false">
      <a class="reaction nauseating" @click="react('nauseating')">Nauseating!</a>
      <a class="reaction boring" @click="react('boring')">Boring..</a>
      <a class="reaction scary" @click="react('scary')">Scary!</a>
      <a class="reaction fun" @click="react('exciting')">Exciting!</a>
      <a class="reaction love" @click="react('love')">Love It!</a>
    </div>
    <i class="far fa-plus-circle has-text-grey-light" @mouseover="open = true" @click="open ? open = false : open = true"></i>
    <a class="reaction nauseating" v-if="hasReacted('nauseating')" v-tooltip="model.reactions['nauseating'].length">Nauseating!</a>
    <a class="reaction boring" v-if="hasReacted('boring')" v-tooltip="model.reactions['boring'].length">Boring..</a>
    
    <a class="reaction scary" v-if="hasReacted('scary')" v-tooltip="model.reactions['scary'].length">Scary!</a>
    <a class="reaction fun" v-if="hasReacted('exciting')" v-tooltip="model.reactions['exciting'].length">Exciting!</a>
    <a class="reaction love" v-if="hasReacted('love')" v-tooltip="model.reactions['love'].length">Love It!</a>
  </div>
</template>

<script>
import '@/styles/components/_reactions.scss'

import auth from '@/services/auth'
import API from '@/services/api'


export default {
  props: {
    type: {
      type: String,
      default: 'parks'
    },
    model: {
      type: Object,
      default: {
        reactions: {}
      }
    }
  },
  computed: {

  },
  data () {
    return {
      open: false
    }
  },
  methods: {
    react(reaction) {
      console.log('reacting with '+reaction)
      this.open = false
      if(!auth.authenticated && !auth.user.profile._id) return false
      if(typeof this.model.reactions[reaction] == 'undefined') this.model.reactions[reaction] = []
      this.model.reactions[reaction].push(auth.user.profile._id)
      API.put(`${this.type}/${this.model._id}/react`, { reaction }).then(reactions => {
        this.model.reactions = reactions
      })
    },
    hasReacted(reaction) {
      return this.model.reactions && this.model.reactions[reaction] && this.model.reactions[reaction].length > 0
    }
  },
  mounted() {
    if(typeof this.model.reactions == 'undefined') this.model.reactions = {}
  }
}
</script>

<style>

</style>
