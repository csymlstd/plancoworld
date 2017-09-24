<template>
  <div class="reactions is-selectable" :class="{ 'is-open': open }">
    <div class="add-reaction" v-show="open">
      <a class="reaction boring" @click="react('boring')">Boring..</a>
      <a class="reaction nauseating" @click="react('nauseating')">Nauseating!</a>
      <a class="reaction scary" @click="react('scary')">Scary!</a>
      <a class="reaction fun" @click="react('exciting')">Exciting!</a>
      <a class="reaction love" @click="react('love')">Love It!</a>
    </div>
    <i class="far fa-plus-circle has-text-grey-light" @click="open ? open = false : open = true"></i>
    <a class="reaction boring" v-if="hasReacted('boring')">Boring..</a>
    <a class="reaction nauseating" v-if="hasReacted('nauseating')">Nauseating!</a>
    <a class="reaction scary" v-if="hasReacted('scary')">Scary!</a>
    <a class="reaction fun" v-if="hasReacted('exciting')">Exciting!</a>
    <a class="reaction love" v-if="hasReacted('love')">Love It!</a>
  </div>
</template>

<script>
import '@/styles/components/_reactions.scss'

import auth from '@/services/auth'

export default {
  props: {
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
      console.log('Reacted:', this.model.reactions[reaction])
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
