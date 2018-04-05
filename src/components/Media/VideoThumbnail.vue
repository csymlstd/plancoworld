<template>
  <div class="column is-half thumbnail">
    <div class="image is-16by9" :class="{ 'no-thumbnail': !thumbnail }" @click="select()">
      <img :src="thumbnail" v-if="thumbnail" />
      <div class="name" v-if="!thumbnail">{{ media.name }}</div>
    </div>
    <div class="level">
      <div class="level-left">
        <div class="tag is-outlined level-item">{{ media.meta.duration }} Sec</div>
        <div class="tag is-success level-item" v-if="media.transcoder.status == 'Complete'">Transcoded</div>
      </div>
      <div class="level-right">
        <a @click="$emit('remove', media)" class="icon level-item" v-tooltip="'Delete Video'"><i class="fas fa-trash"></i></a>
      </div>
    </div>


  </div>
</template>

<script>
import Media from '@/services/media'
// import '@/styles/ui/_thumbnail.scss'

export default {
  props: {
    media: {
      type: Object
    }
  },
  data () {
    return {

    }
  },
  methods: {
    select () {
      this.$emit('select')
    }
  },
  computed: {
    thumbnail () {
      return Media.getAlternateUrl(this.media.alternates[0], this.media.url)
    }
  }
}
</script>
