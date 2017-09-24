<template>
  <div>
    <section class="hero hero--tall" :style="{ 'background-image': 'url('+(imported.media.length > 0 ? imported.media[0].url : '')+')' }" v-if="step > 0">
      <div class="container">
        <Upload @uploaded="addPhoto" folder="blueprints" :instant="true" :isDark="true" instructions="Drop your blueprint photos here, or click to browse your computer" v-if="imported.media.length == 0"></Upload>

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

          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="columns is-centered">
        <div class="column is-three-quarters" v-if="step == 0">
          <div class="field">
            <h2 class="title">Import and Connect to Steam Workshop</h2>
            <div class="field">
              <p>Enter the URL to your Blueprint in the Workshop to import your descriptions, tags, and photos.</p>
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
              <button class="button is-medium is-primary level-item" :class="{ 'is-loading': loading.importing }" @click="importItem()"><span class="icon"><i class="fas fa-cloud-upload"></i></span> <span>Import Blueprint</span></button>
              <button class="button is-white is-medium level-item" @click="importLater()">Import Later</button>
              <p class="level-item has-text-grey">You can connect it later if you're still working on it. <br /> It will be unpublished until you do.</p>
            </div>
          </div>
        </div>
          <!-- <button class="ui button" @click="addField()" :disabled="fields >= max">Add Another</button> -->
        </div>
        <div class="form for-blueprint columns is-centered" v-show="step == 1">
          <div class="column is-three-quarters content">
            <div class="field">
              <label class="label">Blueprint Name</label>
              <div class="control">
                <input type="text" name="title" v-model="imported.title" class="input is-medium" placeholder="PlanCo World!" />
              </div>
            </div>

            <div class="field">
              <label class="label">About Your Blueprint</label>
              <p v-if="wasImported">If you have links to billboards and audio files, you can upload them directly to PlanCo World in the next step.</p>
              <div class="box">
                <div class="description editor" v-html="imported.description"></div>
              </div>
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
                <div class="columns" v-if="enableRatings">
                  <div class="column">
                    <div class="reaction is-large fun"></div>
                  </div>
                  <div class="column">
                    <div class="reaction is-large nauseating"></div>
                  </div>
                  <div class="column">
                    <div class="reaction is-large scary"></div>
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
                <div class="columns" v-if="enableStats">
                  <div class="column">
                    <label class="label">Duration</label>
                    <div class="field has-addons">
                      <div class="control">
                        <input type="number" class="input" v-model="imported.stats.duration" />
                      </div>
                      <div class="control">
                        <div class="button is-static">minutes</div>
                      </div>
                    </div>
                  </div>
                  <div class="column">
                    <label class="label">Length</label>
                    <div class="field has-addons">
                      <div class="control">
                        <input type="number" class="input" v-model="imported.stats.length" />
                      </div>
                      <div class="control">
                        <div class="button is-static" v-if="isImperial()">feet</div>
                        <div class="button is-static" v-else>meters</div>
                      </div>
                    </div>
                  </div>
                  <div class="column">
                    <label class="label">Biggest Drop</label>
                    <div class="field has-addons">
                      <div class="control">
                        <input type="number" class="input" v-model="imported.stats.biggestDrop" />
                      </div>
                      <div class="control">
                        <div class="button is-static" v-if="isImperial()">feet</div>
                        <div class="button is-static" v-else>meters</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="columns" v-if="enableStats">
                  <div class="column">
                    <label class="label">Max Speed</label>
                    <div class="field has-addons">
                      <div class="control">
                        <input type="number" max="149" class="input" v-model="imported.stats.maxSpeed" />
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
                        <input type="number" max="149" class="input" v-model="imported.stats.avgSpeed" />
                      </div>
                      <div class="control">
                        <div class="button is-static" v-if="isImperial()">mph</div>
                        <div class="button is-static" v-else>kmh</div>
                      </div>
                    </div>
                  </div>
                  <div class="columns">

                  </div>
                </div>
              </div>
            </div>

            <div class="field">
              <Filters :options="filterOptions" @selected="addTags" ref="tags"></Filters>
              <!-- <a class="button" @click="">Add Tags</a><div class="field is-grouped is-grouped-multiline">
                <div class="control" v-for="tag in imported.tags">
                  <div class="tag is-primary is-medium">{{ tag.name }} <button class="delete is-small"></button></div>
                </div>
              </div> -->
            </div>

            <div class="field is-grouped">
              <div class="control"><a class="button is-primary is-medium" @click="addBlueprint()">Save &amp; View</a></div>
              <div class="control"><a class="button is-medium is-white" @click="addBlueprint()">Save &amp; Add Another</a></div>
            </div>
          </div>
        </div>
    </section>
  </div>
