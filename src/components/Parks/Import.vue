<template>
  <div>
    <section class="hero hero--tall" :style="{ 'background-image': 'url('+(imported.media.length > 0 ? imported.media[0].url : '')+')' }">
      <div class="container">
        <Loader v-if="loading.importingMedia"></Loader>
        <Upload @uploaded="addPhoto" folder="parks" :instant="true" :isDark="true" instructions="Drop your park photos here, or click to browse your computer" v-if="imported.media.length == 0 && !loading.importingMedia"></Upload>

      </div>
      <!-- <img :src="imported.media ? imported.media[0].url : ''" v-if="imported.media.length > 0" class="cover-photo" @load="$event.target.classList.toggle('is-active')" /> -->
    </section>
    <section class="hero">
      <div class="container">
        <div class="level">
          <div class="level-left">
            <h1 class="title level-item"><router-link :to="{ name: 'Parks' }">Parks</router-link></h1>
            <h1 class="title level-item"> / {{ imported.title || 'Add a Park' }}</h1>
          </div>
          <div class="level-right">
            <button class="button is-primary is-medium level-item" @click="connect()" v-if="!imported.steam_id"><span>Connect to </span><span class="icon"><i class="fab fa-steam"></i></span></button>
            <button class="button is-success is-medium level-item" v-if="imported.steam_id"><span>Connected to</span><span class="icon"><i class="fab fa-steam"></i></span></button>
          </div>
        </div>
      </div>
    </section>
    <section class="section">

        <Modal :class="['importFromSteam', 'is-wide']" :show="step == 0">
            <header>
              
              <h1 class="title"><i class="fab fa-steam fa-3x"></i> Import and Connect to Steam Workshop</h1>
              <p>Enter the URL to your Park in the Workshop to import your descriptions, tags, and photos.</p>
            </header>
            <main>
            <div class="field">
              
              <div class="field">
                 
              </div>
              <div class="notification is-warning" v-if="errors.import">
                {{ errors.import }}
              </div>
              <div class="field has-addons">
                <div class="control is-expanded">
                  <input type="text" ref="url" name="url" v-model="url" class="input is-medium" :class="{ 'is-danger': this.$v.url.$error }" placeholder="http://steamcommunity.com/sharedfiles/filedetails/?id=#########" />
                </div>
              </div>
            </div>

            <div class="level">
              <div class="level-left">
                <button class="button is-medium is-primary level-item" :class="{ 'is-loading': loading.importing }" @click="importItem()"><span class="icon"><i class="fab fa-steam"></i></span> <span>Import Park</span></button>
                <button class="button is-light is-medium level-item" @click="importLater()">Connect Later</button>
              </div>
            </div>

            <p class="has-text-grey">You can connect it later if you're still working on it, but it will be unpublished until you do.</p>
            </main>
        </Modal>

      <div class="form content for-park columns is-centered" id="form">
          <div class="column is-three-quarters">
            <div class="box">
              <h4>Park Name</h4>
              <div class="field">
                <div class="control">
                  <input type="text" name="title" v-model="imported.title" @input="$v.imported.title.$touch()" class="input is-medium" :class="{ 'is-danger': $v.imported.title.$error }" placeholder="PlanCo World" />
                </div>
              </div>
            </div>

            <div class="box">
              <h4>About Your Park</h4>
              <div class="description editor"></div>
            </div>

            <div class="box filter-list">
              <h4>Color Palette</h4>
              <p class="description">Save the scenery and building colors used across your park. You'll be able to click on them later to copy.</p>
              <ColorPalette v-model="imported.colors" :editMode="true"></ColorPalette>
            </div>

            <div class="field box filter-list">
              <h5 class="title is-5">Add to a Kit</h5>
              <p class="field description">Kits allow you to share a collection of related Parks, Blueprints and Billboards.</p>
              <div class="field is-grouped">
                <Autocomplete path="kits" :owned="true" placeholder="Search for your Kits" class="control is-expanded" @selected="addKit"></Autocomplete>
                <div class="control">
                  <button class="button is-primary is-medium" @click="creatingKit = creatingKit ? false : true">Create New Kit</button>
                </div>
              </div>
              <div class="field" v-if="kits.length > 0">
                <div class="tag is-primary is-rounded is-large" :key="kit._id" v-for="(kit, index) in kits">{{ kit.name }} &nbsp;<button class="delete is-small" @click="removeKit(index)"></button></div>
              </div>
            </div>

            <CreateKit :show="creatingKit" @created="addKit" @cancel="creatingKit = false"></CreateKit>

            
            <div class="field">
              <Filters :options="filterOptions" :selected="imported.tags" @selected="addTags" ref="tags" ></Filters>
              <!-- <a class="button" @click="">Add Tags</a><div class="field is-grouped is-grouped-multiline">
                <div class="control" v-for="tag in imported.tags">
                  <div class="tag is-primary is-medium">{{ tag.name }} <button class="delete is-small"></button></div>
                </div>
              </div> -->
            </div>

            <div class="field is-grouped">
              <div class="control"><a class="button is-primary is-large" @click="addPark()">Save &amp; Visit</a></div>
            </div>
          </div>
        </div>
    </section>
  </div>
</template>

<script>
import SmoothScroll from 'smooth-scroll'
import Modal from '@/components/ui/Modal'
import CreateKit from '@/components/Kits/CreateModal'
import Autocomplete from '@/components/ui/Autocomplete'
import Loader from '@/components/ui/Loader'
import Filters from '@/components/ui/Filters'
import API from '@/services/api'
import slug from 'slug'

import Upload from '@/components/ui/Upload'
import ColorPalette from '@/components/ui/ColorPalette'
import Quill from 'quill'
//
//

