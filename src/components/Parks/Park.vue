<template>
  <div>
  <section class="hero hero--tall">
    <Carousel class="hero-carousel" :media="park.media"></Carousel>
    <div class="hero-meta">
      <div class="container">
        <div class="level">
          <div class="level-left">
            <Filters :options="heroFilterOptions" :selected="park.tags" :inline="true" :readOnly="true" :large="true" ref="heroTags" class="level-item"></Filters>
            <div class="tags selected-tags level-item">
              <a v-if="park.billboards.length > 0" href="#billboards" class="tag is-rounded is-white is-large" data-scroll v-tooltip="'Download the custom Billboards for the best experience'"><span class="icon"><i class="fas fa-sign"></i></span> <span>Billboards</span></a>
            </div>
          </div>
          <div class="level-right">
            <a @click="openModal('parkMap')" v-if="park.map.media || editMode" class="button level-item is-medium is-primary is-inverted"><span class="icon"><i class="far fa-map"></i></span> <span>Park Map</span></a>
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
          <h2 class="title level-item" :title="park.name"> / {{ park.name ? park.name : '' | truncate(45) }}</h2>
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
          <div class="collaborators" :class="{ 'edit-mode': editMode }">
            <Creator :user="park.user"></Creator>
            <!-- <a class="profile profile--mini" v-if="editMode" v-tooltip="'Add a Collaborator'">
              <div class="avatar is-new"><i class="fas fa-plus"></i></div>
              <div class="user">Collaborator</div>
            </a> -->
          </div>
          <hr />
          <ReactionMeter :reactions="park.reactions" :reactOnly="true" />
        </div>

        <div class="box" v-if="park.colors.length > 0 || editMode">
          <h4 v-if="editMode">Color Palette</h4>
          <ColorPalette v-model="park.colors" :editMode="editMode"></ColorPalette>
        </div>

        <Filters class="field" :selected="park.tags" @selected="park.tags = $event" :options="filterOptions" :readOnly="!editMode" ref="tags"></Filters>

        <!-- <a href="#" class="button is-white is-fluid field">Report Park</a> -->

        <a @click="openModal('delete')" class="button is-warning is-fluid" v-if="editMode">Delete Park</a>

        <Modal :class="['deletePark']" :show="modalOpen('delete')">
          <p><strong>Are you sure you want to delete {{ park.name }}?</strong> This cannot be undone. Your media will still be available in the toolbox.</p>

          <a @click="deletePark()" class="button is-warning">Delete</a>
          <a @click="closeModal('delete')" class="button is-light">Cancel</a>
        </Modal>

      </div>

      <div class="column">

        <section class="box park-description">
          <div class="park-description-editor editor" v-if="editMode" v-html="park.description"></div>
          <div class="park-description-content" v-show="!editMode" v-html="park.description"></div>
        </section>

        <!-- <section class="box park-scenario">
          <Scenario :model="park.scenario" @update="updateScenario" :editMode="editMode"></Scenario>
        </section> -->

        <div class="level" id="billboards" v-if="park.billboards.length > 0 || editMode">
          <div class="level-left">
            <h3 class="level-item"><i class="fas fa-sign"></i>&nbsp; Billboards</h3>
            <!-- <div class="level-item"><a @click="openModal('downloadBillboards')" class="is-text">Download All ({{ park.billboards.length }})</a></div> -->
          </div>
          <div class="level-right">
            <!-- <router-link :to="{ name: 'Generator' }" class="button level-item is-white is-medium"><span class="icon"><i class="fas fa-paint-brush has-text-primary"></i></span> <span>Generator</span></router-link> -->
            <a @click="openModal('addBillboard')" class="button level-item is-white is-medium" v-if="editMode"><span class="icon"><i class="fas fa-plus has-text-primary"></i></span> <span>Add Billboard</span></a>
          </div>
        </div>

        <div class="columns cards is-multiline">
          <Billboard :model="billboard" @remove="removeFromPark" :editMode="editMode" :key="billboard._id" v-for="billboard in park.billboards"></Billboard>
        </div>

        <Modal :class="{ 'downloadBillboards': true }" @close="closeModal('downloadBillboards')" :show="modalOpen('downloadBillboards')">
          <p>Be sure to place in Documents\Frontier Developments\Planet Coaster\UserMedia</p>
        </Modal>

        <Modal :class="{ 'addBillboard': true }" @close="closeModal('addBillboard')" :show="modalOpen('addBillboard')">
          <div class="form">
            <div class="field">
              <Search @selected="addToPark($event, 'addBillboard')" placeholder="Search for Billboards" :models="['billboards']"></Search>
            </div>
          </div>
        </Modal>

        <div class="level" v-if="park.blueprints.length > 0 || editMode">
          <div class="level-left">
            <h3 class="ui header level-item"><i class="fas fa-box-open"></i>&nbsp; Blueprints</h3>
          </div>
          <div class="level-right">
            <a @click="openModal('addBlueprint')" class="button is-white is-medium" v-if="editMode"><span class="icon"><i class="fas fa-plus has-text-primary"></i></span> <span>Add Blueprint</span></a>
          </div>
        </div>

        <div class="columns cards is-multiline loader--parent">
          <Blueprint :model="blueprint" @remove="removeFromPark" :editMode="editMode" :key="blueprint._id" v-for="blueprint in park.blueprints"></Blueprint>
        </div>

        <Modal :class="{ 'addBlueprint': true }" @close="closeModal('addBlueprint')" :show="modalOpen('addBlueprint')">
          <div class="form">
            <div class="field">
              <Search @selected="addToPark($event, 'addBlueprint')" placeholder="Search for Blueprints" :models="['blueprints']"></Search>
            </div>
          </div>
        </Modal>

      </div>
    </div>

    <Modal :class="['park-map', 'is-skinny', 'is-wide']" @close="closeModal('parkMap')" :show="modalOpen('parkMap')">
        <img :src="park.map.media.url" v-if="park.map.media && !editMode" />
        
        <div class="box" v-if="park && isOwner() && editMode">
        <h3>Upload a Park Map</h3>
        <div class="park-photo level" v-if="park.map.media">
          <div class="level-left">
            <img :src="park.map.media.url" class="is-64h level-item" />
          </div>
          <div class="level-right">
            <a class="icon level-item" v-tooltip="'Remove from Park'" @click="removeMap()"><i class="fas fa-trash"></i></a>
          </div>
        </div>

        <Upload @uploaded="addMap" folder="parks" :instant="true" :maxItems="1" instructions="Drop your map here, or click to browse your computer"></Upload>
        </div>
    </Modal>

    <Modal :class="{ 'uploadPhotos': true }" @close="closeModal('uploadPhotos')" :show="modalOpen('uploadPhotos')">
      <div class="park-media">
        <div class="park-photo level" :key="media._id" v-for="(media, key) in park.media">
          <div class="level-left">
            <img :src="media.url" class="is-64h level-item" />
          </div>
          <div class="level-right">
            <div class="tag is-rounded level-item" v-if="key == 0">Cover Photo</div>
            <a class="icon level-item" v-tooltip="'Remove from Park'" @click="removePhoto(key)"><i class="fas fa-trash"></i></a>
          </div>
        </div>
      </div>
      <Upload @uploaded="addPhoto" folder="parks" instructions="Drop your park photos here, or click to browse your computer" v-if="park && isOwner() && editMode"></Upload>
    </Modal>

  </main>
  </div>
