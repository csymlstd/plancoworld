<template>
  <div class="column is-one-quarter">
    <div class="card">
      <div class="card-image">
        <img :src="model.media[0] ? model.media[0].url : ''" v-if="model.media.length > 0" />
      </div>
      <div class="card-content">
        <h3><a @click="viewBlueprint">{{ model.name }}</a></h3>

        <div class="content">
          {{ model.description }}

          <div class="meta">
            <div class="ui label" :class="{ [`pw--tag-${tag.model}`]: true }" v-for="tag in model.tags">
              {{ tag.name }}
            </div>
          </div>
        </div>
      </div>
      <footer class="card-footer">
        <a class="card-footer-item">Add to Toolbox</a>
      </footer>
    </div>
  </div>
</template>

<script>

import router from '@/router'

export default {
  name: 'blueprint-card',
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
    viewBlueprint () {
      router.push({ name: 'Blueprint', params: { slug: this.model.slug, id: this.model._id }})
    }
  },
  mounted () {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
