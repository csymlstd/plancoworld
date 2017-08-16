<template>
  <div>
    <section class="hero hero--tall" :style="{ 'background-image': 'url('+(imported.media.length > 0 ? imported.media[0].url : '')+')' }" v-if="imported.type == 'park'">
      <div class="container">
        <Upload @uploaded="addPhoto" folder="parks" :instant="true" :isDark="true" instructions="Drop your park photos here, or click to browse your computer"></Upload>

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

          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="columns is-centered">
        <div class="column is-three-quarters" v-if="step == 0">
          <div class="field">
            <h2 class="title">Import your Workshop Blueprint</h2>
            <div class="field has-addons">
            <div class="control is-expanded">
              <input type="text" name="url" v-model="url" class="input is-medium" placeholder="http://steamcommunity.com/sharedfiles/filedetails/?id=#########" />
            </div>
            <div class="control">
              <button class="button is-medium is-primary" :class="{ 'is-loading': loading.importing }" @click="importItem()">Import Park</button>
            </div>
            </div>
          </div>
          <div class="level">
            <div class="level-left">
              <div class="level-item">
                <button class="button is-white is-medium" @click="importLater()">Import Later</button>
              </div>
              <div class="level-item">
                <p>You will need to connect your Park <br /> to a Workshop Blueprint to make it public.</p>
              </div>
            </div>
          </div>
        </div>
          <!-- <button class="ui button" @click="addField()" :disabled="fields >= max">Add Another</button> -->
        </div>
        <div class="form for-park columns is-centered" v-if="step == 1">
          <div class="column is-three-quarters">
            <div class="field">
              <label class="label">Park Name</label>
              <div class="control">
                <input type="text" name="title" v-model="imported.title" class="input is-medium" placeholder="PlanCo World!" />
              </div>
            </div>

            <div class="field">
              <label class="label">About Your Park</label>
              <p v-if="wasImported">If you have links to billboards and audio files, you can upload them directly to PlanCo World in the next step.</p>
              <div class="description editor" v-html="imported.description"></div>
            </div>

            <div class="field">
              <Filters :options="filterOptions" @selected="" ></Filters>
              <!-- <a class="button" @click="">Add Tags</a><div class="field is-grouped is-grouped-multiline">
                <div class="control" v-for="tag in imported.tags">
                  <div class="tag is-primary is-medium">{{ tag.name }} <button class="delete is-small"></button></div>
                </div>
              </div> -->
            </div>

            <div class="field is-grouped">
              <div class="control"><a class="button is-primary is-medium" @click="addPark()">Continue</a></div>
              <div class="control"><a class="button is-medium is-white" @click="addPark()">Save Park</a></div>
            </div>
          </div>
        </div>
    </section>
  </div>
</template>

<script>
import Filters from '@/components/ui/Filters'
import API from '@/services/api'

import Upload from '@/components/ui/Upload'

import Quill from 'quill'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'

export default {
  name: 'Import',
  components: {
    Upload,
    Filters
  },
  data () {
    return {
      step: 0,
      loading: {
        importing: false
      },
      url: 'http://steamcommunity.com/sharedfiles/filedetails/?id=1085896826',
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
          type: 'list',
          visible: true,
          force: true,
          required: true,
          min: 1,
          max: 4
        },
        'parks-plans': {
          label: 'Park Plans',
          type: 'toggle',
          visible: true,
          max: 1,
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
      }
    }
  },
  methods: {
    importItem() {
      this.loading.importing = true
      API.post('import', { url: this.url }).then((data) => {
        Object.assign(this.imported, data)
        this.loading.importing = false
        this.step = 1
        this.wasImported = true

        this.$nextTick(() => {
          this.attachEditor()
        })
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
    importLater() {
      this.imported = {
        title: '',
        type: 'park',
        media: [],
        tags: []
      }

      this.step = 1
      this.$nextTick(() => {
        this.attachEditor()
      })
    },
    addPark() {
      let newPark = {
        media: [],
        tags: []
      }
      newPark.name = this.imported.title
      newPark.description = this.editor.container.firstChild.innerHTML

      for(let i=0;i<this.imported.tags.length;i++) {
        newPark.tags.push(this.imported.tags[i]._id)
      }

      for(let i=0;i<this.imported.media.length;i++) {
        newPark.media.push(this.imported.media[i]._id)
      }

      console.log('new park', newPark)

      API.post('parks', newPark).then((data) => {
        console.log(data)
        this.$notify('notifications', 'Park created!', 'success')
      }).catch((err) => {
        console.log(err)
        this.$notify('notifications', 'Error creating Park', 'error')
      })

    }
  },
  mounted () {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
