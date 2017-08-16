<template>
  <div>
  <section class="hero">
    <div class="container">
      <div class="level">
        <div class="level-left">
          <h1 class="title level-item">Parks</h1>
        </div>
        <div class="level-right">
          <a class="level-item">Learn to Build</a>
          <a class="level-item">Glossary</a>
          <router-link :to="{ name: 'Import', params: { model: 'Park' } }" class="button is-primary is-medium level-item">Add a Park</router-link>
        </div>
      </div>
    </div>
  </section>
  <main class="container">
    <div class="columns">
      <div class="column is-one-quarter">
        <Filters :options="filterOptions" @selected="filterParks" ></Filters>
      </div>
      <div class="column">
        <Sort @sort="sortParks" @order="orderParks"></Sort>
        <div class="columns is-multiline">
          <Park :model="park" :key="park._id" v-for="park in parks"></Park>
          <div class="column" v-if="parks.length == 0 && loading == false" v-cloak>
            There aren't any Parks that match what you're looking for. Maybe you should build it!
          </div>
        </div>
        <Pagination :total="pagination.total" :current="pagination.current" :pages="pagination.pages" @goTo="goToPage"></Pagination>
      </div>

    </div>
  </main>
  <router-view>
    <!-- Modal component will be rendered here -->
  </router-view>
</div>
</template>

<script>
import Filters from '@/components/ui/Filters'
import Sort from '@/components/ui/Sort'
import Pagination from '@/components/ui/Pagination'
import API from '@/services/api'
import Park from './Card'

export default {
  name: 'parks',
  components: {
    Filters,
    Sort,
    Park,
    Pagination
  },
  data () {
    return {
      loading: true,
      globalParams: {},
      parks: [],
      pagination: {
        current: 1,
        pages: 1,
        total: 0,
        limit: 25
      },
      filterOptions: {
        'parks': {
          label: null,
          type: 'toggle',
          visible: true
        },
        'parks-plans': {
          label: 'Park Plans',
          type: 'toggle',
          visible: true,
          max: 1,
        },
        'regions': {
          label: 'Biomes',
          type: 'list'
        },
        'amenities': {
          label: 'Amenities',
          type: 'list'
        },
        'construction-kits': {
          label: 'Construction Kits',
          type: 'list',
          dlc: true,
          visible: true,
          force: true
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
    getParks (params = {}) {
      this.loading = true
      params = Object.assign(params, this.globalParams)
      return API.fetch('parks', params).then((data) => {
        console.log(data)
        this.parks = data.parks
        this.pagination.total = data.total
        this.pagination.pages = data.pages
        this.pagination.limit = data.limit
        this.pagination.current = data.page
        return data
      }).catch((err) => {

      })
    },
    sortParks(sort) {
      this.globalParams.sort = sort
      this.getParks().then(() => {
        this.loading = false
      })
    },
    orderParks(order) {
      this.globalParams.order = order
      this.getParks().then(() => {
        this.loading = false
      })
    },
    filterParks(tags) {
      this.loading = true
      tags = tags.join(',')
      this.globalParams.tags = tags

      this.getParks().then(() => {
        this.loading = false
      })
    },
    goToPage(page) {
      this.globalParams.page = page
      this.getParks().then(() => {
        this.loading = false
      })
    }
  },
  mounted () {
    this.loading = true
    this.getParks().catch((err) => {
      this.loading = false
    })

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .hero .title {
    margin: 0;
  }
</style>
