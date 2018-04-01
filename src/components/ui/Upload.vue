<template>
  <form :class="{ 'upload--form': true, 'is-dark': isDark }" enctype="multipart/form-data" @submit.prevent="onSubmit">
    <div class="upload--wrapper" @ondragover="onChange">
        <div class="upload--drop-area" v-if="items.length == 0">
            <div class="instructions">{{ instructions }}</div>
            <input type="file" name="items[]" multiple @change="onChange">
        </div>
        <div class="upload--files">
          <div :class="{ 'upload--file': true, 'box': isDark, 'is-uploaded': file.uploaded }" v-for="(file, key) in items">
            <div class="level">
              <div class="level-left">
                <figure class="level-item image is-128x128" v-if="file.imageData" >
                    <img :src="file.imageData" />
                </figure>
                <span class="level-item">{{ file.name }}</span>
                <span class="tag level-item is-outlined">{{ file.duration }} Seconds</span>
              </div>
              <div class="level-right">
                <progress class="progress is-primary is-small level-item" v-if="file.progress > 0 && file.progress < 100" :value="file.progress" max="100"> </progress>
                <div class="tag is-primary is-medium level-item" v-if="file.ready">Ready to Upload</div>
                <div class="tag is-warning is-medium level-item" v-if="file.failed"><span class="icon"><i class="fas fa-exclamation-triangle"></i></span> <span>Failed</span></div>

                <div class="tag is-success is-medium level-item" v-if="file.uploaded && !file.transcoding && !file.transcoded">Uploaded</div>
                <div class="tag is-primary is-medium level-item" v-if="file.uploaded && file.isTranscodePending && !file.transcoding && !file.transcoded">Preparing Transcode  <span class="icon"><i class="fas fa-cog fa-spin"></i></span></div>
                <div class="tag is-success is-medium level-item" v-if="file.transcoded">Transcoded  <span class="icon"><i class="fas fa-check"></i></span></div>
                <div class="tag is-primary is-medium level-item" v-if="file.transcoding">Transcoding <span class="icon"><i class="fas fa-cog fa-spin"></i></span></div>

                <a @click="removeItem(key)" class="upload--delete level-item button is-link"><span class="icon"><i class="fas fa-trash"></i></span></a>
              </div>
            </div>

          </div>
        </div>
    </div>
    <a href="#" class="button is-warning" @click="toggleToolbox" v-if="enableToolbox"><span>Get from</span> <span class="icon"><i class="fas fa-archive"></i></span></a>
    <button type="submit" class="button is-primary" :class="{ 'is-loading': loading }" v-if="!instant" :disabled="items.length < minItems || items.length > maxItems"><span class="icon"><i class="fas fa-cloud-upload"></i></span> <span>Upload</span></button>
  </form>
</template>

