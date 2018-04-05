<template>
  <div>
  <section class="hero hero--tall" :style="{ backgroundImage: `url('${kit.media.length > 0 ? kit.media[0].url : '' }')` }">
    <div class="hero-meta">
      <div class="container">
        <div class="level">
          <div class="level-left">
            
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
          <h1 class="title level-item"><router-link :to="{ name: 'Kits' }">Kits</router-link></h1>
          <h2 class="title level-item"> / {{ kit.name ? kit.name : '' | truncate(45) }}</h2>
        </div>
        <div class="level-right">
          <button class="button level-item is-medium is-dark" @click="copy" v-tooltip="{ content: 'Copy Kit URL'  }"><span class="icon"><i class="fas fa-link"></i></span></button>

          <div class="field level-item has-addons" v-if="isOwner()">
            <div class="control"><a @click="toggleEditMode" class="button is-warning is-medium construction">Edit</a></div>
            <div class="control"><a @click="updateKit()" class="button is-light is-medium" v-if="editMode">Save</a></div>
            <div class="control">
              <div class="button is-white is-medium" @click="toggleStatus()" v-tooltip="{ content: statusTooltip }">
                <div class="switch" :class="{ 'is-active': kit.status }">
                  <label></label>
                </div>
              </div>
            </div>
          </div>

          <SaveToToolbox model="kits" :data="kit" v-if="!isOwner()"></SaveToToolbox>
        </div>
      </div>
    </div>
  </section>

  <main class="content container">
    <div class="columns">
      <div class="column is-one-quarter">
        <div class="box kit-info">
          <Creator :user="kit.user"></Creator>
          <hr />
          <ReactionMeter :reactions="kit.reactions" />
          <Reaction :model="kit" :reactOnly="true" @reacted="kit.reactions = $event" />
        </div>

        <Filters class="field" :selected="kit.tags" @selected="kit.tags = $event" :options="filterOptions" :readOnly="!editMode" ref="tags"></Filters>

        <!-- <a href="#" class="button is-white is-fluid field">Report Kit</a> -->


        <a @click="openModal('deleteKit')" class="button is-warning is-fluid" v-if="editMode">Delete Kit</a>

        <Modal :class="['deleteKit']" @close="closeModal('deleteKit')" :show="modalOpen('deleteKit')">
          <p><strong>Are you sure you want to delete {{ kit.name }}?</strong> This cannot be undone. Your media will still be available in the toolbox.</p>

          <a @click="deleteKit()" class="button is-warning">Delete</a>
          <a @click="closeModal('deleteKit')" class="button is-light">Cancel</a>
        </Modal>

      </div>

      <div class="column">

        <section class="box kit-description">
          <div class="kit-description-editor editor" v-if="editMode" v-html="kit.description"></div>
          <div class="kit-description-content" v-show="!editMode" v-html="kit.description"></div>
        </section>


        <div v-if="kit.billboards.length > 0 || editMode">
          <div class="level" id="billboards">
            <div class="level-left">
              <h3 class="level-item"><i class="fas fa-sign"></i>&nbsp; Billboards</h3>
              <!-- <div class="level-item"><a @click="openModal('downloadBillboards')" class="is-text">Download All ({{ kit.billboards.length }})</a></div> -->
            </div>
            <div class="level-right">
              <!-- <router-link :to="{ name: 'Generator' }" class="button level-item is-white is-medium"><span class="icon"><i class="fas fa-paint-brush has-text-primary"></i></span> <span>Generator</span></router-link> -->
              <a @click="openModal('addBillboard')" class="button level-item is-white is-medium" v-if="editMode"><span class="icon"><i class="fas fa-plus has-text-primary"></i></span> <span>Add Billboard</span></a>
            </div>
          </div>

          <div class="columns cards is-multiline loader--parent push-down-single">
            <Billboard :model="billboard" @remove="removeFromKit" :editMode="editMode" :key="billboard._id" v-for="billboard in kit.billboards"></Billboard>
          </div>
        </div>

        <Modal :class="{ 'downloadBillboards': true }" @close="closeModal('downloadBillboards')" :show="modalOpen('downloadBillboards')">
          <p>Be sure to place in Documents\Frontier Developments\Planet Coaster\UserMedia</p>
        </Modal>

        <Modal :class="{ 'addBillboard': true }" @close="closeModal('addBillboard')" :show="modalOpen('addBillboard')">
          <div class="form">
            <div class="field">
              <Search @selected="addToKit($event, 'addBillboard')" placeholder="Search for Billboards" :models="['billboards']"></Search>
            </div>
            <div class="field">
              <a class="button is-primary is-medium">Add to Kit</a>
            </div>
          </div>
        </Modal>

        <div v-if="kit.blueprints.length > 0 || editMode">
          <div class="level">
            <div class="level-left">
              <h3 class="ui header level-item"><i class="fas fa-box-open"></i>&nbsp; Blueprints</h3>
            </div>
            <div class="level-right">
              <a @click="openModal('addBlueprint')" class="button is-white is-medium" v-if="editMode"><span class="icon"><i class="fas fa-plus has-text-primary"></i></span> <span>Add Blueprint</span></a>
            </div>
          </div>

          <div class="columns cards is-multiline loader--parent push-down-single">
            <Blueprint :model="blueprint" @remove="removeFromKit" :editMode="editMode" :key="blueprint._id" v-for="blueprint in kit.blueprints"></Blueprint>
          </div>
        </div>

        <Modal :class="{ 'addBlueprint': true }" @close="closeModal('addBlueprint')" :show="modalOpen('addBlueprint')">
          <div class="form">
            <div class="field">
              <Search @selected="addToKit($event, 'addBlueprint')" placeholder="Search for Blueprints" :models="['blueprints']"></Search>
            </div>
            <div class="field">
              <a class="button is-primary is-medium">Add to Kit</a>
            </div>
          </div>
        </Modal>

        <div v-if="kit.parks.length > 0 || editMode">
          <div class="level">
            <div class="level-left">
              <h3 class="ui header level-item"><i class="fab fa-fort-awesome"></i>&nbsp; Parks</h3>
            </div>
            <div class="level-right">
              <a @click="openModal('addPark')" class="button is-white is-medium" v-if="editMode"><span class="icon"><i class="fas fa-plus has-text-primary"></i></span> <span>Add Park</span></a>
            </div>
          </div>

          <div class="columns cards is-multiline loader--parent">
            <Park :model="park" :key="park._id" v-for="park in kit.parks"></Park>
          </div>
        </div>

        <Modal :class="{ 'addPark': true }" @close="closeModal('addPark')" :show="modalOpen('addPark')">
          <div class="form">
            <div class="field">
              <Search @selected="addToKit($event, 'addPark')" placeholder="Search for Parks" :models="['parks']"></Search>
            </div>
            <div class="field">
              <a class="button is-primary is-medium">Add to Kit</a>
            </div>
          </div>
        </Modal>

      </div>
    </div>

    <Modal :class="{ 'uploadPhotos': true }" @close="closeModal('uploadPhotos')" :show="modalOpen('uploadPhotos')">
      <div class="kit-media">
        <div class="kit-photo level" :key="media._id" v-for="(media, key) in kit.media">
          <div class="level-item">
            <img :src="media.url" class="is-64h" />
            <div class="tag is-rounded" v-if="key == 0">Cover Photo</div>
          </div>
        </div>
      </div>
      <Upload @uploaded="addPhoto" folder="kits" instructions="Drop your kit photos here, or click to browse your computer" v-if="kit && isOwner() && editMode"></Upload>
    </Modal>

  </main>
  </div>
