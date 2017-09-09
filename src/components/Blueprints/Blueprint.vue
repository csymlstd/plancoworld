<template>
  <div>
  <!-- <div class="blueprint-status is-under-construction">
    <div class="level">
      <div class="level-left">
        Under Construction
      </div>
      <div class="level-right">
        <span class="level-item">Link your Blueprint to the Steam Workshop to make it public on Planco World.</span>
        <a class="button is-link">Link to Workshop</a>
      </div>
    </div>
  </div> -->
  <section class="hero hero--tall" :style="{ backgroundImage: `url('${blueprint.media.length > 0 ? blueprint.media[0].url : '' }')` }">

  </section>
  <section class="hero">
    <div class="container">
      <div class="level is-mobile">
        <div class="level-left">
          <h1 class="title level-item"><router-link :to="{ name: 'Blueprints' }">Blueprints</router-link></h1>
          <h2 class="title level-item"> / {{ blueprint.name ? blueprint.name : '' | truncate(45) }}</h2>
        </div>
        <div class="level-right">
          <button class="button level-item is-medium is-dark" v-tooltip="{ content: 'Copy Blueprint URL'  }"><span class="icon"><i class="fas fa-link"></i></span></button>

          <a v-if="blueprint.steam_id" :href="'http://steamcommunity.com/sharedfiles/filedetails/?id='+blueprint.steam_id" target="_blank" class="button level-item is-medium is-primary"><span class="icon"><i class="fab fa-steam"></i></span> <span>Subscribe on Steam</span></a>
          <a v-if="!blueprint.steam_id" @click="openModal('linkToWorkshop')" class="button level-item is-medium is-primary"><span class="icon"><i class="fas fa-exclamation-circle"></i></span> <span>Link to Workshop</span></a>

          <div class="button is-white is-medium" @click="toggleStatus()" v-if="isOwner()" v-tooltip="{ content: statusTooltip  }">
            <div class="switch" :class="{ 'is-active': blueprint.status && blueprint.steam_id, 'is-warning': !blueprint.steam_id }">
              <label></label>
            </div>
          </div>

          <SaveToToolbox model="blueprints" :data="blueprint" v-if="!isOwner()"></SaveToToolbox>
        </div>
      </div>
    </div>
  </section>
  <main class="content container">

    <!-- <section class="notification is-warning" v-if="!loading && !blueprint.steam_id" v-cloak>
      <span class="icon"><i class="fas fa-exclamation-circle"></i></span>&nbsp;
      <span>This Blueprint will not be visible to the community until you link it to a Steam Workshop item.</span>
    </section> -->

    <Modal :class="{ 'linkToWorkshop': true }" @close="closeModal('linkToWorkshop')" :show="modalOpen('linkToWorkshop')">
      <div class="form">
        <div class="field">
          <div class="control">
            <input type="text" class="input is-medium" placeholder="http://steamcommunity.com/sharedfiles/filedetails/?id=#########" />
          </div>
        </div>
        <div class="field">
          <a class="button is-primary is-medium">Link to Workshop</a>
        </div>
      </div>
    </Modal>

    <div class="columns">
      <div class="column is-one-quarter">
        <Filters :options="filterOptions" :readOnly="true" ref="tags"></Filters>
      </div>

      <div class="column">

        <section class="box blueprint-description" :class="{ 'truncate': blueprint.description && blueprint.description.length > 500 && shorten }" v-html="blueprint.description"></section>
        <a href="#" class="button is-outlined" @click="readMore" v-if="shorten"> Read More</a>



        <h3 class="ui header">Billboards <a class="is-text">Download All ({{ blueprint.billboards.length }})</a></h3>
        <Billboard :model="billboard" :key="billboard._id" v-for="billboard in blueprint.billboards"></Billboard>

      </div>
    </div>



  </main>
  </div>
</template>

<script>
import Filters from '@/components/ui/Filters'
import SaveToToolbox from '@/components/ui/SaveToToolbox'
import Modal from '@/components/ui/Modal'
import Dropdown from '@/components/ui/Dropdown'
import Billboard from '@/components/Billboards/Card'
import API from '@/services/api'
import auth from '@/services/auth'
import { store } from '@/store.js'

export default {
  name: 'blueprints',
  store,
  components: {
    Filters,
    SaveToToolbox,
    Dropdown,
    Billboard,
    auth,
    Modal
  },
  data () {
    return {
      loading: true,
      modals: {
        linkToWorkshop: {
          show: false
        }
      },
      blueprint: {
        media: [ { url: '' } ],
        billboards: [],
        shops: [],
        attractions: []
      },
      shorten: true,
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
  watch: {
    '$route': 'getBlueprint'
  },
  computed: {
    statusTooltip () {
      if(this.blueprint.status && this.blueprint.steam_id) return 'Open to the Public'
      if(!this.blueprint.steam_id) return 'Link to Workshop to Open'
      return 'Closed to the Public'
    }
  },
  methods: {
    isOwner() {
      return auth.isOwner(this.blueprint)
    },
    closeModal(modal) {
      this.modals[modal].show = false
    },
    openModal(modal) {
      this.modals[modal].show = true
    },
    modalOpen(modal) {
      return this.modals[modal].show
    },
    getTagGroup(model) {
      return this.$store.getters.getTagGroup(model)
    },
    setModalData(modal, field, data) {
      this.$set(this.modals[modal].data, field, data)
    },
    toggleStatus() {
      let status = this.blueprint.status
      let newStatus = status ? false : true
      API.put(this.apiURL(), { status: newStatus }).then((blueprint) => {
        this.blueprint.status = blueprint.status
      }).catch(() => {
        this.blueprint.status = status
      })
      this.blueprint.status = newStatus
    },
    getBlueprint() {
      API.fetch(this.apiURL(false)).then((blueprint) => {
        this.blueprint = blueprint
        this.loading = false

        let tagIDs = []

        for(let t=0;t<this.blueprint.tags.length;t++) {
          tagIDs.push(this.blueprint.tags[t]._id)
        }
        this.$refs.tags.set(tagIDs)
      }).catch((err) => {
        API.handleError(err, 'blueprints')
      })
    },
    apiURL(force = true) {
      if(this.blueprint._id && force) {
        return `blueprints/${this.blueprint._id}`
      }

      let ID = this.$route.params.id
      let SLUG = this.$route.params.slug
      let url

      if(ID) {
        url = `blueprints/${ID}`
      } else if(SLUG) {
        url = `blueprints/slug/${SLUG}`
      }
      return url
    },
    readMore(e) {
      e.preventDefault()
      if(this.shorten) return this.shorten = false
      return this.shorten = true
    }
  },
  created () {
    this.getBlueprint()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .truncate {
    position: relative;
    max-height: 250px;
    overflow: hidden;

    &:after {
      display: block;
      content: ' ';
      position: absolute;
      width: 100%;
      height: 100px;
      bottom: 0;
      left: 0;
      background: linear-gradient(0deg, rgba(255,255,255,1), rgba(255,255,255,0));
      pointer-events: none;
    }
  }
</style>
