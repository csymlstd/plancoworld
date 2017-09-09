<template>
  <div class="modal is-active" v-show="show">
    <div class="modal-background" @click="close"></div>
    <div class="modal-content" @click.stop>
      <div class="box">
        <slot></slot>
      </div>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="close()"></button>
  </div>
</template>

<script>
import '@/styles/components/_modal.scss'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {

    }
  },
  methods: {
    close() {
      this.$emit('close')
    }
  },
  mounted () {
    document.addEventListener('keydown', (e) => {
      if(this.show && e.keyCode == 27) {
        this.close();
      }
    })
  }
}
</script>
