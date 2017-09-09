import api from '@/services/api'

const imageTypes = ['image/png','image/jpeg','image/gif']
const fileTypes = ['application/pdf','application/octet-stream','application/postscript']
const audioTypes = ['audio/webm','audio/ogg','audio/mpeg3','audio/x-mpeg-3','audio/wav','audio/x-wav','audio/x-ms-wma','audio/aac','audio/mp4','audio/flac']
const videoTypes = ['video/webm']
const transcoderTypes = ['video/mp4']
const allowedTypes = imageTypes.concat(fileTypes, audioTypes, videoTypes, transcoderTypes)

const imageExtensions = ['png','jpg','jpeg','gif','tiff']
const fileExtensions = ['pdf','sketch','psd','ai']
const audioExtensions = ['webm','ogg','mp3','wav','wma','aac','m4a','flac']
const videoExtensions = ['webm','mp4']
const allowedExtensions = imageExtensions.concat(fileExtensions, audioExtensions, videoExtensions)

const allowedFolders = ['billboards', 'parks', 'blueprints', 'users', 'audio']

export default {

  getAlternateUrl(alternate, originalUrl) {
    if(!alternate || !originalUrl) return null
    let extension = '.' + this.getExtension(originalUrl)
    let alternateExtension = this.getExtension(alternate)

    let noExUrl = originalUrl.replace(`${extension}`, '')
    if(alternateExtension) extension = ''
    let newUrl = `${noExUrl}-${alternate}${extension}`
    return newUrl
  },

  getExtension(filename) {
    const extreg = /(?:\.([^.]+))?$/
    return extreg.exec(filename)[1]
  },

  generateMediaFromUrl(url, external, contentType) {
    return {
      url,
      external,
      contentType,
      status: true,
    }
  },

  removeExtension(filename) {
    let ext = this.getExtension(filename)
    return filename.replace('.'+ext,'')
  },

  getPrivateUrl(key) {
    return 'https://plancoworld.s3.amazonaws.com/'+key
  },

  isAllowedType(type) {
    return (allowedTypes.indexOf(type) > -1)
  },

  isAllowedExtension(extension) {
    return (allowedExtensions.indexOf(extension) > -1)
  },

  isAllowedFolder(folder) {
    return (allowedFolders.indexOf(folder) > -1)
  },

  isImage(type) {
    return (imageTypes.indexOf(type) > -1)
  },

  isAudio(type) {
    return (audioTypes.indexOf(type) > -1)
  },

  isVideo(type) {
    return (videoTypes.indexOf(type) > -1)
  },

  isFile(type) {
    return (fileTypes.indexOf(type) > -1)
  },

  canTranscode(type) {
    return (transcoderTypes.indexOf(type) > -1)
  },
}