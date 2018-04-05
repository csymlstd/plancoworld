<template>
  <div class="column is-one-third-desktop is-half-tablet">
    <div class="card has-level-bottom">
      <div class="card-image" @click="viewBillboard" :style="{ 'background': getBackground(model.media[0]) }">
        <video autoplay loop muted>
          <source :src="model.media[0].url" v-if="model.media[0] && model.media[0].type == 'video'">
        </video>
        <div class="level bottom">
          <div class="level-left">
            <a @click.stop="$emit('remove', { id: model._id, model: 'billboards' })" v-if="editMode" class="level-item"><span class="tag is-rounded is-warning is-medium"><i class="fas fa-times"></i>&nbsp; Remove</span></a>
            <span v-if="model.media[0].type == 'image'" class="tag is-rounded is-light is-medium"><span class="icon"><i class="fas fa-image"></i></span></span>
            <span v-if="model.media[0].type == 'video'" class="tag is-rounded is-light is-medium"><span class="icon"><i class="fas fa-film-alt"></i></span></span>
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
              <Reaction :model="model" :type="'billboards'"></Reaction>
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
      downloading: false
    }
  },
  methods: {
    viewBillboard () {
      router.push({ name: 'Billboard', params: { slug: this.model.slug, id: this.model._id }})
    },
    getBackground(item) {
        return `url('${item.url}')`
    },
    downloadBillboard () {
      this.downloading = true
      let mediaID = this.model.media[0]._id
      API.fetch(`media/${mediaID}/download`).then((billboard) => {
        let url = billboard.signedRequest
        console.log(url)
        window.open(url)
        this.downloading = false
      })
    },
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
