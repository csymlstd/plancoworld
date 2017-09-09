<template>
  <div class="level">
    <div class="level-left">
      <div class="level-item"><img :src="media.url" style="max-width: 100px;" /></div>
      <a class="level-item" :title="media.name">{{ media.name | truncate(45) }}</a>
    </div>
    <div class="level-right">
      <div class="switch level-item" @click="toggleStatus()" :class="{ 'is-active': media.status }">
        <label></label>
      </div>
    </div>
  </div>
</template>

<script>
// import '@/styles/ui/_thumbnail.scss'

export default {
  props: {
    media: {
      type: Array
    }
  },
  data () {
    return {

    }
  }
}
</script>
