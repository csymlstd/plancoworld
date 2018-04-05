<template>
  <div>
    <section class="hero hero--tall" :style="{ 'background-image': 'url('+(imported.media.length > 0 ? imported.media[0].url : '')+')' }">
      <div class="container">
        <Loader v-if="loading.importingMedia"></Loader>
        <Upload @uploaded="addPhoto" folder="blueprints" :allowFiles="false" :instant="true" :isDark="true" instructions="Drop your blueprint photos here, or click to browse your computer" v-if="imported.media.length == 0"></Upload>

      </div>
      <!-- <img :src="imported.media ? imported.media[0].url : ''" v-if="imported.media.length > 0" class="cover-photo" @load="$event.target.classList.toggle('is-active')" /> -->
    </section>
    <section class="hero">
      <div class="container">
        <div class="level">
          <div class="level-left">
            <h1 class="title level-item"><router-link :to="{ name: 'Blueprints' }">Blueprints</router-link></h1>
            <h1 class="title level-item"> / {{ imported.title || 'Add a Blueprint' }}</h1>
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
          <i class="fab fa-steam fa-3x"></i>
          <h2 class="title">Import and Connect to Steam Workshop</h2>
          <p>Enter the URL to your Blueprint in the Workshop to import your descriptions, tags, and photos.</p>
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
                <input type="text" ref="url" name="url" v-model="url" :class="{ 'is-danger': $v.url.$error }" class="input is-medium" placeholder="http://steamcommunity.com/sharedfiles/filedetails/?id=#########" />
              </div>
            </div>
          </div>

          <div class="level">
            <div class="level-left">
              <button class="button is-medium is-primary level-item" :class="{ 'is-loading': loading.importing }" @click="importItem()"><span class="icon"><i class="fab fa-steam"></i></span> <span>Import Blueprint</span></button>
              <button class="button is-light is-medium level-item" @click="importLater()">Connect Later</button>
            </div>
          </div>

          <p class="has-text-grey">You can connect it later if you're still working on it, but it will be unpublished until you do.</p>
        </main>
      </Modal>

      <div class="form for-blueprint columns is-centered" id="form">
        <div class="column is-three-quarters content">
          <div class="box">
            <h4>Blueprint Name</h4>
            <div class="control">
              <input type="text" name="title" v-model="imported.title" @input="$v.imported.title.$touch()" :class="{ 'is-danger': $v.imported.title.$error }" class="input is-medium" placeholder="" />
            </div>
          </div>

          <div class="box">
            <h4>About Your Blueprint</h4>
            <div class="description editor" v-html="imported.description"></div>
          </div>

          <div class="field">
            <div class="box">
              <div class="level">
                <div class="level-left">
                  <h5 class="title is-5">Ratings</h5>
                </div>
                <div class="level-right">
                  <div class="switch level-item" :class="{'is-active is-primary':enableRatings }" @click="enableRatings = enableRatings ? false: true">
                    <label></label>
                  </div>
                </div>
              </div>
              <div class="columns blueprint-ratings" v-if="enableRatings">
                <div class="column" v-tooltip="'Excitement'">
                  <div class="reaction is-large fun"></div>
                  <div class="control"><input type="number" class="input" min="0" max="10" step="0.01" v-model="imported.stats.excitement" /></div>
                </div>
                <div class="column" v-tooltip="'Fear'">
                  <div class="reaction is-large scary"></div>
                  <div class="control"><input type="number" class="input" min="0" max="10" step="0.01" v-model="imported.stats.fear" /></div>
                </div>
                <div class="column" v-tooltip="'Nausea'">
                  <div class="reaction is-large nauseating"></div>
                  <div class="control"><input type="number" class="input" min="0" max="10" step="0.01" v-model="imported.stats.nausea" /></div>
                </div>
              </div>
            </div>
            <div class="box">
              <div class="level">
                <div class="level-left">
                  <h5 class="title is-5">Ride Stats</h5>
                </div>
                <div class="level-right">
                  <div class="switch level-item" :class="{'is-active is-primary':enableStats }" @click="enableStats = enableStats ? false: true">
                    <label></label>
                  </div>
                </div>
              </div>
              <div class="columns blueprint-stats" v-if="enableStats">
                <div class="column">
                  <label class="label">Duration</label>
                  <div class="field has-addons">
                    <div class="control">
                      <input type="number" class="input" v-model="imported.stats.duration" />
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
                      <input type="number" class="input" v-model="imported.stats.trackLength" />
                    </div>
                    <div class="control">
                      <div class="button is-static">meters</div>
                    </div>
                  </div>
                </div>
                <div class="column">
                  <label class="label">Max Speed</label>
                  <div class="field has-addons">
                    <div class="control">
                      <input type="number" max="149" class="input" v-model="imported.stats.maxSpeed" />
                    </div>
                    <div class="control">
                      <div class="button is-static">mph</div>
                    </div>
                  </div>
                </div>
                <div class="column">
                  <label class="label">Average Speed</label>
                  <div class="field has-addons">
                    <div class="control">
                      <input type="number" max="149" class="input" v-model="imported.stats.avgSpeed" />
                    </div>
                    <div class="control">
                      <div class="button is-static">mph</div>
                    </div>
                  </div>
                </div>
                
              </div>
              <div class="columns blueprint-stats" v-if="enableStats">
                <div class="column">
                  <label class="label">Biggest Drop</label>
                  <div class="field has-addons">
                    <div class="control">
                      <input type="number" class="input" v-model="imported.stats.biggestDrop" />
                    </div>
                    <div class="control">
                      <div class="button is-static">meters</div>
                    </div>
                  </div>
                </div>
                <div class="column">
                  <label class="label">Number of Inversions</label>
                  <div class="field">
                    <div class="control">
                      <input type="number" class="input" v-model="imported.stats.inversions" />
                    </div>
                  </div>
                </div>
                <div class="column">
                  <label class="label">Airtime Count</label>
                  <div class="field">
                    <div class="control">
                      <input type="number" class="input" v-model="imported.stats.airtimeCount" />
                    </div>
                  </div>
                </div>
                <div class="column">
                  <label class="label">Total Airtime Duration</label>
                  <div class="field has-addons">
                    <div class="control">
                      <input type="number" class="input" v-model="imported.stats.airtimeDuration " />
                    </div>
                    <div class="control">
                      <div class="button is-static">seconds</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="columns blueprint-stats" v-if="enableStats">
                <div class="column">
                  <label class="label">Max Lateral G</label>
                  <div class="field">
                    <div class="control">
                      <input type="number" max="5" min="-5" step="0.01" class="input" v-model="imported.stats.maxLateralG" />
                    </div>
                  </div>
                </div>
                <div class="column">
                  <label class="label">Max Vertical G</label>
                  <div class="field">
                    <div class="control">
                      <input type="number" max="5" min="-5" step="0.01" class="input" v-model="imported.stats.maxVerticalG" />
                    </div>
                  </div>
                </div>
                <div class="column">
                  <label class="label">Min Vertical G</label>
                  <div class="field">
                    <div class="control">
                      <input type="number" max="5" min="-5" step="0.01" class="input" v-model="imported.stats.minVerticalG" />
                    </div>
                  </div>
                </div>
                <div class="column">
                  <label class="label">Max Foward G</label>
                  <div class="field">
                    <div class="control">
                      <input type="number" max="5" min="-5" step="0.01" class="input" v-model="imported.stats.maxForwardG" />
                    </div>
                  </div>
                </div>
                <div class="column">
                  <label class="label">Min Forward G</label>
                  <div class="field">
                    <div class="control">
                      <input type="number" max="5" min="-5" step="0.01" class="input" v-model="imported.stats.minForwardG" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="box filter-list">
            <h4>Color Palette</h4>
            <p class="description">Save the scenery, building, or ride colors used in this blueprint. You'll be able to click on them later to copy.</p>
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
            <Filters :options="filterOptions" :selected="imported.tags" @selected="addTags" ref="tags"></Filters>
            <!-- <a class="button" @click="">Add Tags</a><div class="field is-grouped is-grouped-multiline">
              <div class="control" v-for="tag in imported.tags">
                <div class="tag is-primary is-medium">{{ tag.name }} <button class="delete is-small"></button></div>
              </div>
            </div> -->
          </div>

          <div class="field is-grouped">
            <div class="control"><a class="button is-primary is-medium" @click="addBlueprint()">Save &amp; View</a></div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import SmoothScroll from 'smooth-scroll'