</template>

<script>
import { store } from '@/store.js'
import slug from 'slug'
import Filters from '@/components/ui/Filters'
import API from '@/services/api'

import Upload from '@/components/ui/Upload'

import Quill from 'quill'

export default {
  store,
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
      errors: {
        import: false
      },
      url: '',
      imported: {
        title: '',
        media: [],
        tags: [],
        stats: {}
      },
      wasImported: false,
      enableStats: false,
      enableRatings: false,
      filterOptions: {
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
          visible: true,
        },
        'materials': {
          label: 'Materials',
          type: 'list',
          visible: true
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
          type: 'list'
        },
        'facilities': {
          label: 'Facilities & Utilities',
          type: 'list'
        },
        'construction-kits': {
          label: 'Construction Kits',
          type: 'list',
          dlc: true,
          visible: true,
          force: true
        },
        'coasters': {
          label: 'Coasters',
          type: 'list'
        },
        'rides': {
          label: 'Rides',
          type: 'list'
        },
        'regions': {
          label: 'Biomes',
          type: 'list'
        },
      }
    }
  },
  methods: {
    importItem() {
      this.loading.importing = true
      this.errors.import = false
      API.post('import', { url: this.url }).then((data) => {

        if(data.type != 'blueprint') {
          this.errors.import = 'That workshop item is not a Blueprint'
        } else {
          console.log(this.$refs)
          Object.assign(this.imported, data)
          this.$refs.tags.setPopulated(this.imported.tags)
          this.imported.slug = slug(this.imported.title)

          let cover = this.imported.cover || this.imported.image || this.imported.images[0]

          if(cover) {
            API.post('media', {
              name: `${this.imported.slug}-cover.jpg`,
              url: cover,
              external: 'steam',
              contentType: 'image/jpeg',
              status: true
            }).then((c) => {
              this.imported.media.push(c)
            })

          }


          this.step = 1
          this.wasImported = true

          this.$nextTick(() => {
            this.attachEditor()
          })
        }

        this.loading.importing = false
      }).catch((err) => {
        console.log(err)
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
      this.step = 1
      this.$nextTick(() => {
        this.attachEditor()
      })
    },
    isImperial() {
      return this.$store.state.measurements == 'imperial'
    },
    addBlueprint() {
      let newBlueprint = {
        media: [],
        tags: []
      }
      newBlueprint.name = this.imported.title
      newBlueprint.steam_id = this.imported.steam_id
      newBlueprint.description = this.editor.container.firstChild.innerHTML
      newBlueprint.tags = this.$refs.tags.selected

      for(let i=0;i<this.imported.media.length;i++) {
        newBlueprint.media.push(this.imported.media[i]._id)
      }

      console.log('new blueprint', newBlueprint)

      API.post('blueprints', newBlueprint).then((data) => {
        console.log(data)
        this.$notify('notifications', 'Blueprint created!', 'success')
      }).catch((err) => {
        console.log(err)
        this.$notify('notifications', 'Error creating Blueprint', 'error')
      })

    }
  },
  mounted () {
    console.log(this.$store.measurements)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
