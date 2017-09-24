<template>
  <article class="billboard">
    <section class="hero hero--tall">
      <img :src="billboard.media[0].url" v-if="billboard.media && billboard.media[0].type == 'image'" class="cover-photo" />
      <video class="cover-photo" muted autoplay loop>
        <source :src="billboard.media[0].url" v-if="billboard.media && billboard.media[0].type == 'video'">
      </video>
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

            <button class="button is-primary is-medium level-item" :class="{ 'is-loading': downloading }" @click="downloadBillboard()" :disabled="!billboard.media"><span class="icon"><i class="fas fa-cloud-download"></i></span> <span>Download {{ downloads }}</span></button>

            <div class="field level-item has-addons" v-if="isOwner()">
            <div class="control"><a @click="toggleEditMode" class="button is-warning is-medium construction">Edit</a></div>
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
          <ColorPalette v-model="billboard.colors" :editMode="editMode"></ColorPalette>

          <Filters :options="filterOptions" :readOnly="!editMode" ref="tags"></Filters>
        </div>

        <div class="column">

          <section class="box billboard-description">
            <div class="billboard-description-editor editor" v-if="editMode" v-html="billboard.description"></div>
            <div class="billboard-description-content" v-show="!editMode" v-html="billboard.description"></div>
          </section>

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
import API from '@/services/api'
import auth from '@/services/auth'

import Dropdown from '@/components/ui/Dropdown'
import ColorPalette from '@/components/ui/ColorPalette'
import Quill from 'quill'

export default {
  name: 'billboards',
  components: {
    Blueprint,
    Billboard,
    Dropdown,
    ColorPalette,
    SaveToToolbox,
    Filters
  },
  data () {
    return {
      loading: false,
      billboard: {},
      shareURL: '',
      editMode: false,
      downloading: false,
      editor: false,
      filterOptions: {
        'billboards': {
          label: 'Type of Media',
          type: 'toggle',
          inline: true,
          visible: true,
          force: true,
          min: 1,
          max: 1
        },
        'billboards-context': {
          label: 'Context',
          type: 'list',
          visible: true,
          force: true,
          min: 1,
        },
        'language': {
          label: 'Language',
          type: 'list',
          inline: true,
          min: 1,
          visible: true
        },
        'shops': {
          label: 'Shops',
          type: 'list'
        },
        'facilities': {
          label: 'Facilities & Utilities',
          type: 'list'
        },
        'coasters': {
          label: 'Coasters',
          type: 'list'
        },
        'rides': {
          label: 'Rides',
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
    }
  },
  methods: {
    downloadBillboard () {
      this.downloading = true
      let mediaID = this.billboard.media[0]._id
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
        this.billboard = billboard
        this.shareURL = `http://planco.world/billboards/${this.billboard.slug}`
        this.loading = false
        this.editMode = false
        this.$nextTick(() => {
          this.$refs.tags.setPopulated(this.billboard.tags)
        })

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
      data.tags = this.$refs.tags.selected

      return API.put(this.apiURL(), data).then((park) => {
        this.$notify('notifications', 'Your Billboard has been saved', 'success')
        return this.getBillboard()
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
