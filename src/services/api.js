import auth from './auth'
import axios from 'axios'

let API_URL = 'http://localhost:5100/v1/'
if(process.env.NODE_ENV == 'production') {
  API_URL = 'http://api.planco.world/v1/'
}
const api = axios.create({
  baseURL: API_URL,
})


let refreshing = false
function refreshExpiredToken() {
  if(auth.isLoggedIn() && auth.accessTokenExpired()) {
    if(refreshing) {
      // Set a delay to try the request, the token is probably refreshed by now
      // from a previous request
      return new Promise((resolve) => { setTimeout(() => { resolve() }, 2000) })
    }

    // Set a flag to prevent multiple refreshes
    refreshing = true
    return auth.refreshToken().then(() => {
      refreshing = false
    })
  }

  // Token is valid, continue
  return new Promise((resolve) => { resolve() })
}

export default {

  options: {

  },

  url() {
    return API_URL
  },

  fetch(resource, params = {}) {
    return refreshExpiredToken().then(() => {
      return api.get('/'+resource, { params, headers: { 'Authorization': auth.getAuthHeader() }})
    }).then((response) => {
      return response.data
    })
  },

  put(resource, data = {}) {
    return refreshExpiredToken().then(() => {
      return api.put('/'+resource, data, { headers: { 'Authorization': auth.getAuthHeader() }})
    }).then((response) => {
      return response.data
    })
  },

  delete(resource, data = {}) {
    return refreshExpiredToken().then(() => {
      return api.delete('/'+resource, { headers: { 'Authorization': auth.getAuthHeader() }})
    }).then((response) => {
      return response.data
    })
  },

  post(resource, data = {}, useHeaders = true) {
    let headers = {}
    if(useHeaders) headers = { 'Authorization': auth.getAuthHeader() }
    return refreshExpiredToken().then(() => {
      return api.post('/'+resource, data, { headers })
    }).then((response) => {
      return response.data
    })
  },

  handleError(err, model) {
    if(!err) return false

  }

}
