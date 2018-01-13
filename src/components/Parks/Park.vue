<template>
  <div>
  <section class="hero hero--tall" :style="{ backgroundImage: `url('${park.media.length > 0 ? park.media[0].url : '' }')` }">
    <div class="hero-meta">
      <div class="container">
        <div class="level">
          <div class="level-left">
            <Filters :options="heroFilterOptions" :inline="true" :readOnly="true" :large="true" ref="heroTags" class="level-item"></Filters>
            <div class="tags selected-tags level-item">
              <a v-if="park.billboards.length > 0" href="#billboards" class="tag is-rounded is-white is-large" data-scroll v-tooltip="'Download the custom Billboards for the best experience'"><span class="icon"><i class="fas fa-exclamation"></i></span> <span>Billboards</span></a>
            </div>
          </div>
          <div class="level-right">
            <a class="button level-item is-medium is-primary is-inverted"><span class="icon"><i class="far fa-map"></i></span> <span>Park Map</span></a>
            <a @click="openModal('uploadPhotos')" class="button level-item is-white is-medium" v-if="editMode"><span>Manage Photos</span></a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="hero">
    <div class="container">
      <div class="level is-mobile">
        <div class="level-left">
          <h1 class="title level-item"><router-link :to="{ name: 'Parks' }">Parks</router-link></h1>
          <h2 class="title level-item"> / {{ park.name ? park.name : '' | truncate(45) }}</h2>
        </div>
        <div class="level-right">
          <button class="button level-item is-medium is-dark" @click="copy" v-tooltip="{ content: 'Copy Park URL'  }"><span class="icon"><i class="fas fa-link"></i></span></button>

          <a v-if="park.steam_id" :href="'http://steamcommunity.com/sharedfiles/filedetails/?id='+park.steam_id" target="_blank" class="button  level-item is-medium is-primary"><span class="icon"><i class="fab fa-steam"></i></span> <span>Subscribe on Steam</span></a>
          <a v-if="!park.steam_id && isOwner()" @click="openModal('linkToWorkshop')" class="button level-item is-medium is-primary"><span class="icon"><i class="fas fa-exclamation-circle"></i></span> <span>Link to Workshop</span></a>

          <div class="field level-item has-addons" v-if="isOwner()">
            <div class="control"><a @click="toggleEditMode" class="button is-warning is-medium construction">Edit</a></div>
            <div class="control"><a @click="updatePark()" class="button is-light is-medium" v-if="editMode">Save</a></div>
            <div class="control">
              <div class="button is-white is-medium" @click="toggleStatus()" v-tooltip="{ content: statusTooltip }">
                <div class="switch" :class="{ 'is-active': park.status && park.steam_id, 'is-warning': !park.steam_id }">
                  <label></label>
                </div>
              </div>
            </div>
          </div>

          <SaveToToolbox model="parks" :data="park" v-if="!isOwner()"></SaveToToolbox>
        </div>
      </div>
    </div>
  </section>

  <Modal :class="{ 'linkToWorkshop': true }" @close="closeModal('linkToWorkshop')" :show="modalOpen('linkToWorkshop')">
    <div class="form">
      <div class="field">
        <div class="control">
          <input type="text" v-model="modals.linkToWorkshop.url" class="input is-medium" placeholder="http://steamcommunity.com/sharedfiles/filedetails/?id=#########" />
        </div>
      </div>
      <div class="field">
        <a class="button is-primary is-medium" @click="linkToWorkshop()">Link to Workshop</a>
      </div>
    </div>
  </Modal>

  <main class="content container">
    <div class="columns">
      <div class="column is-one-quarter">
        <div class="box park-info">
          <Creator :user="park.user"></Creator>
          <br />
          <table class="table is-not-hoverable">
            <tbody>
            <tr>
              <td colspan="2">
                <ReactionMeter />
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <div class="box" v-if="park.colors.length > 0 || editMode">
          <ColorPalette v-model="park.colors" :editMode="editMode"></ColorPalette>
        </div>

        <Filters class="field" :options="filterOptions" :readOnly="!editMode" ref="tags"></Filters>

        <a href="#" class="button is-white is-fluid field">Report Park</a>

        <a href="#" class="button is-warning is-fluid" v-if="editMode">Delete Park</a>

      </div>

      <div class="column">

        <!-- <div class="box">
          <h3 class="h3">Amenities @ this Park</h3>
          <div class="amenity" v-if="hasTag('entertainment-points')">
            <h4>Entertainment Points</h4>
            <p>Look for our world-classed entertainers at various points around the park.</p>
          </div>
          <div class="amenity" v-if="hasTag('fireworks')">    
            <h4>Fireworks</h4>
            <p>Stay for the show, we'll light up the sky once the sun goes down.</p>
          </div>
          <div class="amenity" v-if="hasTag('priority-pass')">
            <h4>Priority Pass</h4>
            <p>Purchase a pass and skip the lines, you'll be given priority at our most popular rides.</p>
          </div>
          <div class="amenity" v-if="hasTag('recycling')">
            <h4>Recycling</h4>
            <p>Keep our park green and recycle in our designated bins.</p>
          </div>
          <div class="amenity" v-if="hasTag('security')">
            <h4>Security</h4>
            <p>Feel safe with our security staff watching on the ground and through CCTV.</p>
          </div>
          <div class="amenity" v-if="hasTag('transport')">
            <h4>Transport</h4>
            <p>Get to your favorite rides across the park quickly by our transit system.</p>
          </div>
          <div class="amenity" v-if="hasTag('vista-points')">
            <h4>Vista Points</h4>
            <p>A picture is worth a thousand words. Find our designated photo points.</p>
          </div>
          <div class="amenity" v-if="hasTag('water-rides')">
            <h4>Water Rides</h4>
            <p>Warning you may get wet!</p>
          </div>
        </div> -->

        <section class="box park-description">
          <div class="park-description-editor editor" v-if="editMode" v-html="park.description"></div>
          <div class="park-description-content" v-show="!editMode" v-html="park.description"></div>
        </section>


        <div class="level" id="billboards">
          <div class="level-left">
            <h3 class="level-item">Billboards</h3>
            <div class="level-item"><a @click="openModal('downloadBillboards')" class="is-text">Download All ({{ park.billboards.length }})</a></div>
          </div>
          <div class="level-right">
            <!-- <router-link :to="{ name: 'Generator' }" class="button level-item is-white is-medium"><span class="icon"><i class="fas fa-paint-brush has-text-primary"></i></span> <span>Generator</span></router-link> -->
            <a @click="openModal('addBillboard')" class="button level-item is-white is-medium" v-if="editMode"><span class="icon"><i class="fas fa-plus has-text-primary"></i></span> <span>Add Billboard</span></a>
          </div>
        </div>
        <Billboard :model="billboard" :key="billboard._id" v-for="billboard in park.billboards"></Billboard>

        <Modal :class="{ 'downloadBillboards': true }" @close="closeModal('downloadBillboards')" :show="modalOpen('downloadBillboards')">
          <p>Be sure to place in Documents\Frontier Developments\Planet Coaster\UserMedia</p>
        </Modal>

        <Modal :class="{ 'addBillboard': true }" @close="closeModal('addBillboard')" :show="modalOpen('addBillboard')">
          <div class="form">
            <div class="field">
              <Search @selected="addToPark($event, 'addBillboard')" placeholder="Search for Billboards" :models="['billboards']"></Search>
            </div>
            <div class="field">
              <a class="button is-primary is-medium">Add to Park</a>
            </div>
          </div>
        </Modal>

        <div class="level">
          <div class="level-left">
            <h3 class="ui header level-item">Blueprints</h3>
          </div>
          <div class="level-right">
            <a @click="openModal('addBlueprint')" class="button is-white is-medium" v-if="editMode"><span class="icon"><i class="fas fa-plus has-text-primary"></i></span> <span>Add Blueprint</span></a>
          </div>
        </div>

        <div class="columns cards is-multiline loader--parent">
          <Blueprint :model="blueprint" :key="blueprint._id" v-for="blueprint in park.blueprints"></Blueprint>
        </div>

        <Modal :class="{ 'addBlueprint': true }" @close="closeModal('addBlueprint')" :show="modalOpen('addBlueprint')">
          <div class="form">
            <div class="field">
              <Search @selected="addToPark($event, 'addBlueprint')" placeholder="Search for Blueprints" :models="['blueprints']"></Search>
            </div>
            <div class="field">
              <a class="button is-primary is-medium">Add to Park</a>
            </div>
          </div>
        </Modal>

      </div>
    </div>

    <Modal :class="{ 'uploadPhotos': true }" @close="closeModal('uploadPhotos')" :show="modalOpen('uploadPhotos')">
      <div class="park-media">
        <div class="park-photo level" :key="media._id" v-for="(media, key) in park.media">
          <div class="level-item">
            <img :src="media.url" class="is-64h" />
            <div class="tag is-rounded" v-if="key == 0">Primary</div>
          </div>
        </div>
      </div>
      <Upload @uploaded="addPhoto" folder="parks" instructions="Drop your park photos here, or click to browse your computer" v-if="park && isOwner() && editMode"></Upload>
    </Modal>

  </main>
  </div>