</template>

<script>
import '@/styles/components/_Park.scss'

import Search from '@/components/ui/Search'
import Filters from '@/components/ui/Filters'
import Upload from '@/components/ui/Upload'
import SaveToToolbox from '@/components/ui/SaveToToolbox'
import ColorPalette from '@/components/ui/ColorPalette'
import ReactionMeter from '@/components/ui/ReactionMeter'
import Carousel from '@/components/ui/Carousel'
import Modal from '@/components/ui/Modal'
import Dropdown from '@/components/ui/Dropdown'
import Creator from '@/components/ui/ProfileMini'
import Blueprint from '@/components/Blueprints/Card'
import Billboard from '@/components/Billboards/Card'
import Scenario from '@/components/Parks/Scenario'
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
    Carousel,
    SaveToToolbox,
    ColorPalette,
    ReactionMeter,
    Dropdown,
    Creator,
    Blueprint,
    Billboard,
    Scenario,
    auth,
    Modal
  },
  metaInfo() {
    return {
      title: this.park.name,
      titleTemplate: '%s • Parks • PlanCoWorld'
    }
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
        },
        parkMap: {
          show: false,
          loading: false
        },
        delete: {
          show: false,
          loading: false
        }
      },
      editor: false,
      park: {
        map: { media: false },
        media: [],
        blueprints: [],
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
          label: 'Starting Points',
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
      return auth.isOwner(this.park, this.$store.state.user)
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

      let plural = match._source.type+'s'
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
    removeFromPark(options) {
      let title
      for(let i=0;i<this.park[options.model].length;i++) {
        if(this.park[options.model][i]._id == options.id) {
          title = this.park[options.model][i].name
          this.park[options.model].splice(i, 1)
          break
        }
      }

      let update = []
      this.park[options.model].forEach(m => {
        update.push(m._id)
      })

      API.put(this.apiURL(), { [options.model]: update }).then((park) => {
        this.park.status = park.status
        this.$notify('notifications', `${title} removed from park`, 'success')
      }).catch(() => {
        this.$notify('notifications', 'There was a problem removing that from the park', 'error')
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
        this.$notify('notifications', err.response.data.message || 'Could not link to Workshop', 'error')
      })
    },
    addPhoto(newMedia) {
      this.park.media.push(newMedia)

      let media = []
      this.park.media.forEach((m) => {
        media.push(m._id)
      })

      API.put(this.apiURL(), { media }).then((park) => {
        this.park.status = park.status
        this.$notify('notifications', 'Photo added', 'success')
      }).catch(() => {
        
      })
    },
    addMap(newMedia) {
      this.park.map.media = newMedia

      API.put(this.apiURL(), { map: { media: newMedia._id }}).then((park) => {
        this.park.status = park.status
        this.$notify('notifications', 'Map added', 'success')
      }).catch(() => {
        
      })
    },
    removePhoto(key) {
      this.park.media.splice(key, 1)

      let media = []
      this.park.media.forEach((m) => {
        media.push(m._id)
      })

      API.put(this.apiURL(), { media }).then((park) => {
        this.park.status = park.status
        this.$notify('notifications', 'Photo removed', 'success')
      }).catch(() => {
        this.$notify('notifications', 'There was a problem removing that photo', 'error')
      })
    },
    removeMap() {
      this.park.map.media = ''

      API.put(this.apiURL(), { map: { media: null }}).then((park) => {
        this.park.status = park.status
        this.$notify('notifications', 'Map removed', 'success')
      }).catch(() => {
        this.$notify('notifications', 'There was a problem removing that map', 'error')
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
        this.shareURL = `https://planco.world/parks/${this.park.slug}`
        this.loading = false

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
      
      delete data.map.media

      let tags = []
      this.park.tags.forEach((t) => {
        tags.push(t._id)
      })
      data.tags = tags

      return API.put(this.apiURL(), data).then((park) => {
        this.$notify('notifications', 'Your park has been saved', 'success')
        return this.getPark()
      })
    },
    deletePark() {
      API.delete(this.apiURL(true)).then(response => {
        this.$notify('notifications', `${this.park.name} has been deleted.`, 'success')
        this.$router.push({ name: 'Parks' })
      }).catch(err => {
        this.$notify('notifications', 'There was a problem deleting your park.', 'error')
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
    updateScenario(scenario) {
      this.park.scenario = Object.assign({}, this.park.scenario, scenario)
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
