<template>
  <div>
  <section class="hero hero--tall" :style="{ backgroundImage: `url('${blueprint.media.length > 0 ? blueprint.media[0].url : '' }')` }">
    <div class="hero-meta">
      <div class="container">
        <div class="level">
          <div class="level-left">
            <div class="tag is-primary is-rounded is-large level-item" v-if="isBuilding()">Building</div>
            <div class="tag is-primary is-rounded is-large level-item" v-if="isScenery()">Scenery</div>
            <div class="tags selected-tags level-item">
              <a v-if="blueprint.billboards.length > 0" href="#billboards" class="tag is-rounded is-white is-large" data-scroll v-tooltip="'Download the custom Billboards for the best experience'"><span class="icon"><i class="fas fa-exclamation"></i></span> <span>Billboards</span></a>
            </div>
          </div>
          <div class="level-right">
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
          <h1 class="title level-item"><router-link :to="{ name: 'Blueprints' }">Blueprints</router-link></h1>
          <h2 class="title level-item"> / {{ blueprint.name ? blueprint.name : '' | truncate(45) }}</h2>
        </div>
        <div class="level-right">
          <button class="button level-item is-medium is-dark" @click="copy" v-tooltip="{ content: 'Copy Blueprint URL'  }"><span class="icon"><i class="fas fa-link"></i></span></button>

          <a v-if="blueprint.steam_id" :href="'http://steamcommunity.com/sharedfiles/filedetails/?id='+blueprint.steam_id" target="_blank" class="button  level-item is-medium is-primary"><span class="icon"><i class="fab fa-steam"></i></span> <span>Subscribe on Steam</span></a>
          <a v-if="!blueprint.steam_id && isOwner()" @click="openModal('linkToWorkshop')" class="button level-item is-medium is-primary"><span class="icon"><i class="fas fa-exclamation-circle"></i></span> <span>Link to Workshop</span></a>

          <div class="field level-item has-addons" v-if="isOwner()">
            <div class="control"><a @click="toggleEditMode" class="button is-warning is-medium construction">Edit</a></div>
            <div class="control"><a @click="updateBlueprint()" class="button is-light is-medium" v-if="editMode">Save</a></div>
            <div class="control">
              <div class="button is-white is-medium" @click="toggleStatus()" v-tooltip="{ content: statusTooltip }">
                <div class="switch" :class="{ 'is-active': blueprint.status && blueprint.steam_id, 'is-warning': !blueprint.steam_id }">
                  <label></label>
                </div>
              </div>
            </div>
          </div>

          <SaveToToolbox model="blueprints" :data="blueprint" v-if="!isOwner()"></SaveToToolbox>
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
        <div class="box blueprint-info">
          <Creator :user="blueprint.user"></Creator>

          <hr />

          <ReactionMeter />
        </div>

        <div class="box" v-if="blueprint.colors.length > 0 || editMode">
          <ColorPalette v-model="blueprint.colors" :editMode="editMode"></ColorPalette>
        </div>

        <Filters class="field" :selected="blueprint.tags" @selected="blueprint.tags = $event" :options="filterOptions" :readOnly="!editMode" ref="tags"></Filters>

        <!-- <a href="#" class="button is-white is-fluid field">Report Blueprint</a> -->

        <a @click="openModal('delete')" class="button is-warning is-fluid" v-if="editMode">Delete Blueprint</a>

        <Modal :class="['deleteBlueprint']" :show="modalOpen('delete')">
          <p><strong>Are you sure you want to delete {{ blueprint.name }}?</strong> This cannot be undone. Your media will still be available in the toolbox.</p>

          <a @click="deleteBlueprint()" class="button is-warning">Delete</a>
          <a @click="closeModal('delete')" class="button is-light">Cancel</a>
        </Modal>

      </div>

      <div class="column">

        <section class="box blueprint-description">
          <div class="blueprint-description-editor editor" v-if="editMode" v-html="blueprint.description"></div>
          <div class="blueprint-description-content" v-show="!editMode" v-html="blueprint.description"></div>
        </section>

        <section class="box blueprint-stats">
            <div class="level">
                <div class="level-left">
                  <h5 class="title is-5">Ride Stats</h5>
                </div>
                <div class="level-right">
                  
                </div>
              </div>
              <div class="columns blueprint-stats">
                <div class="column">
                  <label class="label">Duration</label>
                  <div class="field has-addons">
                    <div class="control">
                      <input type="number" class="input" v-model="blueprint.stats.duration" />
                    </div>
                    <div class="control">
                      <div class="button is-static">seconds</div>
                    </div>
                  </div>
                </div>
                <div class="column">
                  <label class="label">Length</label>
                  <div class="field has-addons">
                    <div class="control">
                      <input type="number" class="input" v-model="blueprint.stats.length" />
                    </div>
                    <div class="control">
                      <div class="button is-static" v-if="isImperial()">feet</div>
                      <div class="button is-static" v-else>meters</div>
                    </div>
                  </div>
                </div>
                <div class="column">
                  <label class="label">Max Speed</label>
                  <div class="field has-addons">
                    <div class="control">
                      <input type="number" max="149" class="input" v-model="blueprint.stats.maxSpeed" />
                    </div>
                    <div class="control">
                      <div class="button is-static" v-if="isImperial()">mph</div>
                      <div class="button is-static" v-else>kmh</div>
                    </div>
                  </div>
                </div>
                <div class="column">
                  <label class="label">Average Speed</label>
                  <div class="field has-addons">
                    <div class="control">
                      <input type="number" max="149" class="input" v-model="blueprint.stats.avgSpeed" />
                    </div>
                    <div class="control">
                      <div class="button is-static" v-if="isImperial()">mph</div>
                      <div class="button is-static" v-else>kmh</div>
                    </div>
                  </div>
                </div>
                
              </div>
              <div class="columns blueprint-stats">
                <div class="column">
                  <label class="label">Biggest Drop</label>
                  <div class="field has-addons">
                    <div class="blueprints-stats-value" v-html="blueprint.stats.biggestDrop || 'N/A'" v-if="!editMode"></div>
                    <div class="control" v-if="editMode">
                      <input type="number" class="input" v-model="blueprint.stats.biggestDrop" />
                    </div>
                    <div class="control" v-if="editMode">
                      <div class="button is-static" v-if="isImperial()">feet</div>
                      <div class="button is-static" v-else>meters</div>
                    </div>
                  </div>
                </div>
                <div class="column">
                  <label class="label">Number of Inversions</label>
                  <div class="field">
                    <div class="blueprints-stats-value" v-html="blueprint.stats.inversions || 0" v-if="!editMode"></div>
                    <div class="control" v-if="editMode">
                      <input type="number" class="input" v-model="blueprint.stats.inversions" />
                    </div>
                  </div>
                </div>
                <div class="column">
                  <label class="label">Airtime Count</label>
                  <div class="field">
                    <div class="control">
                      <input type="number" class="input" v-model="blueprint.stats.airtimeCount" />
                    </div>
                  </div>
                </div>
                <div class="column">
                  <label class="label">Total Airtime Duration</label>
                  <div class="field has-addons">
                    <div class="control">
                      <input type="number" class="input" v-model="blueprint.stats.airtimeDuration " />
                    </div>
                    <div class="control">
                      <div class="button is-static">seconds</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="columns blueprint-stats">
                <div class="column">
                  <label class="label">Max Lateral G</label>
                  <div class="field">
                    <div class="control">
                      <input type="number" max="5" min="-5" step="0.01" class="input" v-model="blueprint.stats.maxLateralG" />
                    </div>
                  </div>
                </div>
                <div class="column">
                  <label class="label">Max Vertical G</label>
                  <div class="field">
                    <div class="control">
                      <input type="number" max="5" min="-5" step="0.01" class="input" v-model="blueprint.stats.maxVerticalG" />
                    </div>
                  </div>
                </div>
                <div class="column">
                  <label class="label">Min Vertical G</label>
                  <div class="field">
                    <div class="control">
                      <input type="number" max="5" min="-5" step="0.01" class="input" v-model="blueprint.stats.minVerticalG" />
                    </div>
                  </div>
                </div>
                <div class="column">
                  <label class="label">Max Foward G</label>
                  <div class="field">
                    <div class="control">
                      <input type="number" max="5" min="-5" step="0.01" class="input" v-model="blueprint.stats.maxForwardG" />
                    </div>
                  </div>
                </div>
                <div class="column">
                  <label class="label">Min Forward G</label>
                  <div class="field">
                    <div class="control">
                      <input type="number" max="5" min="-5" step="0.01" class="input" v-model="blueprint.stats.minForwardG" />
                    </div>
                  </div>
                </div>
              </div> 
        </section>


        <div class="level" id="billboards">
          <div class="level-left">
            <h3 class="ui header level-item">Billboards</h3>
          </div>
          <div class="level-right">
            <!-- <router-link :to="{ name: 'Generator' }" class="button level-item is-white is-medium"><span class="icon"><i class="fas fa-paint-brush has-text-primary"></i></span> <span>Generator</span></router-link> -->
            <a @click="openModal('addBillboard')" class="button level-item is-white is-medium" v-if="editMode"><span class="icon"><i class="fas fa-plus has-text-primary"></i></span> <span>Add Billboard</span></a>
          </div>
        </div>

        <div class="columns card is-multiline">
          <Billboard :model="billboard" :key="billboard._id" v-for="billboard in blueprint.billboards"></Billboard>
        </div>

        <Modal :class="{ 'downloadBillboards': true }" @close="closeModal('downloadBillboards')" :show="modalOpen('downloadBillboards')">
          <p>Be sure to place in Documents\Frontier Developments\Planet Coaster\UserMedia</p>
        </Modal>

        <Modal :class="{ 'addBillboard': true }" @close="closeModal('addBillboard')" :show="modalOpen('addBillboard')">
          <div class="form">
            <div class="field">
              <Search @selected="addToBlueprint($event, 'addBillboard')" placeholder="Search for Billboards" :models="['billboards']"></Search>
            </div>
            <div class="field">
              <a class="button is-primary is-medium">Add to Blueprint</a>
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

        <div class="columns card is-multiline">
          <Blueprint :model="blueprint" :key="blueprint._id" v-for="blueprint in blueprint.blueprints"></Blueprint>
        </div>

        <Modal :class="{ 'addBlueprint': true }" @close="closeModal('addBlueprint')" :show="modalOpen('addBlueprint')">
          <div class="form">
            <div class="field">
              <Search @selected="addToBlueprint($event, 'addBlueprint')" placeholder="Search for Blueprints" :models="['blueprints']"></Search>
            </div>
            <div class="field">
              <a class="button is-primary is-medium">Add to Blueprint</a>
            </div>
          </div>
        </Modal>

      </div>
    </div>

    <Modal :class="{ 'uploadPhotos': true }" @close="closeModal('uploadPhotos')" :show="modalOpen('uploadPhotos')">
      <Upload @uploaded="addPhoto" folder="blueprints" instructions="Drop your blueprint photos here, or click to browse your computer" v-if="blueprint && isOwner() && editMode"></Upload>
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
  name: 'blueprints',
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
  metaInfo() {
    return {
      title: this.blueprint.name,
      titleTemplate: '%s • Blueprints • PlanCoWorld'
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
        delete: {
          show: false,
          loading: false
        }
      },
      editor: false,
      blueprint: {
        media: [ { url: '' } ],
        billboards: [],
        shops: [],
        attractions: [],
        tags: [],
        colors: [],
        stats: {},
      },
      filterOptions: {
        'buildings': {
          label: 'Buildings',
          type: 'list',
          visible: true,
          guide: 'buildings',
        },
        'scenery': {
          label: 'Scenery',
          type: 'list',
          visible: true,
          guide: 'scenery',
        },
        'age-groups': {
          label: 'Age Groups',
          type: 'toggle',
          visible: true,
          guide: 'guests',
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
          type: 'list',
          guide: 'shops-and-facilities'
        },
        'facilities': {
          label: 'Facilities & Utilities',
          type: 'list',
          guide: 'shops-and-facilities'
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
          type: 'list',
          guide: 'coasters',
        },
        'rides': {
          label: 'Rides',
          type: 'list',
          guide: 'flat-rides'
        },
        'regions': {
          label: 'Biomes',
          type: 'list',
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
    notify() {
      this.$notify('notifications', 'Your Blueprint has been saved', '')
    },
    isBuilding() {
      return this.blueprint.tags.filter(t => {
        return t._id == '597cfc8c23e62646b0c8f7a7'
      }).length > 0
    },
    isScenery() {
      return this.blueprint.tags.filter(t => {
        return t._id == '5a442a25c42b1d290831e007'
      }).length > 0
    },
    isOwner() {
      return auth.isOwner(this.blueprint)
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
    addToBlueprint(match, modal) {
      this.modals[modal].loading = true

      let plural = match._type+'s'
      let model = this.blueprint[plural]
      let data = {}

      data[plural] = [match._id]
      model.forEach((m) => {
        data[plural].push(m._id)
      })

      console.log('putting', data)
      API.put(this.apiURL(), data).then(() => {
        return this.getBlueprint()
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
      API.post(this.apiURL()+'/link', { url: this.modals.linkToWorkshop.url }).then((blueprint) => {
        this.$notify('notifications', 'Blueprint linked to workshop', 'success')
        this.modals.linkToWorkshop.show = false
        this.blueprint.steam_id = blueprint.steam_id
      }).catch((err) => {
        this.$notify('notifications', 'Could not link to Workshop', 'error')
        console.log(err)
      })
    },
    addPhoto(newMedia) {
      console.log('adding', media)
      this.blueprint.media.push(newMedia)

      let media = []
      this.blueprint.media.forEach((m) => {
        media.push(m._id)
      })

      API.put(this.apiURL(), { media }).then((blueprint) => {
        this.blueprint.status = blueprint.status
      }).catch(() => {
        this.blueprint.status = status
      })
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
          this.getBlueprint()
        })

      }
    },
    getBlueprint() {
      this.loading = true

      API.fetch(this.apiURL(false)).then((blueprint) => {
        this.blueprint = Object.assign({}, this.blueprint, blueprint)
        this.shareURL = `http://planco.world/blueprints/${this.blueprint.slug}`
        this.loading = false
        this.editMode = false

      }).catch((err) => {
        API.handleError(err, 'blueprints')
      })
    },
    updateBlueprint() {
      this.toggleEditMode(false)
      this.loading = true
      let data = this.blueprint

      let media = []
      this.blueprint.media.forEach((m) => {
        media.push(m._id)
      })
      data.media = media
      data.user = data.user._id
      data.description = this.editor.container.firstChild.innerHTML
      
      let tags = []
      this.blueprint.tags.forEach((t) => {
        tags.push(t._id)
      })
      data.tags = tags

      return API.put(this.apiURL(), data).then((blueprint) => {
        this.$notify('notifications', 'Your Blueprint has been saved', 'success')
        return this.getBlueprint()
      })
    },
    deleteBlueprint() {
      API.delete(this.apiURL(true)).then(response => {
        console.log(response)
        this.$notify('notifications', `${this.blueprint.name} has been deleted.`, 'success')
        this.$router.push({ name: 'Blueprints' })
      }).catch(err => {
        console.log(err)
        this.$notify('notifications', 'There was a problem deleting your blueprint.', 'error')
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
    attachEditor() {
      let wrapper = this.$el.querySelector('.blueprint-description-editor')
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
    isImperial() {
      return this.$store.state.measurements == 'imperial'
    },
    copy() {
      this.$clipboard(this.shareURL)
      this.$notify('notifications', 'Blueprint URL Copied', 'success')
    }
  },
  created () {
    this.getBlueprint()
  },
  mounted () {
    new SmoothScroll('a[data-scroll]')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  
</style>
