<template>
  <div class="column is-one-third">
    <div class="card">
      <div class="card-image" @click="viewBillboard">
        <img :src="model.media[0].url" v-if="model.media[0] && model.media[0].type == 'image'" />
        <video autoplay loop muted>
          <source :src="model.media[0].url" v-if="model.media[0] && model.media[0].type == 'video'">
        </video>
      </div>
      <div class="card-content">
        <div class="content">
          <h3 class="title"><a @click="viewBillboard">{{ model.name | truncate(70) }}</a></h3>
          <div class="level bottom">
            <div class="level-left">
              <Creator :user="model.user" class="level-item"></Creator>
            </div>
            <div class="level-right">
              <div class="reactions is-selectable">
                <div class="add-reaction" v-show="addReaction">
                  <a class="reaction boring">Boring..</a>
                  <a class="reaction scary">Scary!</a>
                  <a class="reaction nauseating">Bleh!</a>
                </div>
                <i class="far fa-plus-circle has-text-grey-light" @click="addReaction ? addReaction = false : addReaction = true"></i>
                <a class="reaction love">Love It!</a>
                <a class="reaction fun">So Fun!</a>
              </div>
              <!-- <div class="vote level-item"><span class="icon"><i class="fas fa-heart"></i></span><span class="count">{{ model.votes.upTotal || 0 }}</span></div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import router from '@/router'
import Creator from '@/components/ui/ProfileMicro'

export default {
  name: 'billboard-card',
  components: {
    Creator,
  },
  props: {
    model: {},
  },
  data () {
    return {
      selected: [],
      groups: []
    }
  },
  methods: {
    viewBillboard () {
      router.push({ name: 'Billboard', params: { slug: this.model.slug, id: this.model._id }})
    }
  },
  mounted () {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .card-image {
    background: url('/assets/images/color-bars.jpg');
  }
</style>
