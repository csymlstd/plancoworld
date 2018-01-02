<template>
  <div>
    <section class="hero hero--tall" :style="{ 'background-image': 'url('+(imported.media.length > 0 ? imported.media[0].url : '')+')' }">
      <div class="container">
        <Upload @uploaded="addPhoto" folder="parks" :instant="true" :isDark="true" instructions="Drop your park photos here, or click to browse your computer" v-if="imported.media.length == 0"></Upload>

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
            <button class="button is-primary is-medium level-item" @click="step = 0" v-if="!imported.steam_id"><span>Connect to </span><span class="icon"><i class="fab fa-steam"></i></span></button>
            <button class="button is-success is-medium level-item" v-if="imported.steam_id"><span>Connected to</span><span class="icon"><i class="fab fa-steam"></i></span></button>
          </div>
        </div>
      </div>
    </section>
    <section class="section">

        <Modal :class="['importFromSteam', 'is-wide']" :show="step == 0">
            <header>
              <i class="fab fa-steam fa-3x"></i>
              <h2 class="title">Import and Connect to Steam Workshop</h2>
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
                  <input type="text" name="url" v-model="url" class="input is-medium" placeholder="http://steamcommunity.com/sharedfiles/filedetails/?id=#########" />
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
            <h2 class="title is-4">Tell us about your park</h2>
            <div class="field">
              <div class="control">
                <input type="text" name="title" v-model="imported.title" @input="$v.imported.title.$touch()" class="input is-medium" :class="{ 'is-danger': $v.imported.title.$error }" placeholder="Park Name" />
              </div>
            </div>

            <div class="field">
              <div class="box">
                <div class="description editor" v-html="imported.description"></div>
              </div>
            </div>

            
            <div class="field">
              <Filters :options="filterOptions" @selected="addTags" ref="tags" ></Filters>
              <!-- <a class="button" @click="">Add Tags</a><div class="field is-grouped is-grouped-multiline">
                <div class="control" v-for="tag in imported.tags">
                  <div class="tag is-primary is-medium">{{ tag.name }} <button class="delete is-small"></button></div>
                </div>
              </div> -->
            </div>

            <div class="field is-grouped">
              <div class="control"><a class="button is-primary is-medium" @click="addPark()">Save &amp; Visit</a></div>
              <div class="control"><a class="button is-medium is-white" @click="addPark()">Save &amp; Add Another</a></div>
            </div>
          </div>
        </div>
    </section>
  </div>
</template>

<script>
import SmoothScroll from 'smooth-scroll'
import Modal from '@/components/ui/Modal'
import Filters from '@/components/ui/Filters'
import API from '@/services/api'
import slug from 'slug'

import Upload from '@/components/ui/Upload'

import Quill from 'quill'
//
//

import { required } from 'vuelidate/lib/validators'

export default {
  name: 'Import',
  components: {
    Upload,
    Filters,
    Modal
  },
  data () {
    return {
      step: 0,
      loading: {
        importing: false
      },
      errors: {
        import: false
      },
      url: '',
      imported: {
        title: '',
        media: [],
        tags: []
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
          description: 'Different park types allow varying levels of challenge and freedom'
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
          label: 'Park Plans',
          type: 'toggle',
          visible: true,
          max: 1,
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
        'content-packs': {
          label: 'Content Packs',
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
          type: 'list'
        },
        'language': {
          label: 'Language',
          type: 'list'
        },
      }
    }
  },
  validations: {
    imported: {
      title: {
        required: required,

      }
    }
  },
  methods: {
    importItem() {
      this.loading.importing = true
      this.errors.import = false
      API.post('import', { url: this.url }).then((data) => {

        if(data.type != 'park') {
          this.errors.import = 'That workshop item is not a Park'
        } else {
          Object.assign(this.imported, data)
          this.$refs.tags.setPopulated(this.imported.tags)
          this.imported.slug = slug(this.imported.title)

          if(this.imported.cover) {
            API.post('media/import', {
              url: this.imported.cover,
            }).then((cover) => {
              this.addPhoto(cover.media)
            })
          }

          this.step = 1
          this.wasImported = true
        }

        this.loading.importing = false
      }).catch((err) => {
        console.log(err)
        if(err.response && err.response.data.message) this.errors.import = err.response.data.message
        this.loading.importing = false
        this.errors.import = true
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
      this.step = 1
    },
    addPark() {
      let newPark = {
        media: []
      }
      newPark.name = this.imported.title
      newPark.steam_id = this.imported.steam_id
      newPark.description = this.editor.container.firstChild.innerHTML
      newPark.tags = this.$refs.tags.selected

      for(let i=0;i<this.imported.media.length;i++) {
        newPark.media.push(this.imported.media[i]._id)
      }

      this.$v.imported.$touch()
      let isTagsValid = this.$refs.tags.isValid()
      if(!this.$v.imported.$valid || !isTagsValid) {
        new SmoothScroll().animateScroll(this.$el.querySelector('#form'), false, { offset: 100 })
        return
      }

      API.post('parks', newPark).then((data) => {
        this.$notify('notifications', 'Park created!', 'success')
      }).catch((err) => {
        console.log(err)
        this.$notify('notifications', 'Error creating Park', 'error')
      })

    }
  },
  mounted () {
    this.$nextTick(() => {
      this.attachEditor()
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
