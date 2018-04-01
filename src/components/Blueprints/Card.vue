<template>
  <div class="column is-one-third-desktop is-half-tablet">
    <div class="card has-level-bottom">
      <div class="card-image" :style="{ 'backgroundImage': `url('${thumbnail}')` }" @click="viewBlueprint">
        <div class="level bottom">
          <div class="level-left">
            <div class="tag is-primary is-rounded is-medium level-item" v-if="isBuilding()">Building</div>
            <div class="tag is-primary is-rounded is-medium level-item" v-if="isScenery()">Scenery</div>
          </div>
          <div class="level-left"></div>
          <div class="level-right">
            <a :href="'http://steamcommunity.com/sharedfiles/filedetails/?id='+model.steam_id" @click.stop target="_blank" class="level-item subscribe"><span class="tag is-rounded is-primary is-medium" v-tooltip="'Subscribe on Steam'"><span class="icon"><i class="fab fa-steam"></i></span></span></a>
            <div class="level-item" v-if="isSaved()"><span class="tag is-rounded is-warning is-medium" v-tooltip="'Saved to Toolbox'"><span class="icon"><i class="fas fa-archive"></i></span></span></div>
          </div>
        </div>
          <!-- <img :src="thunbnail ? thumbnail : ''" class="fadeIn" @load="$event.target.classList.toggle('is-active')" /> -->
      </div>
      <div class="card-content">
        <div class="content">
          <h3 class="title"><a :href="'/blueprints/'+model.slug" @click="viewBlueprint">{{ model.name | truncate(70) }}</a></h3>
          <div class="level bottom">
            <div class="level-left">
              <Creator :user="model.user" class="level-item"></Creator>
            </div>
            <div class="level-right">
              <Reaction :model="model" :type="'blueprints'"></Reaction>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from '@/router'

import Media from '@/services/media'
import Auth from '@/services/auth'
import Creator from '@/components/ui/ProfileMicro'
import Reaction from '@/components/ui/Reaction'

export default {
  components: {
    Creator,
    Reaction
  },
  props: {
    model: {},
  },
  data () {
    return {
      selected: [],
      groups: [],
      thumbnail: ''
    }
  },
  methods: {
    viewBlueprint () {
      router.push({ name: 'Blueprint', params: { slug: this.model.slug }})
    },
    isSaved() {
      return (this.model.toolbox.indexOf(Auth.user.profile._id) > -1)
    },
    isBuilding() {
      return this.model.tags.filter(t => {
        return t._id == '597cfc8c23e62646b0c8f7a7'
      }).length > 0
    },
    isScenery() {
      return this.model.tags.filter(t => {
        return t._id == '5a442a25c42b1d290831e007'
      }).length > 0
    }
   },
  mounted () {
    if((this.model.media.length > 0) && this.model.media[0].alternates.indexOf('350w') > -1) {
      let url = Media.getAlternateUrl('350w', this.model.media[0].url)
      this.$set(this, 'thumbnail', url)
    } else if(this.model.media.length > 0) {
      this.$set(this, 'thumbnail', this.model.media[0].url)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
