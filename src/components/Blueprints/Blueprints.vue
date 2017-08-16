<template>
<div>
<section class="hero">
  <div class="container">
    <div class="level">
      <div class="level-left">
        <h1 class="title">Blueprints</h1>
      </div>
      <div class="level-right">
        <a class="level-item">Learn to Build</a>
        <a class="level-item">Glossary</a>
        <router-link :to="{ name: 'Import', params: { model: 'Blueprint' } }" class="button is-primary is-medium">Add a Blueprint</router-link>
      </div>
    </div>
  </div>
</section>
<main class="container">
  <div class="columns">
    <div class="column is-one-quarter">
      <Filters :options="filterOptions" @selected="filterBlueprints" @sort="sortBlueprints" @order="orderBlueprints"></Filters>
    </div>
    <div class="column">
      <div class="columns is-multiline">
        <Blueprint :model="blueprint" :key="blueprint._id" v-for="blueprint in blueprints"></Blueprint>
        <div class="column" v-if="blueprints.length == 0 && loading == false" v-cloak>
          There aren't any Blueprints that match what you're looking for. Maybe you should build it!
        </div>
      </div>
    </div>

  </div>
</main>
</div>
</template>

<script>
import Filters from '@/components/ui/Filters'
import API from '@/services/api'

import Blueprint from '@/components/cards/Blueprint'

export default {
  name: 'blueprints',
  components: {
    Filters,
    Blueprint,
  },
  data () {
    return {
      loading: false,
      blueprints: [],
      globalParams: {},
      filterOptions: {
        'buildings': {
          label: 'Buildings',
          type: 'list',
          visible: true
        },
        'scenery': {
          label: 'Scenery',
          type: 'list',
          visible: true
        },

        'materials': {
          label: 'Materials',
          type: 'list'
        },
        'themes': {
          label: 'Themes',
          type: 'list'
        },
        'style': {
          label: 'Styles',
          type: 'list'
        },
        'shops': {
          label: 'Shops',
          type: 'list'
        },
        'facilities': {
          label: 'Facilities & Utilities',
          type: 'list'
        },
        'construction-kits': {
          label: 'Construction Kits',
          type: 'list',
          dlc: true,
          visible: true,
          force: true
        },
        'coasters': {
          label: 'Coasters',
          type: 'list'
        },
        'rides': {
          label: 'Rides',
          type: 'list'
        },
        'regions': {
          label: 'Biomes',
          type: 'list'
        },
      }
    }
  },
  methods: {
    getBlueprints (params = {}) {
      params = Object.assign(params, this.globalParams)
      return API.fetch('blueprints', params).then((data) => {
        this.blueprints = data
      })
    },
    sortBlueprints(sort) {
      this.globalParams.sort = sort
    },
    orderBlueprints(order) {
      this.globalParams.order = order
    },
    filterBlueprints(tags) {
      this.loading = true
      tags = tags.join(',')
      this.getBlueprints({ tags: tags }).then(() => {
        this.loading = false
      })
    }
  },
  mounted () {
    this.getBlueprints().catch((err) => {

    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

</style>