<script>
import API from '@/services/api'
import auth from '@/services/auth'
import Media from '@/services/media'
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
      loading: false,
      transcodeQueue: [],
    }
  },
  methods: {
    toggleToolbox(e) {
      e.preventDefault()
      ToolBus.$emit('toggle', { tab: 'images', selectMode: ['images', 'videos'], uid: this._uid })
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
        //this.formData = new FormData();
        let files = e.target.files || e.dataTransfer.files;
        for(let x=0;x<files.length;x++) {
            if(!isNaN(x)) {
              let file = {
                file: e.target.files[x] || e.dataTransfer.files[x],
                name: files[x].name,
                type: files[x].type,
                size: files[x].size,
                sizeFormatted: this.bytesToSize(files[x].size),
                ready: false,
                duration: false,
                uploaded: false,
                isTranscodePending: false,
                transcoding: false,
                transcoded: false,
                failed: false,
                progress: 0
              }

              let allowed = Media.isAllowedType(file.type)

              if(this.transcode) {
                console.log('checking if can transcode '+file.type)
                allowed = Media.canTranscode(file.type)
              }

              if(allowed) {
                console.log('file is allowed')
                // If allowed, add to upload queue
                this.items.push(file)
                let n = this.items.length - 1

                if(Media.isImage(file.type)) {
                  // Set file as ready to upload
                  file.ready = true
                  // Add preview of image
                  let reader = new FileReader()
                  reader.addEventListener('load', () => {
                    this.$set(this.items[n], 'imageData', reader.result)
                  })
                  reader.readAsDataURL(this.items[n].file)
                } else if(Media.canTranscode(file.type) || Media.isVideo(file.type)) {
                  console.log('checking duration')
                  // Check duration of the video
                  let v = document.createElement('video')
                  v.preload = 'metadata'
                  v.onloadedmetadata = () => {
                    this.items[n].duration = v.duration.toFixed(1)
                    this.items[n].ready = true

                    if(this.instant === true) {
                      this.onSubmit()
                    }
                  }
                  v.src = URL.createObjectURL(file.file)
                }
              }


            }
        }

        // If instant is enabled, upload files immediately
        if(this.instant === true) {
          this.onSubmit()
        }
    },
    removeItem(n) {
      // @todo remove from DB
      console.log('removing '+ n)

      if(this.items[n].uploaded) {
        API.delete('media/'+this.items[n].media._id).then(() => {
          this.$emit('deleted', this.items[n])
          this.$delete(this.items, n)
          this.$notify('notifications', 'Media deleted', 'success')
        })
      } else {
        this.$emit('deleted', this.items[n])
        this.$delete(this.items, n)
      }


    },
    removeItems() {
        this.items = [];
    },
    uploadFile(file, signature) {
      // Cache the public url for Media creation
      file.publicURL = signature.url
      file.key = signature.key

      return axios({
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
          file.isTranscodePending = true
        }

        // Create new Media with S3 object
        return API.post('media', { name: file.name, key: file.key, contentType: file.type, size: file.size, url: file.publicURL, transcoder, meta: { duration: file.duration }})
      }).then((media) => {
        console.log('uploaded', media)
        file.media = media
        file.uploaded = true
        return media
      }).catch((err) => {
        console.log('error uploading', err)
        file.failed = true
        this.loading = false
        this.$notify('notifications', 'Error uploading', 'error')
      })
    },
    createJob(file) {
      console.log('creating job')
      return API.post(`media/${file.media._id}/transcode`).then((response) => {
        console.log('created job', response)
        if(response.transcoder.status == 'Submitted') {
          file.isTranscodePending = false
          file.transcoding = true
          this.completed.push(file.key)
          this.checkCompleted()
        }
        return file
      }).catch((err) => {
        console.log('error transcoding',err)
        file.failed = true
        this.$notify('notifications', 'Error preparing transcode', 'error')
      })
    },
    checkJob(file) {
      if(!file.transcoded) {
        console.log('checking job')
        return API.fetch(`media/${file.media._id}/transcode`).then((response) => {
          if(response.transcoder.status == 'Complete') {
             file.transcoded = true
             file.transcoding = false
          }

          if(response.transcoder.status == 'Progress') {
            file.transcoding = true
          }

          if(response.transcoder.status == 'Error') {
             file.transcoding = false
             file.isTranscodePending = true
             file.failed = true
          }

          return file
        })
      }

      return file
    },
    checkCompleted() {
      if(this.completed.length == this.items.length) {
        this.loading = false
        this.complete = true
      }

      return this.complete
    },
    onSubmit() {
        this.loading = true
        //this.formData.append('items[]', this.items);
        for(let i=0;i<this.items.length;i++) {
          let file = this.items[i]
          if(file.ready) {
            file.ready = false
            file.progress = 5
            file.failed = false
            let duration = file.duration ? file.duration : undefined
            // Sign the file for S3
            API.post('media/sign', { filename: file.name, filetype: file.type, folder: this.folder, size: file.size, transcode: this.transcode, duration })
            .then((signature) => {
              file.progress = 10
              // Upload file to S3 using signed request
              return this.uploadFile(file, signature)
            }).then(() => {
              console.log('uploaded file', file)
              // After media has been created, check if Transcode is pending and create job
              if(file.isTranscodePending == true) {
                console.log('file is pending')
                return this.createJob(file)
              } else {
                console.log('file is not pending')
                this.completed.push(file.key)
                this.checkCompleted()
                // Emit the new Media to the parent to save reference ID
                return file
              }
            }).then((file) => {
              if(file.transcoding) {
                let checking = setInterval(() => {
                  this.checkJob(file).then(() => {
                    if(file.transcoded) {
                      clearInterval(checking)
                    }
                  })
                }, 5000)
              }
              // Emit the new Media to the parent to save reference ID
              this.$emit('uploaded', file.media)
            }).catch((err) => {
              console.log('error signing', err)
              file.failed = true
              this.loading = false
              this.$notify('notifications', 'Error signing', 'error')
            })
          }
        }
    },
    getTranscoding() {
      API.fetch('media', { transcoding: 'Pending', owned: true }).then((media) => {
        for(let m=0;m<media.length;m++) {
          let file = {
            name: media[m].name,
            ready: false,
            duration: media[m].meta.duration,
            uploaded: false,
            isTranscodePending: media[m].transcoder.isPending ? true : false,
            transcoding: (media[m].transcoder.isPending == false && media[m].transcoder.status == 'Progressing') ? true : false,
            transcoded: false,
            failed: false,
            media: media[m]
          }

          this.items.push(file)
        }
      })
    }
  },
  mounted () {
    if(this.transcoding) {
      this.getTranscoding()
    }

    // When a user selects an item from the toolbox while in select mode
    ToolBus.$on('select', (data) => {
      if(this._uid !== data.uid) return
      let media = data.media
      console.log(media)
      let allowed = Media.isAllowedType(media.contentType)
      if(allowed) {
        this.$emit('uploaded', media)
      } else {
        this.$notify('notifications', 'That is not allowed here', 'error')
      }
    })
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
