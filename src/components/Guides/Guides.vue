<template>
  <div>

  <section class="hero">
    <div class="container">
      <div class="level">
        <div class="level-left">
          <h1 class="title level-item">Guides</h1>
        </div>
        <div class="level-right">

        </div>
      </div>
    </div>
  </section>
  <main class="container">
    <div class="columns">
      <div class="column is-one-quarter">
        <div class="box" :key="category.slug" v-for="category in categories">
            <div class="content"><h5 class="title is-5">{{ category.name }}</h5></div>

            <aside class="menu">
            <ul class="menu-list">
                <li :key="page._id" v-for="page in getPagesByCategory(category._id)"><router-link :to="{ name: 'GuidePage', params: { slug: page.slug }}"><span v-html="page.name"></span></router-link></li>
            </ul>
            </aside>
        </div>
      </div>
      <div class="column">
        <router-view>
            <!-- Wiki page will be displayed here -->
        </router-view>

        <div class="box">
          <h2 class="title">Hayo!</h2>
          <p>We are looking for PlanCo fans to write guides. If you would like to write, provide source data, or have suggestions of other guides send an email to <a href="mailto:guides@planco.world">guides@planco.world</a></p>
          <br />
          <p>Our goal is to create a single organized source for everything Planet Coaster!</p>
        </div>
      </div>

    </div>
  </main>
  
</div>
</template>

<script>
import Search from '@/components/ui/Search'
import Loader from '@/components/ui/Loader'
import API from '@/services/api'
import Auth from '@/services/auth'

export default {
  name: 'wiki',
  metaInfo: {
    title: 'Guides to gameplay, tools, controls, and the Steam Workshop'
  },
  components: {
    Loader,
    Search
  },
  data () {
    return {
      loading: true,
      globalParams: {},
      categories: [],
      pages: [],
    }
  },
  computed: {
      
  },
  methods: {
    isLoggedIn() {
      return Auth.isLoggedIn()
    },
    getPages(params = {}) {
      return API.fetch('wiki').then(pages => {
          this.pages = pages
      })
    },
    getCategories(params = {}) {
      return API.fetch('tags', { model: 'wiki' }).then(categories => {
          this.categories = categories
      })
    },
    getPagesByCategory(category_id) {
        return this.pages.filter(page => {
            return page.tags.indexOf(category_id) > -1
        })
    }
  },
  mounted () {
    this.loading = true
    this.getCategories()
    this.getPages()

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
