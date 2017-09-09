<template>
  <div class="column is-one-third">
    <div class="card">
      <div class="card-image" :style="{ 'backgroundImage': `url('${thumbnail}')` }" @click="viewBlueprint">
        <div class="level top">
          <div class="level-left"><div class="tag is-primary is-rounded is-medium" v-if="isBuilding()">Building</div></div>
          <div class="level-right"><div class="level-item" v-if="isSaved()"><span class="tag is-rounded is-warning is-medium" v-tooltip="'Saved to Toolbox'"><span class="icon"><i class="fas fa-archive"></i></span></span></div></div>
        </div>
          <!-- <img :src="thunbnail ? thumbnail : ''" class="fadeIn" @load="$event.target.classList.toggle('is-active')" /> -->
      </div>
      <div class="card-content">
        <div class="content">
          <h3><a @click="viewBlueprint">{{ model.name }}</a> <span class="tag is-warning" v-if="isSaved()"><i class="fas fa-archive"></i></span></h3>
          <div class="creator">By {{ model.user.name.display }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from '@/router'

import Media from '@/services/media'
import Auth from '@/services/auth'

export default {
  components: {

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
      return this.model.tags.indexOf('597cfc8c23e62646b0c8f7a7' > -1)
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