import { required } from 'vuelidate/lib/validators'

export default {
  name: 'Import',
  components: {
    Upload,
    Filters,
    Modal,
    ColorPalette,
    CreateKit,
    Autocomplete,
    Loader
  },
  data () {
    return {
      step: 0,
      later: false,
      loading: {
        importing: false,
        importingMedia: false,
      },
      errors: {
        import: false
      },
      url: '',
      kits: [],
      creatingKit: false,
      imported: {
        title: '',
        media: [],
        tags: [],
        colors: [],
        kits: [],
      },
      wasImported: false,
      filterOptions: {
        'parks': {
          label: 'Type of Park',
          type: 'toggle',
          visible: true,
          force: true,
          required: true,
          min: 1,
          max: 1,
          description: 'Different park types allow varying levels of challenge and freedom',
        },
        'regions': {
          label: 'Biomes',
          type: 'toggle',
          visible: true,
          force: true,
          required: true,
          min: 1,
          max: 4,
          tooltips: true,
        },
        'parks-plans': {
          label: 'Starting Points',
          type: 'toggle',
          visible: true,
          max: 1,
          showDescriptionsClosed: true,
        },
        'age-groups': {
          label: 'Age Groups',
          type: 'toggle',
          visible: true,
          showDescriptionsClosed: true,
        },
        'amenities': {
          label: 'Amenities',
          type: 'list',
          showDescriptionsClosed: true,
        },
        'content-packs': {
          label: 'Content Packs',
          type: 'list',
          dlc: true,
          visible: true,
          force: true,
          description: 'Select all content packs that contain items used in this Park'
        },
        'themes': {
          label: 'Themes',
          type: 'list',
          showDescriptionsClosed: true,
        },
        'style': {
          label: 'Styles',
          type: 'list',
          showDescriptionsClosed: true,
        },
        'requirements': {
          label: 'Requirements',
          type: 'list',
          showDescriptionsClosed: true,
        },
        'language': {
          label: 'Language',
          type: 'list',
        },
      }
    }
  },
  validations: {
    url: {
      required
    },
    imported: {
      title: {
        required: required,

      }
    }
  },
  methods: {
    connect() {
      this.step = 0
      this.$nextTick(() => { this.$refs.url.focus() })
    },
    importItem() {
      if(this.later) return this.linkToWorkshop()
      this.loading.importing = true
      this.errors.import = false

      this.$v.url.$touch()
      if(this.$v.url.$invalid) {
        console.log(this.$v.url)
        this.loading.importing = false
        this.errors.import = true
        this.$refs.url.focus()
        return
      }

      API.post('import', { url: this.url }).then((data) => {

        if(data.type != 'park') {
          this.errors.import = 'That workshop item is not a Park'
        } else {
          Object.assign(this.imported, data)
          this.imported.slug = slug(this.imported.title)

          this.editor.clipboard.dangerouslyPasteHTML(this.imported.description)

          if(this.imported.cover) {
            this.loading.importingMedia = true
            API.post('media/import', {
              url: this.imported.cover,
            }).then((cover) => {
              this.addPhoto(cover.media)
              this.loading.importingMedia = false
            }).catch(err => {
              this.loading.importingMedia = false
            })
          }

          this.step = 1
          this.wasImported = true
        }

        this.loading.importing = false
      }).catch((err) => {
        console.log(err.response)
        if(err.response && err.response.data.message) this.errors.import = err.response.data.message
        this.loading.importing = false
      })
    },
    linkToWorkshop() {
      this.loading.importing = true
      this.errors.import = false

      this.$v.url.$touch()
      if(this.$v.url.$invalid) {
        this.loading.importing = false
        this.errors.import = true
        this.$refs.url.focus()
        return
      }

      API.post(this.apiURL()+'/link', { url: this.url }).then((park) => {
        this.$notify('notifications', 'Park linked to workshop', 'success')
        this.modals.linkToWorkshop.show = false
        this.park.steam_id = park.steam_id
      }).catch((err) => {
        this.$notify('notifications', 'Could not link to Workshop', 'error')
        console.log(err)
      })
    },
    attachEditor() {
      let wrapper = this.$el.querySelector('.editor')
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
    addPhoto(media) {
      console.log('adding', media)
      this.imported.media.push(media)
    },
    addTags(tags) {
      this.imported.tags = tags
    },
    importLater() {
      this.later = true
      this.$v.url.$reset()
      this.step = 1
    },
    addPark() {
      let data = {
        media: []
      }
      data.name = this.imported.title
      data.steam_id = this.imported.steam_id
      data.description = this.editor.container.firstChild.innerHTML
      
      let tags = []
      this.imported.tags.forEach((t) => {
        tags.push(t._id)
      })
      data.tags = tags

      for(let i=0;i<this.imported.media.length;i++) {
        data.media.push(this.imported.media[i]._id)
      }

      this.$v.imported.$touch()
      let isTagsValid = this.$refs.tags.isValid()
      if(this.$v.imported.$invalid || !isTagsValid) {
        new SmoothScroll().animateScroll(this.$el.querySelector('#form'), false, { offset: 100 })
        return
      }

      API.post('parks', data).then((data) => {
        this.$notify('notifications', 'Park created!', 'success')
        this.$router.push({ name: 'Park', params: { slug: data.slug }})
      }).catch((err) => {
        console.log(err)
        this.$notify('notifications', 'Error creating Park', 'error')
      })

    },
    addKit(kit) {
      this.creatingKit = false
      let existing = this.kits.filter(k => {
        return k._id == kit._id
      })[0]

      if(!existing) this.kits.push(kit)
    },
    removeKit(index) {
      this.kits.splice(index, 1)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.url.focus()
      this.attachEditor()
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
