<template>
  <div class="ui form">
    <div class="level">
      <div class="level-left">
        <figure class="image is-128x128 level-item">
          <img :src="user.avatar ? user.avatar.url : 'http://placehold.it/100x100'" class="ui image small" />
        </figure>
        <div class="level-item">
          <button class="ui button" @click="uploadAvatar = (uploadAvatar == false) ? true : false" type="submit">Update Avatar</button>
        </div>
      </div>
    </div>

    <Upload @uploaded="updateAvatar" folder="users" :instant="true" :maxItems="1" v-if="uploadAvatar">

    </Upload>

    <div class="field">
    <div class="field-body">
      <div class="field">
        <label class="label">Real Name</label>
        <div class="control"><input type="text" v-model="user.name.real" class="input is-medium"></div>
      </div>
      <div class="field">
        <label class="label">Display Name (Steam)</label>
        <div class="control"><input type="text" v-model="user.name.display" class="input is-medium"></div>
      </div>
    </div>
    </div>

    <div class="field">
      <label class="label">Email</label>
      <div class="control"><input type="email" v-model="user.email" class="input is-medium"></div>
      <div class="notification is-warning" v-if="this.errors.email">{{ this.errors.email }}</div>
    </div>



    <div class="box">
      You can request a <a href="#">one-time login link</a> sent to the email address above at any time. This will let you log back in to PlanCo World if you lose access to your Steam account.
    </div>

    <div class="ui divider"></div>

    <button class="button is-primary is-medium" @click="updateUser" :class="{ loading: updating }" type="submit">Save Account</button>
  </div>
</template>

<script>
import API from '@/services/api'
import auth from '@/services/auth'

import Upload from '../ui/Upload'

export default {
  name: 'account',
  components: {
    Upload
  },
  data () {
    return {
      msg: 'Your Account',
      loading: true,
      updating: false,
      uploadAvatar: false,
      user: {
        name: {},
        avatar: {}
      },
      errors: {
        email: false
      }
    }
  },
  methods: {
    getUser (params = {}) {
      return API.fetch('user', params).then((data) => {
        Object.assign(this.user, data)
        auth.user.profile = data
        return data
      }).catch((err) => {
        console.log(err)
      })
    },
    updateUser(event) {
      event.preventDefault()
      this.updating = true

      let data = JSON.parse(JSON.stringify(this.user))

      if(data.avatar) {
        console.log('changing avatar to id', data)
        data.avatar = data.avatar._id
      }

      if(['',null,undefined].indexOf(data.email) > -1) {
        this.errors.email = 'Sorry, we need an email address.'
        return false
      }

      console.log('updating user', data)

      API.put('user', data).then((updatedUser) => {
        console.log(updatedUser)
        this.updating = false
        this.$notify('notifications', 'Profile saved', 'success')
      }).catch((err) => {
        console.log(err)
        this.updating = false
        this.$notify('notifications', 'Error saving profile', 'error')
      })
    },
    updateAvatar(media) {
      this.updating = true
      if(!this.user.avatar) this.user.avatar = []
      this.$set(this.user, 'avatar', media)
      this.$set(auth.user.profile, 'avatar', media)

      console.log('Updating avatar', media)
      API.put('user', { avatar: media._id }).then(() => {
        this.updating = false
        this.uploadAvatar = false
        this.$notify('notifications', 'Avatar saved', 'success');
      }).catch((err) => {
        console.log(err)
        this.updating = false
        this.$notify('notifications', 'Error saving avatar', 'error');
      })
    }
  },
  mounted() {
    this.getUser().then(() => {
      this.loading = false
    }).catch((err) => {

    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
