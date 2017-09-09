<template>
  <div>
  <section class="hero hero--tall" :style="{ backgroundImage: `url('${park.media.length > 0 ? park.media[0].url : '' }')` }">
    <div class="hero-meta">
      <div class="container">
        <Upload @uploaded="addPhoto" folder="parks" :instant="true" :isDark="true" instructions="Drop your park photos here, or click to browse your computer" v-if="park && isOwner() && editMode"></Upload>
        <Filters :options="heroFilterOptions" :inline="true" :readOnly="true" :large="true" ref="heroTags"></Filters>
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
  <main class="content container">

    <!-- <section class="notification is-warning" v-if="!loading && !park.steam_id" v-cloak>
      <span class="icon"><i class="fas fa-exclamation-circle"></i></span>&nbsp;
      <span>This Park will not be visible to the community until you link it to a Steam Workshop item.</span>
    </section> -->

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

    <div class="columns">
      <div class="column is-one-quarter">
        <ColorPalette v-model="park.colors" :editMode="editMode"></ColorPalette>

        <Filters :options="filterOptions" :readOnly="!editMode" ref="tags"></Filters>
      </div>

      <div class="column">

        <section class="box park-description">
          <div class="park-description-editor editor" v-if="editMode" v-html="park.description"></div>
          <div class="park-description-content" v-show="!editMode" v-html="park.description"></div>
        </section>




        <div class="level">
          <div class="level-left">
            <h3 class="ui header level-item">Billboards <a class="is-text" v-tooltip="'Be sure to place in My Documents\\Frontier Developments\\Planet Coaster\\UserMedia'">Download All ({{ park.billboards.length }})</a></h3>
          </div>
          <div class="level-right">
            <a @click="" class="button level-item is-white is-medium"><span class="icon"><i class="fas fa-paint-brush has-text-primary"></i></span> <span>Generator</span></a>
            <a @click="openModal('addBillboard')" class="button level-item is-white is-medium"><span class="icon"><i class="fas fa-plus has-text-primary"></i></span> <span>Add Billboard</span></a>
          </div>
        </div>
        <Billboard :model="billboard" :key="billboard._id" v-for="billboard in park.billboards"></Billboard>

        <Modal :class="{ 'addBillboard': true }" @close="closeModal('addBillboard')" :show="modalOpen('addBillboard')">
          <div class="form">
            <div class="field">
              <div class="control has-icons-left">
                <input type="text" class="input is-medium" placeholder="Search for a Billboard" />
                <span class="icon icon-left"><i class="fas fa-search"></i></span>
              </div>
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
            <a @click="notify()" class="button is-white is-medium">Yo</a>
            <a @click="openModal('addBlueprint')" class="button is-white is-medium"><span class="icon"><i class="fas fa-plus has-text-primary"></i></span> <span>Add Blueprint</span></a>
          </div>
        </div>
        <Blueprint :model="blueprint" :key="blueprint._id" v-for="blueprint in park.blueprints"></Blueprint>

        <Modal :class="{ 'addBlueprint': true }" @close="closeModal('addBlueprint')" :show="modalOpen('addBlueprint')">
          <div class="form">
            <div class="field">
              <div class="control has-icons-left">
                <input type="text" class="input is-medium" placeholder="Search for a Blueprint" />
                <span class="icon icon-left"><i class="fas fa-search"></i></span>
              </div>
            </div>
            <div class="field">
              <a class="button is-primary is-medium">Add to Park</a>
            </div>
          </div>
        </Modal>

      </div>
    </div>



  </main>
  </div>
</template>

<script>
import Filters from '@/components/ui/Filters'
import Upload from '@/components/ui/Upload'
import SaveToToolbox from '@/components/ui/SaveToToolbox'
import ColorPalette from '@/components/ui/ColorPalette'
import Modal from '@/components/ui/Modal'
import Dropdown from '@/components/ui/Dropdown'
import Blueprint from '@/components/cards/Blueprint'
import Billboard from '@/components/Billboards/Card'
import API from '@/services/api'
import auth from '@/services/auth'
import { store } from '@/store.js'

import Quill from 'quill'

export default {
  name: 'parks',
  store,
  components: {
    Filters,
    Upload,
    SaveToToolbox,
    ColorPalette,
    Dropdown,
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
        addBillboard: {
          show: false
        },
        addBlueprint: {
          show: false
        }
      },
      editor: false,
      park: {
        media: [ { url: '' } ],
        billboards: [],
        shops: [],
        attractions: []
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
        'construction-kits': {
          label: 'Construction Kits',
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
        },
        'requirements': {
          label: 'Requirements',
          type: 'list',
          readOnly: 'checklist'
        }
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
    toggleEditMode(e) {
      if(e) e.preventDefault()
      this.editMode = this.editMode ? false : true
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
      this.toggleEditMode()
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
    copy() {
      this.$clipboard(this.shareURL)
      this.$notify('notifications', 'Park URL Copied', 'success')
    }
  },
  created () {
    this.getPark()
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
