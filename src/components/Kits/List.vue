<template>
  <div class="level">
    <div class="level-left">
      <a @click="viewKit" class="level-item"><img :src="thumbnail" v-if="thumbnail" class="is-64h" /></a>
      <a :href="'/kits/'+model.slug" @click="viewKit" class="level-item" :title="model.name">{{ model.name | truncate(45) }}</a>
    </div>
    <div class="level-right">
      <div class="switch level-item" @click="toggleStatus()" v-if="isOwner()" :class="{ 'is-active': model.status }">
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
  name: 'kit-list',
  components: {

  },
  props: {
    model: {},
  },
  data () {
    return {
      selected: [],
      groups: [],
    }
  },
  computed: {
    thumbnail () {
      return this.model ? this.model.media[0].url : ''
    }
  },
  methods: {
    viewKit (e) {
      e.preventDefault()
      console.log(this.$parent.toggle())
      router.push({ name: 'Kit', params: { slug: this.model.slug }})
    },
    toggleStatus() {
      let status = this.model.status
      let newStatus = status ? false : true
      API.put(`kits/${this.model._id}`, { status: newStatus }).then((model) => {
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
