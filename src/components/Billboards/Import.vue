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
            <router-link :to="{ name: 'GuidePage', params: { slug: 'advertising-and-billboards' }}" class="level-item">Learn about Billboards</router-link>
          </div>
        </div>
      </div>
    </section>
    <section class="hero hero--tall">
        <Upload @uploaded="addMedia" :maxItems="1" :allowFiles="false" folder="billboards" :isDark="true" :instant="true" instructions="Drop your billboard image or webm here, or click to browse your computer" v-if="imported.media.length == 0"></Upload>
        <img :src="imported.media[0].url" v-if="imported.media[0] && imported.media[0].type == 'image'" class="cover-photo" />
        <video class="cover-photo" v-if="imported.media[0] && imported.media[0].type == 'video'" autoplay loop>
          <source :src="imported.media[0].url" v-if="imported.media[0] && imported.media[0].type == 'video'">
        </video>
    </section>
    <section class="section">
      <div class="columns is-centered">
        <div class="form content for-billboard column is-three-quarters is-centered" id="form">

         
          <div class="box">
            <h5 class="title is-5">Billboard Title</h5>
            <div class="control">
              <input type="text" name="title" v-model="imported.title" @input="$v.imported.title.$touch()" class="input is-medium" :class="{ 'is-danger': $v.imported.title.$error }" placeholder="" />
            </div>
          </div>

          <div class="box">
            <h5 class="title is-5">About your Billboard</h5>
            <div class="description editor" v-html="imported.description"></div>
          </div>

          <div class="field box filter-list">
            <h5 class="title is-5">Source Files</h5>
            <p class="field description">Upload your <code>sketch</code> <code>psd</code> or <code>ai</code> files to allow players to customize this billboard.</p>
            <p class="field description">Maximum of 5 files, 100 MB each.</p>
            <Upload @uploaded="addSource" :maxItems="5" :allowFiles="true" folder="billboards" :enableToolbox="false" :instant="false" instructions="Drop your source files here, or click to browse your computer"></Upload>
          </div>

          <div class="field box filter-list">
            <h5 class="title is-5">Add to a Kit</h5>
            <p class="field description">If you are creating a pack of related billboards: Upload and tag them individually and add them to a Kit! Kits can include Parks and Blueprints as well.</p>
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

          <CreateKit @created="addToKit" :show="creatingKit" @cancel="creatingKit = false"></CreateKit>
          

          <div class="field">
            <Filters :options="filterOptions" :selected="imported.tags" @selected="addTags" ref="tags" ></Filters>
            <!-- <a class="button" @click="">Add Tags</a><div class="field is-grouped is-grouped-multiline">
              <div class="control" v-for="tag in imported.tags">
                <div class="tag is-primary is-medium">{{ tag.name }} <button class="delete is-small"></button></div>
              </div>
            </div> -->
          </div>

          <div class="field is-grouped">
            <div class="control"><a class="button is-medium is-primary" @click="addBillboard()">Save Billboard</a></div>
            <div class="control"><a class="button is-medium is-white" @click="addBillboard(true)">Save &amp; Add Another</a></div>
          </div>


        </div>
      </div>
    </section>
  </div>
</template>

<script>
import SmoothScroll from 'smooth-scroll'
import CreateKit from '@/components/Kits/CreateModal'
import Modal from '@/components/ui/Modal'
import Filters from '@/components/ui/Filters'
import Autocomplete from '@/components/ui/Autocomplete'
import API from '@/services/api'
import Media from '@/services/media'

import Upload from '@/components/ui/Upload'

import Quill from 'quill'
import slug from 'slug'

import { required } from 'vuelidate/lib/validators'

export default {
  name: 'Import',
  components: {
    Upload,
    Filters,
    Autocomplete,
    Modal,
    CreateKit,
  },
  validations: {
    url: {
      required
    },
    imported: {
      title: {
        required,
      }
    }
  },
  data () {
    return {
      loading: {
        importing: false,
        creating: false,
      },
      url: 'http://steamcommunity.com/sharedfiles/filedetails/?id=1085896826',
      imported: {
        title: '',
        media: [],
        source: [],
        tags: []
      },
      kits: [],
      creatingKit: false,
      wasImported: false,
      filterOptions: {
        'contests': {
          label: 'Enter a Contest',
          description: 'You may submit up to 3 billboards per contest.',
          type:'list',
          force: true,
          visible: true,
          max: 1,
        },
        'billboards': {
          label: 'Type of Media',
          type: 'toggle',
          visible: true,
          force: true,
          min: 1,
          max: 1,
          required: true,
        },
        'billboards-movie': {
          label: null,
          type:'switch',
          force: true,
          visible: true,
          if: '59654fdf12341326996d3359',
        },
        'orientation': {
          label: 'Orientation',
          type: 'toggle',
          visible: true,
          force: true,
          tooltips: true,
          required: true,
          description: 'Remember, <code>vertical</code> billboards should be rotated 90deg for proper alignment with the screens. We will rotate the video back to preview it properly.',
          min: 1,
          max: 1,
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
          required: true,
        },
        'language': {
          label: 'Language',
          type: 'list',
          visible: true
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
      // console.log('adding', media)
      this.imported.media.push(media)

      if(Media.isImage(media.contentType)) {
        this.$refs.tags.checkTagById('59654fd912341326996d3358')
      } else if(Media.isVideo(media.contentType)) {
        this.$refs.tags.checkTagById('59654fdf12341326996d3359')

        if(Media.hasAudio(document.querySelector('video.cover-photo'))) {
          this.$refs.tags.checkTagById('5ad28ac89bb394631b4dadab')
        }
      }
    },
    addSource(media) {
      this.imported.source.push(media._id)
    },
    addTags(tags) {
      this.imported.tags = tags
    },
    addBillboard(addAnother = false) {
      let data = {
        media: [],
        tags: []
      }

      this.$v.imported.$touch()
      let isTagsValid = this.$refs.tags.isValid()
      if(this.$v.imported.$invalid || !isTagsValid) {
        new SmoothScroll().animateScroll(this.$el.querySelector('#form'), false, { offset: 100 })
        return
      }

      data.name = this.imported.title
      data.description = this.editor.container.firstChild.innerHTML
      data.colors = this.imported.colors
      
      this.imported.tags.forEach((t) => {
        data.tags.push(t._id)
      })

      // Currently only permits one image per billboard
      data.media.push(this.imported.media[0])
      data.source = this.imported.source

      let billboard = {}
      API.post('billboards', data).then((data) => {
        billboard = data
        this.$notify('notifications', `${billboard.name} created!`, 'success')

        let addToKits = []
        if(this.kits.length > 0) this.$notify('notifications', `Adding ${billboard.name} to your kits`)
        this.kits.forEach(kit => {
          if(!kit.billboards) kit.billboards = []
          kit.billboards.push(billboard._id)
          addToKits.push(API.put('kits/'+kit._id, { billboards: kit.billboards }))
        })
        return Promise.all(addToKits)
      }).then((addedToKits) => {
        if(addedToKits.length > 0) this.$notify('notifications', `${billboard.name} added to your kits`, 'success')
        if(addAnother) {
          this.$router.push({ name: 'ImportBillboard' })
          new SmoothScroll().animateScroll(document.body)
        } else {
          this.$router.push({ name: 'Billboard', params: { slug: billboard.slug }})
        } 
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
      this.creatingKit = false
    },
    removeFromKit(index) {
      this.kits.splice(index, 1)
    },
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
