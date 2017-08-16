<template>
  <div class="column is-one-third">
    <div class="card">
      <div class="card-image" @click="viewPark">
          <img :src="thumbnail ? thumbnail : ''" class="fadeIn" @load="$event.target.classList.toggle('is-active')" />
      </div>
      <div class="card-content">
        <div class="content">
          <h3><a @click="viewPark">{{ model.name }}</a></h3>
          <div class="creator">By {{ model.user.name.display }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from '@/router'

import Media from '@/services/media'

export default {
  name: 'park-card',
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
    viewPark () {
      router.push({ name: 'Park', params: { slug: this.model.slug }})
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
