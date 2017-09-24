<template>
<div>
<section class="hero">
  <div class="container">
    <div class="level">
      <div class="level-left">
        <!-- <h1 class="title">Billboards</h1> -->
      </div>
      <div class="level-right">
        <router-link :to="{ name: 'Generator' }" class="level-item">Generator</router-link>
        <router-link :to="{ name: 'Convert' }" class="level-item">Convert to WebM</router-link>
        <a class="level-item">Glossary</a>
        <router-link :to="{ name: 'ImportBillboard' }" class="button is-primary is-medium">Add a Billboard</router-link>
      </div>
    </div>
  </div>
</section>
<main class="container billboards">
  <div class="columns">
    <div class="column is-one-quarter content">
      <Filters :options="filterOptions" @selected="filterBillboards" @sort="sortBillboards" @order="orderBillboards"></Filters>
    </div>
    <div class="column">

      <div class="level">
        <div class="level-left">
          <div class="level-item"><Sort @sort="sortBillboards" @order="orderBillboards"></Sort></div>
        </div>
        <div class="level-right">
          <a class="delete level-item" @click="globalParams.name = ''; getBillboards()" v-if="globalParams.name"></a>
          <div class="level-item">
            <div class="control has-icons-left is-medium">
              <input type="text" class="input is-medium" @keydown.enter="getBillboards" v-model="globalParams.name" placeholder="Filter by billboard name" />
              <span class="icon is-small is-left"><i class="fas fa-search"></i></span>
            </div>
          </div>
        </div>
      </div>

      <div class="columns cards is-multiline loader--parent">
        <Loader v-if="loading"></Loader>
        <Billboard :model="billboard" :key="billboard._id" v-for="billboard in billboards"></Billboard>
        <div class="column" v-if="billboards.length == 0 && loading == false" v-cloak>
          <div class="notification is-warning">There aren't any Billboards that match what you're looking for. You should create it!</div>
        </div>
      </div>
      <Pagination :total="pagination.total" :current="pagination.current" :pages="pagination.pages" @goTo="goToPage"></Pagination>
    </div>

  </div>
</main>
</div>
</template>

<script>
import Filters from '@/components/ui/Filters'
import Sort from '@/components/ui/Sort'
import Loader from '@/components/ui/Loader'
import Pagination from '@/components/ui/Pagination'
import API from '@/services/api'

import Billboard from '@/components/Billboards/Card'

export default {
  name: 'billboards',
  components: {
    Filters,
    Sort,
    Loader,
    Billboard,
    Pagination
  },
  metaInfo: {
    title: 'Billboards'
  },
  data () {
    return {
      loading: false,
      billboards: [],
      globalParams: {},
      pagination: {
        current: 1,
        pages: 1,
        total: 0,
        limit: 25
      },
      filterOptions: {
        'billboards': {
          label: null,
          type: 'toggle',
          visible: true
        },
        'orientation': {
          label: 'Orientation',
          type: 'toggle',
          visible: true,
          force: true
        },
        'billboards-context': {
          label: 'Context',
          type: 'list',
          visible: true,
          force: true,
        },
        'language': {
          label: 'Language',
          type: 'list',
          visible: true
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
      this.loading = true
      params = Object.assign(params, this.globalParams)
      return API.fetch('billboards', params).then((data) => {
        this.billboards = data.billboards
        this.loading = false
        this.pagination.total = data.total
        this.pagination.pages = data.pages
        this.pagination.limit = data.limit
        this.pagination.current = data.page
        return data
      }).catch((err) => {

      })
    },
    sortBillboards(sort) {
      this.globalParams.sort = sort
      this.getBillboards().then(() => {
        this.loading = false
      })
    },
    orderBillboards(order) {
      this.globalParams.order = order
      this.getBillboards().then(() => {
        this.loading = false
      })
    },
    filterBillboards(tags) {
      this.loading = true
      tags = tags.join(',')
      this.getBillboards({ tags: tags }).then(() => {
        this.loading = false
      })
    },
    goToPage(page) {
      this.globalParams.page = page
      this.getBillboards().then(() => {
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
