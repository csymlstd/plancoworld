<template>
  <div>
    <section class="hero">
      <div class="container">
        <div class="level">
          <div class="level-left">
            <h1 class="title level-item"><router-link :to="{ name: 'Billboards' }">Billboards</router-link></h1>
            <h1 class="title level-item"> / Add a Billboard</h1>
          </div>
          <div class="level-right">
            <!-- <router-link :to="{ name: 'Generator' }" class="level-item">Generator</router-link> -->
            <!-- <router-link :to="{ name: 'Convert' }" class="level-item">Convert to WebM</router-link> -->
            <router-link :to="{ name: 'ImportBillboard' }" class="button is-primary is-medium">Add a Billboard</router-link>
          </div>
        </div>
      </div>
    </section>
    <section class="hero hero--tall">
        <Upload @uploaded="addMedia" :maxItems="1" folder="billboards" :isDark="true" :instant="true" instructions="Drop your billboard image or webm here, or click to browse your computer" v-if="imported.media.length == 0"></Upload>
        <img :src="imported.media[0].url" v-if="imported.media[0] && imported.media[0].type == 'image'" class="cover-photo" />
        <video class="cover-photo" v-if="imported.media[0] && imported.media[0].type == 'video'" autoplay loop>
          <source :src="imported.media[0].url" v-if="imported.media[0] && imported.media[0].type == 'video'">
        </video>
    </section>
    <section class="section">
      <div class="columns is-centered">
        <div class="form content for-billboard column is-three-quarters is-centered">

         
          <div class="field">
            <h4 class="title is-4">Billboard Title</h4>
            <div class="control">
              <input type="text" name="title" v-model="imported.title" class="input is-medium" placeholder="PlanCo World Entrance Sign" />
            </div>
          </div>

          <div class="field">
            <h4 class="title is-4">About your Billboard</h4>
            <div class="box">
              <div class="description editor" v-html="imported.description"></div>
            </div>
          </div>

          <div class="field box">
            <h4 class="title is-4">Add to a Kit</h4>
            <p class="field">If you are creating a pack of related billboards: Upload and tag them individually and add them to a Kit! Kits can include Parks and Blueprints as well.</p>
            <div class="field is-grouped">
              <Autocomplete path="kits" :owned="true" placeholder="Search for your Kits" class="control is-expanded" @selected="addToKit"></Autocomplete>
              <div class="control">
                <button class="button is-primary is-medium" @click="creatingKit = creatingKit ? false : true">Create New Kit</button>
              </div>
            </div>
            <div class="field" v-if="kits.length > 0">
              <div class="tag is-primary is-rounded is-large" :key="kit._id" v-for="(kit, index) in kits">{{ kit.name }} &nbsp;<button class="delete is-small" @click="removeFromKit(index)"></button></div>
            </div>
          </div>

          <Modal :class="['is-wide']" :show="creatingKit">
            <header>
              <h2 class="title">Create a Kit</h2>
            </header>
            <main>
            <div class="field">
              <div class="control">
                <input type="text" placeholder="Name" class="input is-medium" />
              </div>
              
            </div>

            <div class="level">
              <div class="level-left">
                <button class="button is-medium is-primary level-item" :class="{ 'is-loading': loading.creatingKit }" @click=""><span>Create Kit</span></button>
                <button class="button is-light is-medium level-item" @click="creatingKit = false">Cancel</button>
              </div>
            </div>

            </main>
        </Modal>
          

          <div class="field">
            <Filters :options="filterOptions" @selected="addTags" ref="tags" ></Filters>
            <!-- <a class="button" @click="">Add Tags</a><div class="field is-grouped is-grouped-multiline">
              <div class="control" v-for="tag in imported.tags">
                <div class="tag is-primary is-medium">{{ tag.name }} <button class="delete is-small"></button></div>
              </div>
            </div> -->
          </div>

          <div class="field is-grouped">
            <div class="control"><a class="button is-medium is-primary" @click="addBillboard()">Save Billboard</a></div>
            <div class="control"><a class="button is-medium is-white" @click="addBillboard()">Save &amp; Add Another</a></div>
          </div>


        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Modal from '@/components/ui/Modal'
import Filters from '@/components/ui/Filters'
import Autocomplete from '@/components/ui/Autocomplete'
import API from '@/services/api'
import Media from '@/services/media'

import Upload from '@/components/ui/Upload'

import Quill from 'quill'
import slug from 'slug'

export default {
  name: 'Import',
  components: {
    Upload,
    Filters,
    Autocomplete,
    Modal
  },
  data () {
    return {
      loading: {
        importing: false
      },
      url: 'http://steamcommunity.com/sharedfiles/filedetails/?id=1085896826',
      imported: {
        title: '',
        media: [],
        tags: []
      },
      kits: [],
      creatingKit: false,
      wasImported: false,
      filterOptions: {
        'billboards': {
          label: 'Type of Media',
          type: 'toggle',
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
  methods: {
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
    addMedia(media) {
      console.log('adding', media)
      this.imported.media.push(media)

      if(Media.isImage(media.contentType)) {
        this.$refs.tags.checkTag('59654fd912341326996d3358','billboards')
      } else if(Media.isVideo(media.contentType)) {
        this.$refs.tags.checkTag('59654fdf12341326996d3359','billboards')
      }
    },
    addTags(tags) {
      this.imported.tags = tags
    },
    addBillboard() {
      let newBillboard = {
        media: [],
        tags: []
      }
      newBillboard.name = this.imported.title
      newBillboard.slug = slug(this.imported.title)
      newBillboard.description = this.editor.container.firstChild.innerHTML
      newBillboard.tags = this.$refs.tags.selected

      // Currently only permits one image per billboard
      newBillboard.media.push(this.imported.media[0])

      API.post('billboards', newBillboard).then((data) => {
        this.$notify('notifications', 'Billboard created!', 'success')

        let addToKits = []
        kits.forEach(kit => {
          kit.billboards.push(data._id)
          addToKits.push(API.put('kits/'+kit._id, { billboards: kit.billboards }))
        })
        return Promise.all(addToKits)
      }).then((addedToKits) => {
        this.$notify('notifications', 'Billboard added to your Kits', 'success')
      }).catch((err) => {
        console.log(err)
        this.$notify('notifications', 'Error creating Billboard', 'error')
      })

    },
    addToKit(kit) {
      let existing = this.kits.filter(k => {
        return k._id == kit._id
      })[0]

      if(!existing) this.kits.push(kit)
    },
    removeFromKit(index) {
      this.kits.splice(index, 1)
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
