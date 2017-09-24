<template>
  <div>

  <section class="hero">
    <div class="container">
      <div class="level">
        <div class="level-left">
          <!-- <h1 class="title level-item">Parks</h1> -->
        </div>
        <div class="level-right">
          <a class="level-item">Learn to Build</a>
          <a class="level-item">Glossary</a>
          <router-link :to="{ name: 'ImportPark' }" class="button is-primary is-medium level-item" v-if="isLoggedIn()">Add a Park</router-link>
        </div>
      </div>
    </div>
  </section>
  <main class="container">
    <div class="columns">
      <div class="column is-one-quarter content">
        <Filters :options="filterOptions" @selected="filterParks"></Filters>
      </div>
      <div class="column">
        <div class="level">
          <div class="level-left">
            <div class="level-item"><Sort @sort="sortParks" @order="orderParks"></Sort></div>
          </div>
          <div class="level-right">
            <a class="delete level-item" @click="globalParams.name = ''; getParks()" v-if="globalParams.name"></a>
            <div class="level-item">
              <div class="control has-icons-left is-medium">
                <input type="text" class="input is-medium" @keydown.enter="getParks" v-model="globalParams.name" placeholder="Filter by park name" />
                <span class="icon is-small is-left"><i class="fas fa-search"></i></span>
              </div>
            </div>
          </div>
        </div>


        <div class="columns cards is-multiline loader--parent">
          <Loader v-if="loading"></Loader>

          <Park :model="park" :key="park._id" v-for="(park, index) in parks" v-if="index < 4"></Park>

          <div class="column is-one-third" v-if="parks.length > 4">
            <div class="card card--pcw bg--accent">
              <div class="card-content content">
                <h2 class="has-text-white">We are hiring Mechanics!</h2>
                <p class="has-text-white">Help maintain our Parks, Blueprints, Billboards, and Audio.</p>
                <p class="has-text-white">Wages range from $0 to nuzumpo</p>
                <a class="button is-dark">Apply Within</a>
              </div>
            </div>
          </div>

          <Park :model="park" :key="park._id" v-for="(park, index) in parks" v-if="index > 3"></Park>

          <div class="column" v-if="parks.length == 0 && loading == false" v-cloak>
            <div class="notification is-warning">There aren't any Parks that match what you're looking for. You should build it!</div>
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
import Search from '@/components/ui/Search'
import Loader from '@/components/ui/Loader'
import API from '@/services/api'
import Auth from '@/services/auth'
import Park from './Card'

export default {
  name: 'parks',
  metaInfo: {
    title: 'Parks'
  },
  components: {
    Filters,
    Sort,
    Park,
    Pagination,
    Loader,
    Search
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
          label: 'Park Type',
          type: 'toggle',
          visible: true,
          force: true,
          max: 1
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
        'age-groups': {
          label: 'Age Groups',
          type: 'toggle',
          visible: true,
        },
        'amenities': {
          label: 'Amenities',
          type: 'list'
        },
        'content-packs': {
          label: 'Content Packs',
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
        }
      }
    }
  },
  methods: {
    isLoggedIn() {
      return Auth.isLoggedIn()
    },
    getParks (params = {}) {
      this.loading = true
      params = Object.assign(params, this.globalParams)
      return API.fetch('parks', params).then((data) => {
        console.log(data)
        this.parks = data.parks
        this.loading = false
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
  section.hero {
    background-image: url('/assets/images/hero-parks.png');
    background-size: auto 100%!important;
    background-repeat: no-repeat!important;
    background-position: 150px center!important;
  }

  .hero .title {
    margin: 0;
  }
</style>
