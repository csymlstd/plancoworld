import api from '@/services/api'

export default {

  getAlternateUrl(alternate, originalUrl) {
    if(!alternate || !originalUrl) return null

    let extension = this.getExtension(originalUrl)
    let newUrl = originalUrl.replace(`.${extension}`, '')
    newUrl = `${newUrl}-${alternate}.${extension}`
    return newUrl
  },

  getExtension(filename) {
    const extreg = /(?:\.([^.]+))?$/
    return extreg.exec(filename)[1]
  }
}
