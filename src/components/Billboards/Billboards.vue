<template>
<div>
<section class="hero">
  <div class="container">
    <div class="level">
      <div class="level-left">
        <h1 class="title"><i class="fas fa-sign"></i> Billboards</h1>
      </div>
      <div class="level-right">
        <!-- <router-link :to="{ name: 'Generator' }" class="level-item">Generator</router-link> -->
        <!-- <router-link :to="{ name: 'Convert' }" class="level-item">Convert to WebM</router-link> -->
        <router-link :to="{ name: 'GuidePage', params: { slug: 'advertising-and-billboards' }}" class="level-item">Read the Guide</router-link>
        <router-link :to="{ name: 'GuidePage', params: { slug: 'glossary' }}" class="level-item">Glossary</router-link>
        <router-link :to="{ name: 'ImportBillboard' }" class="button is-primary is-medium" v-if="isLoggedIn">Add a Billboard</router-link>
      </div>
    </div>
  </div>
</section>
<main class="container billboards">
  <div class="columns">
    <div class="column is-one-quarter content">
      <Filters ref="filters" :options="filterOptions" :selected="selectedTags" @selected="filterBillboards" @sort="sortBillboards" @order="orderBillboards"></Filters>
    </div>
    <div class="column">

      <div class="level">
        <div class="level-left">
          <div class="level-item"><Sort @sort="sortBillboards" @order="orderBillboards"></Sort></div>
          <div class="level-item"><a @click="$refs.filters.clear()" class="button">Reset</a></div>
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

      <div class="notification is-warning text-center" v-if="isSafari()" v-cloak>
        <p>Unfortunately Safari does not play the webm videos that Planet Coaster uses for billboards. <br /> Use another browser like <i class="fab fa-chrome"></i> <span>Chrome</span> or <i class="fab fa-firefox"></i> <span>Firefox</span> to view them.</p>
      </div>

      <div class="notification is-purp text-center" v-if="(pagination.current == 1 && (!globalParams.tags || globalParams.tags.indexOf('5ad3c09b9bb394631b4dadbd') > -1) ) && !hidePromo">
        <button class="delete" @click="hidePromo = true"></button>
        <i class="fas fa-2x push-down-single fa-exclamation-triangle"></i> 
        <h2 class="title is-4">Remain seated and keep your arms and legs inside the vehicle!</h2>
        <p class="field">Submit your safety signs and videos to the <strong>Safety First!</strong> billboard contest. <br /> Winner will receive the DLC of their choice!</p>
        
        <Login v-if="!isLoggedIn" class="field" :steamOnly="true"></Login>
        <router-link :to="{ name: 'ImportBillboard', query: { tags: '5ad3c09b9bb394631b4dadbd' } }" class="button is-primary is-inverted is-medium field" v-if="isLoggedIn">Submit a Billboard!</router-link>
        <a href="/billboards?tags=5ad3c09b9bb394631b4dadbd" class="button is-warning is-medium field" @click.prevent="filterBillboards([{ _id: '5ad3c09b9bb394631b4dadbd' }])" v-if="isLoggedIn">Vote!</a>
        
        <div class="content is-small"><p>Contest ends June 1st 12AM CDT / 6AM BST. Maximum of 3 submissions.</p></div>
      </div>

      <div class="columns cards is-multiline loader--parent">
        <Loader v-if="loading"></Loader>
        <Billboard :model="billboard" :key="billboard._id" v-for="billboard in billboards"></Billboard>
        <div class="column" v-if="billboards.length == 0 && loading == false" v-cloak>
          <div class="notification is-warning text-center">There aren't any Billboards that match what you're looking for. You should create it! <br /><br /> <router-link :to="{ name: 'ImportBillboard' }" class="button is-dark is-medium" v-if="isLoggedIn">Add a Billboard</router-link></div>
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
import Auth from '@/services/auth'
import Login from '@/components/Login'

import Billboard from '@/components/Billboards/Card'

export default {
  name: 'billboards',
  components: {
    Filters,
    Sort,
    Loader,
    Billboard,
    Pagination,
    Login
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
      hidePromo: false,
      selectedTags: [],
      filterOptions: {
        'billboards': {
          label: null,
          type: 'toggle',
          visible: true,
          max: 1,
        },
        'billboards-movie': {
          label: null,
          type:'switch',
          force: true,
          visible: true,
          if: '59654fdf12341326996d3359',
        },
        'orientation': {
          label: 'Orientation',
          type: 'toggle',
          visible: true,
          force: true,
          tooltips: true,
          max: 1,
        },
        'billboards-context': {
          label: 'Context',
          type: 'list',
          visible: true,
          force: true,
          guide: 'billboards-and-adverising',
        },
        'language': {
          label: 'Language',
          type: 'list',
          visible: true
        },
        'contests': {
          label: 'Contest Submissions',
          type:'list',
          force: true,
          visible: true,
          max: 1,
        },
        'coasters': {
          label: 'Coasters',
          type: 'list',
          guide: 'coasters',
        },
        'rides': {
          label: 'Rides',
          type: 'list',
          guide: 'flat-rides',
        },
        'shops': {
          label: 'Shops',
          type: 'list',
          guide: 'shops-and-facilities',
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
      this.$Progress.set(50)
      return API.fetch('billboards', params).then((data) => {
        this.billboards = data.billboards
        this.loading = false
        this.pagination.total = data.total
        this.pagination.pages = data.pages
        this.pagination.limit = data.limit
        this.pagination.current = data.page
        this.$Progress.finish()
      }).catch((err) => {
        this.$Progress.fail()
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
      this.$Progress.start()

      this.loading = true
      this.selectedTags = tags

      let params = []
      tags.forEach(tag => {
        params.push(tag._id)
      })

      params = params.join(',')
      this.globalParams.tags = params

      this.getBillboards().then(() => {
        this.loading = false
      })
    },
    goToPage(page) {
      this.globalParams.page = page
      this.getBillboards().then(() => {
        this.loading = false
      })
    },
    isSafari() {
      return window.sniff.browserType == 'safari'
    }
  },
  computed: {
    isLoggedIn() {
      return this.$store.state.user.authenticated
    },
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
