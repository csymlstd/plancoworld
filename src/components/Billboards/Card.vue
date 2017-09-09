<template>
  <div class="column is-one-third">
    <div class="card">
      <div class="card-image" @click="viewBillboard">
        <img :src="model.media[0] ? model.media[0].url : ''" v-if="model.media.length > 0" />
      </div>
      <div class="card-content">
        <div class="content">
          {{ model.orientation }}
          {{ model.screens }}
          {{ model.tags }}
          {{ model.description }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import router from '@/router'

export default {
  name: 'billboard-card',
  props: {
    model: {},
  },
  data () {
    return {
      selected: [],
      groups: []
    }
  },
  methods: {
    viewBillboard () {
      router.push({ name: 'Billboard', params: { slug: this.model.slug, id: this.model._id }})
    }
  },
  mounted () {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
