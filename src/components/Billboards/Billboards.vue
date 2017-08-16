<template>
<div>
<section class="hero">
  <div class="container">
    <div class="level">
      <div class="level-left">
        <h1 class="title">Billboards</h1>
      </div>
      <div class="level-right">
        <a class="level-item">Generator</a>
        <router-link :to="{ name: 'Convert' }" class="level-item">Convert to WebM</router-link>
        <a class="level-item">Glossary</a>
        <router-link :to="{ name: 'ImportBillboard' }" class="button is-primary is-medium">Add a Billboard</router-link>
      </div>
    </div>
  </div>
</section>
<main class="container billboards">
  <div class="columns">
    <div class="column is-one-quarter">
      <Filters :options="filterOptions" @selected="filterBillboards" @sort="sortBillboards" @order="orderBillboards"></Filters>
    </div>
    <div class="column">
      <div class="columns is-multiline">
        <Billboard :model="billboard" :key="billboard._id" v-for="billboard in billboards"></Billboard>
        <div class="column" v-if="billboards.length == 0 && loading == false" v-cloak>
          There aren't any Billboards that match what you're looking for. Maybe you should build it!
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

import Billboard from '@/components/Billboards/Card'

export default {
  name: 'billboards',
  components: {
    Filters,
    Billboard
  },
  data () {
    return {
      loading: false,
      billboards: [],
      globalParams: {},
      filterOptions: {
        'billboards': {
          label: null,
          type: 'toggle',
          visible: true
        },
        'billboards-context': {
          label: 'Context',
          type: 'list',
          visible: true,
          force: true,
        },
        'coasters': {
          label: 'Coasters',
          type: 'list'
        },
        'rides': {
          label: 'Rides',
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
        'themes': {
          label: 'Themes',
          type: 'list'
        },
        'style': {
          label: 'Styles',
          type: 'list'
        },
      }
    }
  },
  methods: {
    getBillboards (params = {}) {
      params = Object.assign(params, this.globalParams)
      return API.fetch('billboards', params).then((data) => {
        this.billboards = data
      })
    },
    sortBillboards(sort) {
      this.globalParams.sort = sort
    },
    orderBillboards(order) {
      this.globalParams.order = order
    },
    filterBillboards(tags) {
      this.loading = true
      tags = tags.join(',')
      this.getBillboards({ tags: tags }).then(() => {
        this.loading = false
      })
    }
  },
  mounted () {
    this.getBillboards().catch((err) => {

    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

</style>
