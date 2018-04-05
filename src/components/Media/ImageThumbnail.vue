<template>
  <div class="column is-half thumbnail">
    <div class="image is-16by9" @click="select()">
      <img :src="getThumbnail()" />
    </div>
    <div class="level">
      <div class="level-left">
        <div class="tag level-item" v-if="media.external">External</div>
      </div>
      <div class="level-right">
        <a @click="$emit('remove', media)" class="icon level-item" v-tooltip="'Delete Image'"><i class="fas fa-trash"></i></a>
      </div>
    </div>


  </div>
</template>

<script>
import Media from '@/services/media'
import '@/styles/ui/_thumbnail.scss'

export default {
  props: {
    media: {
      type: Object
    }
  },
  data () {
    return {
      extension: ''
    }
  },
  methods: {
    select () {
      this.$emit('select')
    },
    getThumbnail() {
      return this.media.alternates.indexOf('600w') > -1 ? Media.getAlternateUrl('600w', this.media.url) : this.media.url
    }
  },
  watch: {
    media: function() {
      this.extension = Media.getExtension(this.media.key)
    }
  }
}
</script>
