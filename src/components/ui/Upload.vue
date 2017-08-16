<template>
  <form :class="{ 'upload--form': true, 'is-dark': isDark }" enctype="multipart/form-data" @submit.prevent="onSubmit" v-if="!complete">
    <div class="upload--wrapper" @ondragover="onChange">
        <div class="upload--drop-area" v-if="items.length == 0">
            <div class="instructions">{{ instructions }}</div>
            <input type="file" name="items[]" multiple @change="onChange">
        </div>
        <div class="upload--files">
          <div class="upload--file" v-for="(file, key) in items" :class="{ 'is-uploaded': file.uploaded }">
            <div class="level">
              <div class="level-left">
                <figure class="level-item image is-128x128" v-if="file.imageData" >
                    <img :src="file.imageData" />
                </figure>
                <progress class="progress is-primary is-small level-item" v-if="file.progress > 0 && file.progress < 100" :value="file.progress" max="100"> </progress>
              </div>
              <div class="level-right">
                <div class="tag is-primary" v-if="!file.uploaded && file.progress == 0">Ready to Upload</div>
                <div class="tag is-warning" v-if="file.failed">Failed</div>
                <div class="tag is-success" v-if="file.uploaded">Uploaded</div>
                <a @click="removeItem(key)" class="upload--delete level-item button is-link">Delete</a>
              </div>
            </div>

          </div>
        </div>
    </div>
    <a href="#" class="button is-light" @click="toggleToolbox" v-if="enableToolbox">Get from Toolbox</a>
    <button type="submit" class="ui button secondary" v-if="!instant" :disabled="items.length < minItems || items.length > maxItems">Upload</button>
  </form>
</template>

<script>
import API from '@/services/api'
import auth from '@/services/auth'
import { ToolBus } from '@/components/Toolbus.js'

import axios from 'axios'

import Toolbox from '@/components/Toolbox'

export default {
  props: {
    maxItems: {
        type: Number,
        default: 3
    },
    instructions: {
      type: String,
      default: 'Drop files here, or click to browse'
    },
    folder: {
      type: String,
      default: ''
    },
    transcode: {
      type: Boolean,
      default: false
    },
    instant: {
      type: Boolean,
      default: false
    },
    enableToolbox: {
      type: Boolean,
      default: true
    },
    isDark: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      items: [],
      minItems: 1,
      successMsg: '',
      errorMsg: '',
      complete: false,
      completed: [],
      loading: false
    }
  },
  methods: {
    toggleToolbox(e) {
      e.preventDefault()
      ToolBus.$emit('toggle', 'images')
    },
    // http://scratch99.com/web-development/javascript/convert-bytes-to-mb-kb/
    bytesToSize(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return 'n/a';
        let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        if (i === 0) return bytes + ' ' + sizes[i];
        return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
    },
    onChange(e) {
        this.formData = new FormData();
        let files = e.target.files || e.dataTransfer.files;
        for(let x=0;x<files.length;x++) {
            if(!isNaN(x)) {

              this.items.push({
                file: e.target.files[x] || e.dataTransfer.files[x],
                name: files[x].name,
                type: files[x].type,
                size: files[x].size,
                sizeFormatted: this.bytesToSize(files[x].size),
                transcode: false,
                uploaded: false,
                failed: false,
                loading: false,
                progress: 0
              })

              let n = this.items.length - 1

              let allowed = ['image/png','image/jpeg']

              if(allowed.indexOf(this.items[n].type) > -1) {
                let reader = new FileReader()
                reader.addEventListener('load', () => {
                  this.$set(this.items[n], 'imageData', reader.result)
                })

                reader.readAsDataURL(this.items[n].file)
              }


            }
        }

        if(this.instant === true) {
          this.onSubmit()
        }
        //this.itemsTotalSize = this.bytesToSize(fileSizes);
    },
    removeItem(n) {
      // @todo remove from DB
      console.log('removing '+ (n-1))
      this.$emit('deleted', this.items[n-1])
      this.$delete(this.items, (n-1))
      console.log(this.items)
    },
    removeItems() {
        this.items = [];
    },
    onSubmit() {
        this.formData.append('items[]', this.items);

        for(let i=0;i<this.items.length;i++) {
          let file = this.items[i]
          if(!file.uploaded) {
            file.progress = 5
            file.loading = true
            file.failed = false
            // Sign the file for S3
            API.post('media/sign', { filename: file.name, filetype: file.type, folder: this.folder, size: file.size, transcode: this.transcode }).then((signature) => {
              file.progress = 10
              // Cache the public url for Media creation
              file.publicURL = signature.url
              file.key = signature.key
              // Upload file to S3 using signed request
              axios({
                method: 'PUT',
                url: signature.signedRequest,
                headers: { 'Content-Type': signature.contentType },
                data: file.file,
                onUploadProgress: function (progressEvent) {
                  // Update Upload Progress
                  let newProgress = (progressEvent.loaded / progressEvent.total * 100)
                  if(newProgress > 15) {
                    file.progress = (progressEvent.loaded / progressEvent.total * 100)
                  }

                }
              }).then((response) => {
                // If signature has returned with a signed transcode request
                let transcoder = { }
                if(signature.isTranscodePending) {
                  transcoder = { isPending: true }
                }
                // Create new Media with S3 object
                return API.post('media', { name: file.name, key: file.key, contentType: file.type, size: file.size, url: file.publicURL, transcoder })
              }).then((media) => {
                console.log('uploaded', media)
                file.loading = false
                file.uploaded = true
                this.completed.push(file.key)
                if(this.completed.length == this.items.length) this.complete = true
                // Emit the new Media to the parent to save reference ID
                this.$emit('uploaded', media)
              }).catch((err) => {
                console.log('error uploading', err)
                file.failed = true
                this.$notify('notifications', 'Error uploading', 'error')
              })
            }).catch((err) => {
              console.log('error signing', err)
              file.failed = true
              this.$notify('notifications', 'Error signing', 'error')
            })
          }


        }
    }
  },
  mounted () {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>


<!-- // this.zone = new FileDrop(this.$el, {})
//
// this.zone.event('send', (files) => {
//   files.each((file) => {
//     let uploadURL, preview
//
//     file.event('done', function(xhr) {
//       //this points to fd.File instance
//       console.log(xhr.responseText, preview)
//     })
//
//     file.event('progress', (current, total) => {
//       let width = current / total * 100 + '%'
//     })
//
//     API.post('media/sign', { filename: file.name, filetype: file.mime, folder: 'users' }, { headers: { 'Authorization': auth.getAuthHeader() }}).then((response) => {
//       preview = response.url
//       uploadURL  = response.signedRequest
//
//       file.event('xhrSetup', (xhr, opt) => {
//         xhr.setRequestHeader('Content-Type', response.contentType)
//         xhr.setRequestHeader('x-amz-acl', response.acl)
//       })
//
//       console.log(response)
//       file.sendTo(uploadURL, {method: 'PUT'})
//     })
//
//   })
// }) -->
