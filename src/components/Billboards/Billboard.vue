<template>
  <article :class="['billboard', {'is-vertical': isVertical }]" @click="open = false">
    <section class="hero hero--tall">
      <img :src="billboard.media[0].url" v-if="billboard.media.length > 0 && billboard.media[0].type == 'image'" class="cover-photo" />
      <video class="cover-photo" muted autoplay loop>
        <source :src="billboard.media[0].url" v-if="billboard.media.length > 0 && billboard.media[0].type == 'video'">
      </video>
    </section>
    <section class="hero">
      <div class="container">
        <div class="level">
          <div class="level-left">
              <Filters :options="heroFilterOptions" :selected="billboard.tags" :inline="true" :readOnly="true" :large="true" ref="heroTags" class="level-item"></Filters>
          </div>
          <div class="level-right">
              <span class="level-item tag is-large is-rounded" v-if="billboard.media.length > 0 && billboard.media[0].type == 'video' && billboard.media[0].meta.duration" title="Duration" v-tooltip="'Duration'"><i class="fas fa-forward"></i>&nbsp; {{ billboard.media[0].meta.duration }}s</span>
              <span class="level-item tag is-large is-rounded" v-if="billboard.media.length > 0 && billboard.media[0].size" title="File Size" v-tooltip="'File Size'"><i class="fas fa-hdd"></i>&nbsp; {{ size(billboard.media[0].size) }}</span>
          </div>
        </div>
      </div>
    </section>
    <section class="hero">
      <div class="container">
        <div class="level is-mobile">
          <div class="level-left">
            <h1 class="title level-item"><router-link :to="{ name: 'Billboards' }">Billboard</router-link></h1>
            <h2 class="title level-item"> / {{ billboard.name }}</h2>
          </div>
          <div class="level-right">
            <button class="button level-item is-medium is-dark" @click="copy" v-tooltip="{ content: 'Copy Billboard URL'  }"><span class="icon"><i class="fas fa-link"></i></span></button>

            <div class="field level-item has-addons">
              <div class="control"><button class="button is-primary is-medium level-item" :class="{ 'is-loading': downloading }" @click="downloadBillboard(billboard.media[0]._id)" v-tooltip="downloads+' Downloads'" :disabled="!billboard.media"><span class="icon"><i class="fas fa-cloud-download"></i></span> <span>Download</span></button></div>
              <div class="control">
                <div class="dropdown is-right" :class="{ 'is-active': open }" @click.stop>
                  <div class="dropdown-trigger" @click="open = open ? false : true">
                    <button class="button is-primary is-medium" aria-haspopup="true" aria-controls="dropdown-menu">
                      <i class="fas fa-caret-down"></i>
                    </button>
                  </div>
                  <div class="dropdown-menu" id="dropdown-menu" role="menu">
                    <div class="dropdown-content">
                      <a class="dropdown-item" v-if="billboard.media.length > 0"><strong>{{ billboard.media[0].name }}</strong></a>
                      <div v-if="billboard.source.length > 0">
                      <hr class="dropdown-divider">
                      <div class="dropdown-item">
                        <p class="has-text-grey-light is-size-7">{{ billboard.user.name.display }} has provided source files so you customize this billboard! Additional software may be necessary.</p>
                      </div>
                      <a @click="downloadBillboard(source._id)" class="dropdown-item" :key="key" v-for="(source, key) in billboard.source">
                        {{ source.name }}
                      </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="field level-item has-addons" v-if="isOwner()">
              <div class="control"><a @click="toggleEditMode()" class="button is-warning is-medium construction">Edit</a></div>
              <div class="control"><a @click="updateBillboard()" class="button is-light is-medium" v-if="editMode">Save</a></div>
              <div class="control">
                <div class="button is-white is-medium" @click="toggleStatus()" v-tooltip="{ content: statusTooltip }">
                  <div class="switch" :class="{ 'is-active': billboard.status }">
                    <label></label>
                  </div>
                </div>
              </div>
            </div>



            <SaveToToolbox model="billboards" :data="billboard" v-if="!isOwner()"></SaveToToolbox>
          </div>
        </div>
      </div>
    </section>
    <main class="content container">
      <div class="columns">
        <div class="column is-one-quarter">
          <div class="box billboard-info">
            <Creator :user="billboard.user"></Creator>
            <hr />
            <ReactionMeter :reactions="billboard.reactions" />
          </div>

          <div class="box" v-if="billboard.colors.length > 0 || editMode">
            <ColorPalette v-model="billboard.colors" :editMode="editMode"></ColorPalette>
          </div>

          <Filters :options="filterOptions" :selected="billboard.tags" @selected="billboard.tags = $event" :readOnly="!editMode" ref="tags"></Filters>
        </div>

        <div class="column">

          <section class="box billboard-description">
            <div class="billboard-description-editor editor" v-if="editMode" v-html="billboard.description"></div>
            <div class="billboard-description-content" v-show="!editMode" v-html="billboard.description"></div>
          </section>

          <div class="field box filter-list" v-if="editMode">
            <h5 class="title is-5">Source Files</h5>
            
            <div class="source-item" :key="key" v-for="(source, key) in billboard.source">
            <div class="level">
              <div class="level-left">
                <span class="level-item">{{ source.name }}</span>
              </div>
              <div class="level-right">
                <a @click="downloadBillboard(source._id)" v-tooltip="'Download'" class="level-item button is-link"><span class="icon"><i class="fas fa-cloud-download"></i></span></a>
                <a @click="removeSource(source, key)" class="upload--delete level-item button is-link" v-tooltip="'Delete'"><span class="icon"><i class="fas fa-trash"></i></span></a>
              </div>
            </div>

            <hr class="divider" />
            </div>

            <div class="source-item-upload" v-if="billboard.source.length < 5">
              <p class="field description">Upload your <code>sketch</code> <code>psd</code> or <code>ai</code> files to allow players to customize this billboard.</p>
              <p class="field description">Maximum of 5 files, 100 MB each.</p>
              <Upload @uploaded="addSource" :maxItems="5" :allowClear="true" :allowFiles="true" folder="billboards" :enableToolbox="false" :instant="false" instructions="Drop your source files here, or click to browse your computer"></Upload>
            </div>

            <div class="notification" v-if="billboard.source.length >= 5">You have reached the maximum amount of source files you may upload.</div>
            
          </div>

        </div>
      </div>
    </main>
  </article>
