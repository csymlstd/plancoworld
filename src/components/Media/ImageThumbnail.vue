<template>
  <div class="column is-half thumbnail">
    <div class="image is-16by9" draggable>
      <img :src="media.url" />
    </div>
    <div class="level">
      <div class="level-left">
        <div class="tag level-item" v-if="media.external">External</div>
      </div>
      <div class="level-right">
        <a class="icon level-item" v-tooltip="'Delete Image'"><i class="fas fa-trash"></i></a>
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
  watch: {
    media: function() {
      console.log(this.media.key)
      this.extension = Media.getExtension(this.media.key)
    }
  }
}
</script>