</template>

<script>
import Search from '@/components/ui/Search'
import Filters from '@/components/ui/Filters'
import Upload from '@/components/ui/Upload'
import SaveToToolbox from '@/components/ui/SaveToToolbox'
import Reaction from '@/components/ui/Reaction'
import ReactionMeter from '@/components/ui/ReactionMeter'
import Modal from '@/components/ui/Modal'
import Dropdown from '@/components/ui/Dropdown'
import Creator from '@/components/ui/ProfileMini'
import Blueprint from '@/components/Blueprints/Card'
import Billboard from '@/components/Billboards/Card'
import Park from '@/components/Parks/Card'
import API from '@/services/api'
import auth from '@/services/auth'
import { store } from '@/store.js'

import Quill from 'quill'
import SmoothScroll from 'smooth-scroll'

export default {
  name: 'kits',
  store,
  components: {
    Search,
    Filters,
    Upload,
    SaveToToolbox,
    ReactionMeter,
    Reaction,
    Dropdown,
    Creator,
    Blueprint,
    Billboard,
    Park,
    auth,
    Modal
  },
  metaInfo() {
    return {
      title: this.kit.name,
      titleTemplate: '%s • Kits • PlanCoWorld'
    }
  },
  data () {
    return {
      loading: true,
      editMode: false,
      shareURL: '',
      modals: {
        uploadPhotos: {
          show: false,
          loading: false
        },
        addBillboard: {
          show: false,
          loading: false
        },
        addPark: {
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
        deleteKit: {
          show: false,
          loading: false
        }
      },
      editor: false,
      kit: {
        media: [ { url: '' } ],
        billboards: [],
        blueprints: [],
        parks: [],
      },
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
  watch: {
    '$route': 'getKit'
  },
  computed: {
    statusTooltip () {
      if(this.kit.status) return 'Open to the Public'
      return 'Closed to the Public'
    }
  },
  methods: {
    notify() {
      this.$notify('notifications', 'Your Kit has been saved', '')
    },
    isOwner() {
      return auth.isOwner(this.kit)
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
    addToKit(match, modal) {
      console.log(match, modal)
      this.modals[modal].loading = true

      let plural = match._source.type+'s'
      let model = this.kit[plural]
      let data = {}

      data[plural] = [match._id]
      model.forEach((m) => {
        data[plural].push(m._id)
      })

      console.log('putting', data)
      API.put(this.apiURL(), data).then(() => {
        return this.getKit()
      }).then(() => {
        this.closeModal(modal)
        this.modals[modal].loading = false
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
      API.post(this.apiURL()+'/link', { url: this.modals.linkToWorkshop.url }).then((kit) => {
        this.$notify('notifications', 'Kit linked to workshop', 'success')
        this.modals.linkToWorkshop.show = false
        this.kit.steam_id = kit.steam_id
      }).catch((err) => {
        this.$notify('notifications', 'Could not link to Workshop', 'error')
        console.log(err)
      })
    },
    addPhoto(newMedia) {
      console.log('adding', media)
      this.kit.media.push(newMedia)

      let media = []
      this.kit.media.forEach((m) => {
        media.push(m._id)
      })

      API.put(this.apiURL(), { media }).then((kit) => {
        this.kit.status = kit.status
      }).catch(() => {
        this.kit.status = status
      })
    },
    toggleStatus() {
      let status = this.kit.status
      let newStatus = status ? false : true
      API.put(this.apiURL(), { status: newStatus }).then((kit) => {
        this.kit.status = kit.status
      }).catch(() => {
        this.kit.status = status
      })
      this.kit.status = newStatus
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
          this.getKit()
        })

      }
    },
    getKit() {
      this.loading = true

      API.fetch(this.apiURL(false)).then((kit) => {
        this.kit = kit
        this.shareURL = `https://planco.world/kits/${this.kit.slug}`
        this.loading = false
        this.editMode = false
        this.$refs.heroTags.setPopulated(this.kit.tags)
        this.$refs.tags.setPopulated(this.kit.tags)

      }).catch((err) => {
        API.handleError(err, 'kits')
      })
    },
    updateKit() {
      this.toggleEditMode(false)
      this.loading = true
      let data = this.kit

      let media = []
      this.kit.media.forEach((m) => {
        media.push(m._id)
      })
      data.media = media
      data.user = data.user._id
      data.description = this.editor.container.firstChild.innerHTML
      data.tags = this.$refs.tags.selected

      return API.put(this.apiURL(), data).then((kit) => {
        this.$notify('notifications', 'Your Kit has been saved', 'success')
        return this.getKit()
      })
    },
    deleteKit() {
      API.delete(this.apiURL(true)).then(response => {
        this.$notify('notifications', `${this.kit.name} has been deleted.`, 'success')
        this.$router.push({ name: 'Kits' })
      }).catch(err => {
        this.$notify('notifications', 'There was a problem deleting your kit.', 'error')
      })
    },
    apiURL(force = true) {
      if(this.kit._id && force) {
        return `kits/${this.kit._id}`
      }

      let ID = this.$route.params.id
      let SLUG = this.$route.params.slug
      let url

      if(ID) {
        url = `kits/${ID}`
      } else if(SLUG) {
        url = `kits/slug/${SLUG}`
      }
      return url
    },
    removeFromKit(options) {
      let title
      for(let i=0;i<this.kit[options.model].length;i++) {
        if(this.kit[options.model][i]._id == options.id) {
          title = this.kit[options.model][i].name
          this.kit[options.model].splice(i, 1)
          break
        }
      }

      let update = []
      this.kit[options.model].forEach(m => {
        update.push(m._id)
      })

      API.put(this.apiURL(), { [options.model]: update }).then((kit) => {
        this.kit.status = kit.status
        this.$notify('notifications', `${title} removed from kit`, 'success')
      }).catch(() => {
        this.$notify('notifications', 'There was a problem removing that from the kit', 'error')
      })
    },
    attachEditor() {
      let wrapper = this.$el.querySelector('.kit-description-editor')
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
      if(typeof this.kit.tags !== 'undefined') {
        return this.kit.tags.filter(t => {
          return t.slug == slug
        })
      }

      return false
    },
    copy() {
      this.$clipboard(this.shareURL)
      this.$notify('notifications', 'Kit URL Copied', 'success')
    }
  },
  created () {
    this.getKit()
  },
  mounted () {
    new SmoothScroll('a[data-scroll]')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  
</style>