</template>

<script>
import SaveToToolbox from '@/components/ui/SaveToToolbox'
import Filters from '@/components/ui/Filters'
import Blueprint from '@/components/Blueprints/Card'
import Billboard from '@/components/Billboards/Card'
import ReactionMeter from '@/components/ui/ReactionMeter'
import Creator from '@/components/ui/ProfileMini'
import API from '@/services/api'
import auth from '@/services/auth'
import Media from '@/services/media'

import Upload from '@/components/ui/Upload'
import Dropdown from '@/components/ui/Dropdown'
import ColorPalette from '@/components/ui/ColorPalette'
import Quill from 'quill'

export default {
  name: 'billboards',
  components: {
    Upload,
    Blueprint,
    Billboard,
    Dropdown,
    ColorPalette,
    ReactionMeter,
    Creator,
    SaveToToolbox,
    Filters
  },
  metaInfo() {
    return {
      title: this.billboard.name,
      titleTemplate: '%s • Billboards • PlanCoWorld'
    }
  },
  data () {
    return {
      loading: false,
      billboard: { tags: [], source: [], media: [], colors: [] },
      shareURL: '',
      editMode: false,
      downloading: false,
      editor: false,
      open: false,
      heroFilterOptions: {
        'billboards': {
          label: false,
          type: 'tags',
        },
        'orientation': {
          label: false,
          type: 'tags',
        },
        'screen-sizes': {
          label: false,
          type: 'tags',
        },
      },
      filterOptions: {
        'billboards': {
          label: 'Type of Media',
          type: 'toggle',
          inline: true,
          visible: true,
          force: true,
          min: 1,
          max: 1,
          hidden: true
        },
        'orientation': {
          label: 'Orientation',
          type: 'toggle',
          visible: true,
          inline: true,
          force: true,
          tooltips: true,
          min: 1,
          max: 1,
          hidden: true
        },
        'screen-sizes': {
          label: 'Screen Sizes',
          type: 'list',
          visible: true,
          description: 'Recommended screens for this billboard'
        },
        'billboards-context': {
          label: 'Context',
          type: 'list',
          visible: true,
          force: true,
          min: 1,
          guide: 'billboards-and-adverising',
        },
        'language': {
          label: 'Language',
          type: 'list',
          visible: true
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
  watch: {
    '$route': 'getBillboard'
  },
  computed: {
    statusTooltip () {
      if(this.billboard.status) return 'Open to the Public'
      return 'Closed to the Public'
    },
    downloads () {
      return this.billboard.media.length > 0 ? this.billboard.media[0].downloads : 'N/A'
    },
    isVertical() {
      return this.billboard.tags.filter(t => { return t.slug == 'vertical' }).length > 0
    },
  },
  methods: {
    downloadBillboard (mediaID) {
      this.downloading = true
      this.open = false
      API.fetch(`media/${mediaID}/download`).then((billboard) => {
        let url = billboard.signedRequest
        console.log(url)
        window.open(url)
        this.downloading = false
      })
    },
    getBillboard() {
      this.loading = true

      API.fetch(this.apiURL(false)).then((billboard) => {
        this.billboard = Object.assign({}, this.billboard, billboard)
        this.shareURL = `https://planco.world/billboards/${this.billboard.slug}`
        this.loading = false

      }).catch((err) => {
        API.handleError(err, 'billboards')
      })
    },
    updateBillboard() {
      this.toggleEditMode()
      this.loading = true
      let data = this.billboard

      let media = []
      data.media.forEach((m) => {
        media.push(m._id)
      })
      data.media = media
      data.user = data.user._id
      data.description = this.editor.container.firstChild.innerHTML

      return API.put(this.apiURL(), data).then((park) => {
        this.$notify('notifications', `${data.name} has been saved`, 'success')
        return this.getBillboard()
      })
    },
    addSource(media) {
      this.billboard.source.push(media)

      return API.put(this.apiURL(), { source: this.billboard.source }).then((park) => {
        this.$notify('notifications', `${billboard.name} has been saved`, 'success')
      })
    },
    removeSource(source, key) {
      let title = source.name
      this.$delete(this.billboard.source, key)
      return API.delete('media/'+source._id).then(response => {
        return API.put(this.apiURL(), { source: this.billboard.source })
      }).then(billboard => {
        this.$notify('notifications', `${title} has been deleted`, 'success')
      })
    },
    toggleStatus() {
      let status = this.billboard.status
      let newStatus = status ? false : true
      API.put(this.apiURL(), { status: newStatus }).then((billboard) => {
        this.billboard.status = billboard.status
      }).catch(() => {
        this.billboard.status = status
      })
      this.billboard.status = newStatus
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
          this.getBillboard()
        })

      }
    },
    apiURL(force = true) {
      if(this.billboard._id && force) {
        return `billboards/${this.billboard._id}`
      }

      let ID = this.$route.params.id
      let SLUG = this.$route.params.slug
      let url

      if(ID) {
        url = `billboards/${ID}`
      } else if(SLUG) {
        url = `billboards/slug/${SLUG}`
      }
      return url
    },
    attachEditor() {
      let wrapper = this.$el.querySelector('.billboard-description-editor')
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
    isOwner() {
      return auth.isOwner(this.billboard)
    },
    copy() {
      this.$clipboard(this.shareURL)
      this.$notify('notifications', 'Billboard URL Copied', 'success')
    },
    size(v) {
      return Media.bytesToSize(v)
    }
  },
  created () {
    this.getBillboard()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
