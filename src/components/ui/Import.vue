<template>
  <div class="modal" :class="{ 'is-active': show }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Import from Steam</p>
        <button class="delete" @click="close()"></button>
      </header>
      <section class="modal-card-body">
        <div class="field" v-if="!imported.type">
          <div class="field">
            <div class="control">
              <input type="text" name="url" v-model="url" class="input is-medium" placeholder="http://steamcommunity.com/sharedfiles/filedetails/?id=#########" />
            </div>
          </div>
          <!-- <button class="ui button" @click="addField()" :disabled="fields >= max">Add Another</button> -->
        </div>
        <div class="form for-blueprint" v-if="imported.type == 'blueprint'">
          <div class="field">
            <label class="label">Title</label>
            <div class="control">
              <input type="text" name="title" v-model="imported.title" class="input is-medium" disabled />
            </div>
          </div>
          <div class="field">
            <label class="label">Tags</label>
            <p class="field">Add and remove any tags to organize as you see fit!</p>
            <div class="field is-grouped is-grouped-multiline">
              <div class="control" v-for="tag in imported.tags">
                <div class="tag is-primary is-medium">{{ tag.name }} <button class="delete is-small"></button></div>
              </div>
            </div>
          </div>
          <div class="field">
            <label class="label">Billboards</label>
            <a class="button">Search</a> or  <a class="button">Upload</a>
          </div>
          <div class="field">
            <label class="label">Description</label>
            <div class="description editor" v-html="imported.description"></div>
          </div>
        </div>
        <div class="form for-park">

        </div>
      </section>
      <footer class="modal-card-foot">
          <button class="button is-primary" :class="{ 'is-loading': loading.importing }" @click="importItem()">Import</button>
          <button class="button" @click="close()">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import API from '@/services/api'

import Quill from 'quill'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'

export default {
  name: 'Import',
  data () {
    return {
      show: true,
      loading: {
        importing: false
      },
      modal: {},
      url: 'http://steamcommunity.com/sharedfiles/filedetails/?id=1091567657',
      fields: 1,
      max: 5,
      imported: {},
    }
  },
  methods: {
    close() {
      this.show = false
      this.$router.go(-1)
    },
    importItem() {
      this.loading.importing = true
      API.post('import', { url: this.url }).then((data) => {
        this.imported = data
        this.loading.importing = false

        Vue.nextTick(() => {
          this.attachEditor()
        })
      })
    },
    addField() {
      if(this.fields <= this.max) this.fields++
    },
    attachEditor() {
      let wrapper = this.$el.querySelector('.editor')
      this.editor = new Quill(wrapper, {
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            ['image', 'code-block']
          ]
        },
        theme: 'snow'
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
