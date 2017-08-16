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
            <a class="level-item">Generator</a>
            <router-link :to="{ name: 'Convert' }" class="level-item">Convert to WebM</router-link>
            <a class="level-item">Glossary</a>
            <router-link :to="{ name: 'ImportBillboard' }" class="button is-primary is-medium">Add a Billboard</router-link>
          </div>
        </div>
      </div>
    </section>
    <section class="hero hero--tall">
      <div class="container">
        <Upload @uploaded="addPhoto" :maxItems="1" folder="billboards" :isDark="true" :instant="true" instructions="Drop your billboard image or webm here, or click to browse your computer"></Upload>
        <img :src="imported.media ? imported.media[0].url : ''" v-if="imported.media.length > 0" class="cover-photo" @load="$event.target.classList.toggle('is-active')" />
      </div>
    </section>
    <section class="section">
      <div class="columns is-centered">
        <div class="form for-park column is-three-quarters is-centered">
          <div class="field">
            <h4 class="title is-4">Billboard Title</h4>
            <div class="control">
              <input type="text" name="title" v-model="imported.title" class="input is-medium" placeholder="PlanCo World Entrance Sign" />
            </div>
          </div>

          <div class="field">
            <h4 class="title is-4">About your Billboard</h4>
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
            <div class="control"><a class="button is-medium is-primary" @click="addPark()">Save Billboard</a></div>
            <div class="control"><a class="button is-medium is-white" @click="addPark()">Save &amp; Add Another</a></div>
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
        'billboards': {
          label: 'Type of Media',
          type: 'toggle',
          visible: true,
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
    addPhoto(media) {
      console.log('adding', media)
      this.imported.media.push(media)
    },
    addBillboard() {
      let newBillboard = {
        media: [],
        tags: []
      }
      newBillboard.name = this.imported.title
      newBillboard.description = this.editor.container.firstChild.innerHTML

      for(let i=0;i<this.imported.tags.length;i++) {
        newBillboard.tags.push(this.imported.tags[i]._id)
      }

      for(let i=0;i<this.imported.media.length;i++) {
        newBillboard.media.push(this.imported.media[i]._id)
      }

      console.log('new billboard', newBillboard)

      API.post('billboards', newBillboard).then((data) => {
        console.log(data)
        this.$notify('notifications', 'Billboard created!', 'success')
      }).catch((err) => {
        console.log(err)
        this.$notify('notifications', 'Error creating Billboard', 'error')
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
