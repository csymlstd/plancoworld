<template>
  <div class="column is-one-third-desktop is-half-tablet">
    <div class="card has-level-bottom" >
      <div class="card-image" :class="{ 'playing': playing }" @click="viewBillboard" :style="{ 'background': getBackground(model.media[0]) }">
        <video autoplay="autoplay" loop="loop" muted="muted" v-if="model.media[0] && model.media[0].type == 'video'">
          <source :src="model.media[0].url">
        </video>
        <div class="level bottom">
          <div class="level-left">
            <a @click.stop="$emit('remove', { id: model._id, model: 'billboards' })" v-if="editMode" class="level-item"><span class="tag is-rounded is-warning is-medium"><i class="fas fa-times"></i>&nbsp; Remove</span></a>
          </div>
          <div class="level-right">
            <a @click.stop="downloadBillboard()" class="level-item subscribe"><span class="tag is-rounded is-primary is-medium" v-tooltip="`Download`"><span class="icon"><i class="fas fa-cloud-download"></i></span></span></a>
          </div>
        </div>
      </div>
      <div class="card-content">
        <div class="content">
          <h3 class="title"><a @click="viewBillboard">{{ model.name | truncate(70) }}</a></h3>
          <div class="level bottom">
            <div class="level-left">
              <Creator :user="model.user" class="level-item"></Creator>
            </div>
            <div class="level-right">
              <Reaction :model="model" @reacted="model.reactions = $event" :type="'billboards'"></Reaction>
              <!-- <div class="vote level-item"><span class="icon"><i class="fas fa-heart"></i></span><span class="count">{{ model.votes.upTotal || 0 }}</span></div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import API from '@/services/api'
import Media from '@/services/media'
import router from '@/router'
import Creator from '@/components/ui/ProfileMicro'
import Reaction from '@/components/ui/Reaction'

export default {
  name: 'billboard-card',
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
      downloading: false,
      playing: false,
    }
  },
  methods: {
    viewBillboard () {
      router.push({ name: 'Billboard', params: { slug: this.model.slug, id: this.model._id }})
    },
    getBackground(item = {}) {
        if(item.type != 'image') return ''
        let url = item.alternates.indexOf('600w') > -1 ? Media.getAlternateUrl('600w', item.url) : item.url
        return `url('${url}')`
    },
    downloadBillboard () {
      this.downloading = true
      let mediaID = this.model.media[0]._id
      API.fetch(`media/${mediaID}/download`).then((billboard) => {
        let url = billboard.signedRequest
        window.location = url
        this.downloading = false
      })
    },
  },
  mounted () {
    this.$nextTick(() => {
      let v = this.$el.querySelector('video')
      if(v) v.addEventListener('playing', () => {
        this.playing = true
      })
    })
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .card-image:not(.playing) {
    background: url('/assets/images/color-bars.jpg');
  }
</style>