import { store } from '@/store.js'
import slug from 'slug'
import Filters from '@/components/ui/Filters'
import API from '@/services/api'
import CreateKit from '@/components/Kits/CreateModal'
import Autocomplete from '@/components/ui/Autocomplete'
import Loader from '@/components/ui/Loader'
import Range from '@/components/ui/Range'
import Upload from '@/components/ui/Upload'
import Modal from '@/components/ui/Modal'
import ColorPalette from '@/components/ui/ColorPalette'

import Quill from 'quill'

import { required } from 'vuelidate/lib/validators'

export default {
  store,
  components: {
    Upload,
    Filters,
    Modal,
    Range,
    ColorPalette,
    CreateKit,
    Autocomplete,
    Loader
  },
  metaInfo: {
    title: 'Import Blueprint'
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
      kits: [],
      creatingKit: false,
      imported: {
        title: '',
        media: [],
        tags: [],
        colors: [],
        kits: [],
        stats: {
          excitement: 0,
          fear: 0,
          nausea: 0,
          duration: '',
          trackLength: '',
          maxSpeed: '',
          avgSpeed: '',
          biggestDrop: '',
          inversions: '',
          airtimeCount: '',
          airtimeDuration: '',
          maxLateralG: '',
          maxVerticalG: '',
          minVerticalG: '',
          maxForwardG: '',
          minForwardG: '',
        }
      },
      wasImported: false,
      enableStats: false,
      enableRatings: false,
      filterOptions: {
        'buildings': {
          label: 'Buildings',
          type: 'list',
          visible: true,
          showDescriptionsClosed: true,
        },
        'scenery': {
          label: 'Scenery',
          type: 'list',
          visible: true,
          showDescriptionsClosed: true,
        },
        'coasters': {
          label: 'Coasters',
          type: 'list',
          showDescriptionsClosed: true,
        },
        'rides': {
          label: 'Rides',
          type: 'list',
          showDescriptionsClosed: true,
        },
        'age-groups': {
          label: 'Age Groups',
          type: 'toggle',
          visible: true,
          showDescriptionsClosed: true,
        },
        'materials': {
          label: 'Materials',
          type: 'list',
          visible: true,
          showDescriptionsClosed: true,
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
        'shops': {
          label: 'Shops',
          type: 'list',
          showDescriptionsClosed: true,
        },
        'facilities': {
          label: 'Facilities & Utilities',
          type: 'list',
          showDescriptionsClosed: true,
        },
        'content-packs': {
          label: 'Content Packs',
          type: 'list',
          dlc: true,
          visible: true,
          force: true,
          description: 'Select all content packs that contain items used in this Park',
          showDescriptionsClosed: true,
        },
        'regions': {
          label: 'Biomes',
          type: 'toggle',
          tooltips: true,
          showDescriptionsClosed: true,
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

        if(data.type != 'blueprint') {
          this.errors.import = 'That workshop item is not a Blueprint'
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
        console.log(err)
        this.errors.import = 'There was an error importing'
        if(err.response && err.response.data.message) this.errors.import = err.response.data.message
        this.loading.importing = false
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
      this.$v.url.$reset()
      this.step = 1
    },
    isImperial() {
      return this.$store.state.measurements == 'imperial'
    },
    addBlueprint() {
      let data = {
        media: [],
        tags: [],
      }

      this.$v.imported.$touch()
      let isTagsValid = this.$refs.tags.isValid()
      if(this.$v.imported.$invalid || !isTagsValid) {
        new SmoothScroll().animateScroll(this.$el.querySelector('#form'), false, { offset: 100 })
        return
      }

      data.name = this.imported.title
      data.steam_id = this.imported.steam_id
      data.colors = this.imported.colors
      data.stats = this.imported.stats
      data.description = this.editor.container.firstChild.innerHTML
      
      this.imported.tags.forEach((t) => {
        data.tags.push(t._id)
      })

      this.imported.media.forEach((m) => {
        data.media.push(m._id)
      })

      API.post('blueprints', data).then((data) => {
        console.log(data)
        this.$notify('notifications', 'Blueprint created!', 'success')
        this.$router.push({ name: 'Blueprint', params: { slug: data.slug }})
      }).catch((err) => {
        console.log(err)
        this.$notify('notifications', 'Error creating Blueprint', 'error')
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