</template>

<script>
import Search from '@/components/ui/Search'
import Filters from '@/components/ui/Filters'
import Upload from '@/components/ui/Upload'
import SaveToToolbox from '@/components/ui/SaveToToolbox'
import ColorPalette from '@/components/ui/ColorPalette'
import ReactionMeter from '@/components/ui/ReactionMeter'
import Modal from '@/components/ui/Modal'
import Dropdown from '@/components/ui/Dropdown'
import Creator from '@/components/ui/ProfileMini'
import Blueprint from '@/components/Blueprints/Card'
import Billboard from '@/components/Billboards/Card'
import API from '@/services/api'
import auth from '@/services/auth'
import { store } from '@/store.js'

import Quill from 'quill'
import SmoothScroll from 'smooth-scroll'

export default {
  name: 'parks',
  store,
  components: {
    Search,
    Filters,
    Upload,
    SaveToToolbox,
    ColorPalette,
    ReactionMeter,
    Dropdown,
    Creator,
    Blueprint,
    Billboard,
    auth,
    Modal
  },
  data () {
    return {
      loading: true,
      editMode: false,
      shareURL: '',
      modals: {
        linkToWorkshop: {
          show: false,
          url: ''
        },
        uploadPhotos: {
          show: false,
          loading: false
        },
        addBillboard: {
          show: false,
          loading: false
        },
        addBlueprint: {
          show: false,
          loading: false
        },
        downloadBillboards: {
          show: false,
          loading: false
        }
      },
      editor: false,
      park: {
        media: [ { url: '' } ],
        billboards: [],
        shops: [],
        attractions: [],
        colors: [],
      },
      heroFilterOptions: {
        'parks': {
          label: false,
          type: 'tags',
        },
        'parks-plans': {
          label: false,
          type: 'tags',
          description: false
        }
      },
      filterOptions: {
        'parks': {
          label: 'Park Type',
          type: 'toggle',
          visible: true,
          force: true,
          max: 1,
          hidden: true
        },
        'parks-plans': {
          label: 'Park Plans',
          description: false,
          type: 'toggle',
          visible: true,
          force: true,
          max: 1,
          hidden: true
        },
        'amenities': {
          label: 'Amenities',
        },
        'regions': {
          label: 'Biomes',
          type: 'list'
        },
        'age-groups': {
          label: 'Age Groups',
          type: 'toggle',
        },
        'content-packs': {
          label: 'Content Packs',
          type: 'list',
          readOnly: 'checklist',
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
        'requirements': {
          label: 'Requirements',
          type: 'list',
          readOnly: 'checklist'
        },
        'language': {
          label: 'Language',
          type: 'list'
        },
      }
    }
  },
  watch: {
    '$route': 'getPark'
  },
  computed: {
    statusTooltip () {
      if(this.park.status && this.park.steam_id) return 'Open to the Public'
      if(!this.park.steam_id) return 'Link to Workshop to Open'
      return 'Closed to the Public'
    }
  },
  methods: {
    notify() {
      this.$notify('notifications', 'Your Park has been saved', '')
    },
    isOwner() {
      return auth.isOwner(this.park)
    },
    closeModal(modal) {
      this.modals[modal].show = false
      this.modals[modal].loading = false
    },
    openModal(modal) {
      this.modals[modal].show = true
    },
    modalOpen(modal) {
      return this.modals[modal].show
    },
    addToPark(match, modal) {
      this.modals[modal].loading = true

      let plural = match._type+'s'
      let model = this.park[plural]
      let data = {}

      data[plural] = [match._id]
      model.forEach((m) => {
        data[plural].push(m._id)
      })

      console.log('putting', data)
      API.put(this.apiURL(), data).then(() => {
        return this.getPark()
      }).then(() => {

      }).catch(() => {

      })
    },
    getTagGroup(model) {
      return this.$store.getters.getTagGroup(model)
    },
    setModalData(modal, field, data) {
      this.$set(this.modals[modal].data, field, data)
    },
    linkToWorkshop() {
      API.post(this.apiURL()+'/link', { url: this.modals.linkToWorkshop.url }).then((park) => {
        this.$notify('notifications', 'Park linked to workshop', 'success')
        this.modals.linkToWorkshop.show = false
        this.park.steam_id = park.steam_id
      }).catch((err) => {
        this.$notify('notifications', 'Could not link to Workshop', 'error')
        console.log(err)
      })
    },
    addPhoto(newMedia) {
      console.log('adding', media)
      this.park.media.push(newMedia)

      let media = []
      this.park.media.forEach((m) => {
        media.push(m._id)
      })

      API.put(this.apiURL(), { media }).then((park) => {
        this.park.status = park.status
      }).catch(() => {
        this.park.status = status
      })
    },
    toggleStatus() {
      let status = this.park.status
      let newStatus = status ? false : true
      API.put(this.apiURL(), { status: newStatus }).then((park) => {
        this.park.status = park.status
      }).catch(() => {
        this.park.status = status
      })
      this.park.status = newStatus
    },
    toggleEditMode(state) {
      if(state === true || state === false) {
         this.editMode = state
      } else {
        this.editMode = this.editMode ? false : true
      }

      if(this.editMode == true) {
        this.$nextTick(() => {
          this.attachEditor()
        })
      } else {
        let toolbar = this.editor.container.parentNode.querySelector('.ql-toolbar')
        console.log(toolbar)
        if(toolbar) toolbar.remove()
        this.$nextTick(() => {
          this.editor = null
          this.getPark()
        })

      }
    },
    getPark() {
      this.loading = true

      API.fetch(this.apiURL(false)).then((park) => {
        this.park = park
        this.shareURL = `http://planco.world/parks/${this.park.slug}`
        this.loading = false
        this.editMode = false
        this.$refs.heroTags.setPopulated(this.park.tags)
        this.$refs.tags.setPopulated(this.park.tags)

      }).catch((err) => {
        API.handleError(err, 'parks')
      })
    },
    updatePark() {
      this.toggleEditMode(false)
      this.loading = true
      let data = this.park

      let media = []
      this.park.media.forEach((m) => {
        media.push(m._id)
      })
      data.media = media
      data.user = data.user._id
      data.description = this.editor.container.firstChild.innerHTML
      data.tags = this.$refs.tags.selected

      return API.put(this.apiURL(), data).then((park) => {
        this.$notify('notifications', 'Your Park has been saved', 'success')
        return this.getPark()
      })
    },
    apiURL(force = true) {
      if(this.park._id && force) {
        return `parks/${this.park._id}`
      }

      let ID = this.$route.params.id
      let SLUG = this.$route.params.slug
      let url

      if(ID) {
        url = `parks/${ID}`
      } else if(SLUG) {
        url = `parks/slug/${SLUG}`
      }
      return url
    },
    attachEditor() {
      let wrapper = this.$el.querySelector('.park-description-editor')
      this.editor = new Quill(wrapper, {
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic'],
            ['link', { 'list': 'ordered'}, { 'list': 'bullet' }],
            ['clean']
          ]
        },
        theme: 'snow'
      })
    },
    hasTag(slug) {
      if(typeof this.park.tags !== 'undefined') {
        return this.park.tags.filter(t => {
          return t.slug == slug
        })
      }

      return false
    },
    copy() {
      this.$clipboard(this.shareURL)
      this.$notify('notifications', 'Park URL Copied', 'success')
    }
  },
  created () {
    this.getPark()
  },
  mounted () {
    new SmoothScroll('a[data-scroll]')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  
</style>
