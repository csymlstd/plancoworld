<template>
  <div class="column is-one-third-desktop is-half-tablet">
    <div class="card has-level-bottom">
      <div class="card-image" :style="{ 'background': getBackground(model.media[0]) }" @click="viewBlueprint">
        <div class="level bottom">
          <div class="level-left">
            <a @click.stop="$emit('remove', { id: model._id, model: 'blueprints' })" v-if="editMode" class="level-item"><span class="tag is-rounded is-warning is-medium"><i class="fas fa-times"></i>&nbsp; Remove</span></a>
            <div class="tag is-primary is-rounded is-medium level-item" v-if="isBuilding()">Building</div>
            <div class="tag is-primary is-rounded is-medium level-item" v-if="isScenery()">Scenery</div>
          </div>
          <div class="level-left"></div>
          <div class="level-right" @click.stop>
            <a :href="'http://steamcommunity.com/sharedfiles/filedetails/?id='+model.steam_id" target="_blank" class="level-item subscribe"><span class="tag is-rounded is-primary is-medium" v-tooltip="'Subscribe on Steam'"><span class="icon"><i class="fab fa-steam"></i></span></span></a>
            <div class="level-item" v-if="isSaved()"><span class="tag is-rounded is-warning is-medium" v-tooltip="'Saved to Toolbox'"><span class="icon"><i class="fas fa-archive"></i></span></span></div>
          </div>
        </div>
          <!-- <img :src="thunbnail ? thumbnail : ''" class="fadeIn" @load="$event.target.classList.toggle('is-active')" /> -->
      </div>
      <div class="card-content">
        <div class="content">
          <h3 class="title"><a :href="'/blueprints/'+model.slug" @click="viewBlueprint" @click.prevent>{{ model.name | truncate(70) }}</a></h3>
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
    editMode: false,
  },
  data () {
    return {
      selected: [],
      groups: [],
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
    },
    getBackground(item) {
        if(item.type != 'image') return ''
        let url = item.alternates.indexOf('600w') > -1 ? Media.getAlternateUrl('600w', item.url) : item.url
        return `url('${url}')`
    },
   },
  mounted () {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
