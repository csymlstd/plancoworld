<template>
  <div class="column is-one-third">
    <div class="card">
      <a class="card-image" :style="{ 'backgroundImage': `url('${thumbnail}')` }" @click="viewPark">
        <div class="level top">
          <div class="level-left"><div class="level-item"><Filters :options="tagOptions" :inline="true" :readOnly="true" ref="tags"></Filters></div></div>
          <div class="level-right"><div class="level-item" v-if="isSaved()"><span class="tag is-rounded is-warning is-medium" v-tooltip="'Saved to Toolbox'"><span class="icon"><i class="fas fa-archive"></i></span></span></div></div>
        </div>

        <div class="level bottom">
          <div class="level-left">
            <div class="level-item">
              <div class="vote"><div class="icon"><i class="far fa-chevron-up"></i></div><div class="count" v-if="model.votes.upTotal > 0">{{ model.votes.upTotal }}</div></div>
            </div>
          </div>
        </div>


          <!-- <img :src="thunbnail ? thumbnail : ''" class="fadeIn" @load="$event.target.classList.toggle('is-active')" /> -->
      </a>
      <div class="card-content">
        <div class="content">
          <h3><a @click="viewPark">{{ model.name | truncate(70) }}</a></h3>
          <div class="creator">By {{ model.user.name.display }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from '@/router'

import Filters from '@/components/ui/Filters'
import Media from '@/services/media'
import Auth from '@/services/auth'

export default {
  name: 'park-card',
  components: {
    Filters
  },
  props: {
    model: {},
  },
  data () {
    return {
      selected: [],
      groups: [],
      thumbnail: '',
      tagOptions: {
        'parks': {
          label: false,
          type: 'tags'
        }
      },
    }
  },
  methods: {
    viewPark (e) {
      e.preventDefault()
      router.push({ name: 'Park', params: { slug: this.model.slug }})
    },
    isSaved() {
      return (this.model.toolbox.indexOf(Auth.user.profile._id) > -1)
    }
  },
  mounted () {
    this.$refs.tags.set(this.model.tags)
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
