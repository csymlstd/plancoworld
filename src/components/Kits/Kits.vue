<template>
  <div>

  <section class="hero">
    <div class="container">
      <div class="level">
        <div class="level-left">
          <h1 class="title"><i class="fas fa-box-full"></i> Kits</h1>
          <div class="sub-title">Kickstart a park with a collection of scenery, buildings, and billboards</div>
        </div>
        <div class="level-right">
          <router-link :to="{ name: 'GuidePage', params: { slug: 'kits' }}" class="level-item">Read the Guide</router-link>
          <router-link :to="{ name: 'GuidePage', params: { slug: 'glossary' }}" class="level-item">Glossary</router-link>
          <!-- <router-link :to="{ name: 'ImportKit' }" class="button is-primary is-medium level-item" v-if="isLoggedIn()">Add a Kit</router-link> -->
        </div>
      </div>
    </div>
  </section>
  <main class="container">
    <div class="columns">
      <div class="column is-one-quarter content">
        <Filters :options="filterOptions" :selected="selectedTags" @selected="filterKits"></Filters>
      </div>
      <div class="column">
        <div class="level">
          <div class="level-left">
            <div class="level-item"><Sort @sort="sortKits" @order="orderKits"></Sort></div>
          </div>
          <div class="level-right">
            <a class="delete level-item" @click="globalParams.name = ''; getKits()" v-if="globalParams.name"></a>
            <div class="level-item">
              <div class="control has-icons-left is-medium">
                <input type="text" class="input is-medium" @keydown.enter="getKits" v-model="globalParams.name" placeholder="Filter by kit name" />
                <span class="icon is-small is-left"><i class="fas fa-search"></i></span>
              </div>
            </div>
          </div>
        </div>


        <div class="columns cards is-multiline loader--parent">
          <Loader v-if="loading"></Loader>

          <Kit :model="kit" :key="kit._id" v-for="(kit, index) in kits" v-if="index < 4"></Kit>

          <!-- <div class="column is-one-third" v-if="kits.length > 4">
            <div class="card card--pcw bg--accent">
              <div class="card-content content">
                <h2 class="has-text-white">We are hiring Mechanics!</h2>
                <p class="has-text-white">Help maintain our Kits, Blueprints, Billboards, and Audio.</p>
                <p class="has-text-white">Wages range from $0 to nuzumpo</p>
                <a class="button is-dark">Apply Within</a>
              </div>
            </div>
          </div> -->

          <Kit :model="kit" :key="kit._id" v-for="(kit, index) in kits" v-if="index > 3"></Kit>

          <div class="column" v-if="kits.length == 0 && loading == false" v-cloak>
            <div class="notification is-warning text-center">There aren't any Kits that match what you're looking for. You should create it! <br /> Go to a park, billboard, or blueprint and create a kit.</div>
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
import Kit from './Card'

export default {
  name: 'kits',
  metaInfo: {
    title: 'Kits'
  },
  components: {
    Filters,
    Sort,
    Kit,
    Pagination,
    Loader,
    Search
  },
  data () {
    return {
      loading: true,
      globalParams: {},
      kits: [],
      pagination: {
        current: 1,
        pages: 1,
        total: 0,
        limit: 25
      },
      selectedTags: [],
      filterOptions: {
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
        'content-packs': {
          label: 'Content Packs',
          type: 'list',
          dlc: true,
          visible: true,
          force: true
        },
      }
    }
  },
  methods: {
    isLoggedIn() {
      return Auth.isLoggedIn()
    },
    getKits (params = {}) {
      this.loading = true
      params = Object.assign(params, this.globalParams)
      return API.fetch('kits', params).then((data) => {
        console.log(data)
        this.kits = data.kits
        this.loading = false
        this.pagination.total = data.total
        this.pagination.pages = data.pages
        this.pagination.limit = data.limit
        this.pagination.current = data.page
        return data
      }).catch((err) => {

      })
    },
    sortKits(sort) {
      this.globalParams.sort = sort
      this.getKits().then(() => {
        this.loading = false
      })
    },
    orderKits(order) {
      this.globalParams.order = order
      this.getKits().then(() => {
        this.loading = false
      })
    },
    filterKits(tags) {
      this.loading = true
      this.selectedTags = tags

      let params = []
      tags.forEach(tag => {
        params.push(tag._id)
      })

      params = params.join(',')
      this.globalParams.tags = params

      this.getKits().then(() => {
        this.loading = false
      })
    },
    goToPage(page) {
      this.globalParams.page = page
      this.getKits().then(() => {
        this.loading = false
      })
    }
  },
  mounted () {
    this.loading = true
    this.getKits().catch((err) => {
      this.loading = false
    })

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  section.hero {
    background-image: url('/assets/images/hero-kits.png');
    background-size: auto 100%!important;
    background-repeat: no-repeat!important;
    background-position: 150px center!important;
  }

  .sub-title {
    transform: translateY(4px) translateX(15px);
    opacity: 0.75;
  }

  .hero .title {
    margin: 0;
  }
</style>
