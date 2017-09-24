<template>
  <div>
  <section class="hero">
    <div class="container">
      <div class="level">
        <div class="level-left">
          <!-- <h1 class="title level-item">Blueprints</h1> -->
        </div>
        <div class="level-right">
          <a class="level-item">Learn to Build</a>
          <a class="level-item">Glossary</a>
          <router-link :to="{ name: 'ImportBlueprint' }" class="button is-primary is-medium level-item" v-if="isLoggedIn()">Add a Blueprint</router-link>
        </div>
      </div>
    </div>
  </section>
  <main class="container">
    <div class="columns">
      <div class="column is-one-quarter content">
        <Filters :options="filterOptions" @selected="filterBlueprints" ></Filters>
      </div>
      <div class="column">
        <div class="level">
          <div class="level-left">
            <div class="level-item"><Sort @sort="sortBlueprints" @order="orderBlueprints"></Sort></div>
          </div>
          <div class="level-right">
            <a class="delete level-item" @click="globalParams.name = ''; getBlueprints()" v-if="globalParams.name"></a>
            <div class="level-item">
              <div class="control has-icons-left is-medium">
                <input type="text" class="input is-medium" @keydown.enter="getBlueprints" v-model="globalParams.name" placeholder="Filter by blueprint name" />
                <span class="icon is-small is-left"><i class="fas fa-search"></i></span>
              </div>
            </div>
          </div>
        </div>


        <div class="columns cards is-multiline loader--parent">
          <Loader v-if="loading"></Loader>
          <Blueprint :model="blueprint" :key="blueprint._id" v-for="blueprint in blueprints"></Blueprint>
          <div class="column" v-if="blueprints.length == 0 && loading == false" v-cloak>
            <div class="notification is-warning">There aren't any Blueprints that match what you're looking for. You should build it!</div>
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
import Loader from '@/components/ui/Loader'
import Filters from '@/components/ui/Filters'
import Sort from '@/components/ui/Sort'
import Pagination from '@/components/ui/Pagination'
import Search from '@/components/ui/Search'
import API from '@/services/api'
import Auth from '@/services/auth'
import Blueprint from './Card'

export default {
  name: 'blueprints',
  metaInfo: {
    title: 'Blueprints'
  },
  components: {
    Filters,
    Loader,
    Sort,
    Blueprint,
    Pagination,
    Search
  },
  data () {
    return {
      loading: true,
      globalParams: {},
      blueprints: [],
      pagination: {
        current: 1,
        pages: 1,
        total: 0,
        limit: 25
      },
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
        'age-groups': {
          label: 'Age Groups',
          type: 'toggle',
          visible: true,
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
        'content-packs': {
          label: 'Content Packs',
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
    isLoggedIn() {
      return Auth.isLoggedIn()
    },
    getBlueprints (params = {}) {
      this.loading = true
      params = Object.assign(params, this.globalParams)
      return API.fetch('blueprints', params).then((data) => {
        console.log(data)
        this.loading = false
        this.blueprints = data.blueprints
        this.pagination.total = data.total
        this.pagination.pages = data.pages
        this.pagination.limit = data.limit
        this.pagination.current = data.page
        return data
      }).catch((err) => {
        this.loading = false
      })
    },
    sortBlueprints(sort) {
      this.globalParams.sort = sort
      this.getBlueprints().then(() => {
        this.loading = false
      })
    },
    orderBlueprints(order) {
      this.globalParams.order = order
      this.getBlueprints().then(() => {
        this.loading = false
      })
    },
    filterBlueprints(tags) {
      this.loading = true
      tags = tags.join(',')
      this.globalParams.tags = tags

      this.getBlueprints().then(() => {
        this.loading = false
      })
    },
    goToPage(page) {
      this.globalParams.page = page
      this.getBlueprints().then(() => {
        this.loading = false
      })
    }
  },
  mounted () {
    this.loading = true
    this.getBlueprints().catch((err) => {
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
