<template>
  <div class="reactions is-selectable" :class="{ 'is-open': open }">
    <div v-if="reactOnly">
      <div class="add-reaction" v-show="open" @mouseleave="open = false">
        <a class="reaction nauseating" @click="react('nauseating')">Nauseating!</a>
        <a class="reaction boring" @click="react('boring')">Boring..</a>
        <a class="reaction scary" @click="react('scary')">Scary!</a>
        <a class="reaction fun" @click="react('exciting')">Exciting!</a>
        <a class="reaction love" @click="react('love')">Love It!</a>
      </div>
      <i class="far fa-plus-circle has-text-grey-light" @mouseover="open = true" @click="open ? open = false : open = true" v-if="isLoggedIn()"></i>
    </div>
    <div v-else>
      <div class="add-reaction" v-show="open" @mouseleave="open = false">
        <a class="reaction nauseating" @click="react('nauseating')">Nauseating!</a>
        <a class="reaction boring" @click="react('boring')">Boring..</a>
        <a class="reaction scary" @click="react('scary')">Scary!</a>
        <a class="reaction fun" @click="react('exciting')">Exciting!</a>
        <a class="reaction love" @click="react('love')">Love It!</a>
      </div>
      <i class="far fa-plus-circle has-text-grey-light" @mouseover="open = true" @click="open ? open = false : open = true" v-if="isLoggedIn()"></i>
      <a class="reaction nauseating" v-if="hasReacted('nauseating')" v-tooltip="{ content: total('nauseating') }">Nauseating!</a>
      <a class="reaction boring" v-if="hasReacted('boring')" v-tooltip="{ content: total('boring') }">Boring..</a>
      
      <a class="reaction scary" v-if="hasReacted('scary')" v-tooltip="{ content: total('scary') }">Scary!</a>
      <a class="reaction fun" v-if="hasReacted('exciting')" v-tooltip="{ content: total('exciting') }">Exciting!</a>
      <a class="reaction love" v-if="hasReacted('love')" v-tooltip="{ content: total('love') }">Love It!</a>
    </div>
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
    },
    reactOnly: false,
  },
  computed: {
    
  },
  data () {
    return {
      open: false,
    }
  },
  methods: {
    total(reaction) {
      return typeof this.model.reactions !== 'undefined' && this.model.reactions[reaction] ? this.model.reactions[reaction].length : 0
    },
    isLoggedIn() {
      return auth.isLoggedIn()
    },
    react(reaction) {
      console.log('reacting with '+reaction)
      this.open = false
      if(!this.isLoggedIn()) return false
      API.put(`${this.type}/${this.model._id}/react`, { reaction }).then(reactions => {
        this.$emit('reacted', reactions)
      })
    },
    hasReacted(reaction) {
      return typeof this.model.reactions !== 'undefined' && this.model.reactions[reaction] && this.model.reactions[reaction].length > 0
    }
  },
  mounted() {
    if(!this.model.reactions) this.$emit('reacted', {})
  }
}
</script>

<style>

</style>
