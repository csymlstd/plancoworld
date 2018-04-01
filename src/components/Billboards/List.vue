<template>
  <div class="level">
    <div class="level-left">
      <a @click="viewBillboard" class="level-item"><img :src="thumbnail" v-if="thumbnail" class="is-64h" /></a>
      <a :href="'/billboards/'+model.slug" @click="viewBillboard" class="level-item" :title="model.name">{{ model.name | truncate(45) }}</a>
    </div>
    <div class="level-right">
      <div class="switch level-item" @click="toggleStatus()" :class="{ 'is-active': model.status }">
        <label></label>
      </div>
    </div>
  </div>
</template>

<script>
import router from '@/router'
import Media from '@/services/media'
import API from '@/services/api'

export default {
  name: 'billboard-list',
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
      return this.model && this.model.media && this.model.media[0].type == 'image' ? this.model.media[0].url : ''
    }
  },
  methods: {
    viewBillboard (e) {
      e.preventDefault()
      console.log(this.$parent.toggle())
      router.push({ name: 'Billboard', params: { slug: this.model.slug }})
    },
    toggleStatus() {
      let status = this.model.status
      let newStatus = status ? false : true
      API.put(`billboards/${this.model._id}`, { status: newStatus }).then((model) => {
        this.model.status = model.status
      }).catch(() => {
        this.model.status = status
      })
      this.model.status = newStatus
    },
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
