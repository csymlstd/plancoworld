<template>
  <div>
    <section class="hero hero--tall" :style="{ 'background-image': 'url('+(kit.media.length > 0 ? kit.media[0].url : '')+')' }">
      <div class="container">
        <Upload @uploaded="addPhoto" folder="kits" :instant="true" :isDark="true" instructions="Drop your kit photos here, or click to browse your computer" v-if="kit.media.length == 0 && !loading.importingMedia"></Upload>

      </div>
      <!-- <img :src="kit.media ? kit.media[0].url : ''" v-if="kit.media.length > 0" class="cover-photo" @load="$event.target.classList.toggle('is-active')" /> -->
    </section>
    <section class="hero">
      <div class="container">
        <div class="level">
          <div class="level-left">
            <h1 class="title level-item"><router-link :to="{ name: 'Kits' }">Kits</router-link></h1>
            <h1 class="title level-item"> / {{ kit.title || 'Create a Kit' }}</h1>
          </div>
          <div class="level-right">
          </div>
        </div>
      </div>
    </section>
    <section class="section">

      <div class="form content for-park columns is-centered" id="form">
          <div class="column is-three-quarters">
            <div class="box">
              <h4>Kit Name</h4>
              <div class="field">
                <div class="control">
                  <input type="text" name="title" v-model="kit.title" @input="$v.kit.title.$touch()" class="input is-medium" :class="{ 'is-danger': $v.kit.title.$error }" placeholder="PlanCo World" />
                </div>
              </div>
            </div>

            <div class="box">
              <h4>About Your Kit</h4>
              <div class="description editor"></div>
            </div>

            <div class="box filter-list">
              <h4>Color Palette</h4>
              <p class="description">Save the colors used throughout the buildings, rides, scenery, and billboards.</p>
              <ColorPalette v-model="kit.colors" :editMode="true"></ColorPalette>
            </div>
           
            <div class="field">
              <Filters :options="filterOptions" :selected="kit.tags" @selected="kit.tags = $event" ref="tags" ></Filters>
            </div>

            <div class="field is-grouped">
              <div class="control"><a class="button is-primary is-large" @click="addKit()">Save &amp; Add Creations</a></div>
            </div>
          </div>
        </div>
    </section>
  </div>
</template>

<script>
import SmoothScroll from 'smooth-scroll'
import Modal from '@/components/ui/Modal'
import Autocomplete from '@/components/ui/Autocomplete'
import Loader from '@/components/ui/Loader'
import Filters from '@/components/ui/Filters'
import API from '@/services/api'
import slug from 'slug'

import Upload from '@/components/ui/Upload'
import ColorPalette from '@/components/ui/ColorPalette'
import Quill from 'quill'

import { required } from 'vuelidate/lib/validators'

export default {
  name: 'Import',
  components: {
    Upload,
    Filters,
    Modal,
    ColorPalette,
    Autocomplete,
    Loader
  },
  data () {
    return {
      loading: {
        importing: false,
        importingMedia: false,
      },
      errors: {
        import: false
      },
      kit: {
          title: '',
          media: [],
          blueprints: [],
          billboards: [],
          parks: [],
          colors: [],
          tags: [],
      },
      filterOptions: {
        'coasters': {
          label: 'Coasters',
          type: 'list'
        },
        'rides': {
          label: 'Rides',
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
        },
        'materials': {
          label: 'Materials',
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
        'content-packs': {
          label: 'Content Packs',
          type: 'list',
          dlc: true,
          visible: true,
          force: true
        },
      }
    }
  },
  validations: {
    kit: {
      title: {
        required: required,

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
    addPhoto(media) {
      console.log('adding', media)
      this.kit.media.push(media)
    },
    addKit() {
      let data = {
        media: [],
        tags: []
      }
      data.name = this.kit.title
      data.colors = this.kit.colors
      data.description = this.editor.container.firstChild.innerHTML
      
      this.kit.tags.forEach((t) => {
        data.tags.push(t._id)
      })
      
      this.kit.media.forEach((t) => {
        data.media.push(t._id)
      })

      this.$v.kit.$touch()
      let isTagsValid = this.$refs.tags.isValid()
      if(this.$v.kit.$invalid || !isTagsValid) {
        new SmoothScroll().animateScroll(this.$el.querySelector('#form'), false, { offset: 100 })
        return
      }

      API.post('kits', data).then((data) => {
        this.$notify('notifications', 'Kit created!', 'success')
        this.$router.push({ name: 'Kit', params: { slug: data.slug }})
      }).catch((err) => {
        console.log(err)
        this.$notify('notifications', 'Error creating Park', 'error')
      })

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
