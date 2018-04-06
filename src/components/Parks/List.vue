<template>
  <div class="level">
    <div class="level-left">
      <img :src="thumbnail ? thumbnail : ''" v-if="thumbnail" class="fadeIn level-item" @load="$event.target.classList.toggle('is-active')" @click="viewPark" />
      <a :href="'/parks/'+model.slug" @click="viewPark" class="level-item" :title="model.name">{{ model.name | truncate(45) }}</a>
    </div>
    <div class="level-right">
      <div class="switch level-item" @click="toggleStatus()" v-if="isOwner()" v-tooltip="{ content: statusTooltip }" :class="{ 'is-active': model.status && model.steam_id, 'is-warning': !model.steam_id }">
        <label></label>
      </div>
    </div>
  </div>
</template>

<script>
import router from '@/router'
import Media from '@/services/media'
import API from '@/services/api'
import Auth from '@/services/auth'

export default {
  name: 'park-list',
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
  computed: {
    statusTooltip () {
      if(this.model.status && this.model.steam_id) return 'Open to the Public'
      if(!this.model.steam_id) return 'Link to Workshop to Open'
      return 'Closed to the Public'
    }
  },
  methods: {
    viewPark (e) {
      e.preventDefault()
      console.log(this.$parent.toggle())
      router.push({ name: 'Park', params: { slug: this.model.slug }})
    },
    toggleStatus() {
      let status = this.model.status
      let newStatus = status ? false : true
      API.put(`parks/${this.model._id}`, { status: newStatus }).then((model) => {
        this.model.status = model.status
      }).catch(() => {
        this.model.status = status
      })
      this.model.status = newStatus
    },
    isOwner() {
      return Auth.isOwner(this.model)
    }
  },
  mounted () {
    // if((this.model.media.length > 0) && this.model.media[0].alternates.indexOf('350w') > -1) {
    //   let url = Media.getAlternateUrl('350w', this.model.media[0].url)
    //   this.$set(this, 'thumbnail', url)
    // } else if(this.model.media.length > 0) {
    //   this.$set(this, 'thumbnail', this.model.media[0].url)
    // }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
