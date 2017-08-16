<template>
  <div>
  <section class="filters">
    <div class="ui grid pw--row">
      <h2>Audio</h2>
    </div>
    <div class="ui grid pw--row">
      <div class="twelve wide column">
        <Filters models="audio,audio-context,themes" labels="Type,Context,Themes" @selected="filterAudio"></Filters>
      </div>
      <div class="four wide column">
        <button class="ui icon button primary right floated"><i class="icon plus"></i> Upload Audio</button>
      </div>
    </div>
  </section>
  <main class="content">
    <div class="ui grid">
      <div class="sixteen wide column">
        <div class="row">
          <Audio :model="track" :key="track._id" v-for="track in audio"></Audio>
        </div>
      </div>
    </div>
  </main>
</div>
</template>

<script>
import Filters from '@/components/ui/Filters'
import API from '@/services/api'

export default {
  name: 'audio',
  components: {
    Filters,
  },
  data () {
    return {
      audio: []
    }
  },
  methods: {
    getAudio (params = {}) {
      return API.fetch('audio', params).then((data) => {
        this.audio = data
      })
    },
    filterAudio(tags) {
      this.loading = true
      tags = tags.join(',')
      this.getAudio({ tags: tags }).then(() => {
        this.loading = false
      })
    }
  },
  mounted () {
    this.getAudio().catch((err) => {

    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

</style>
