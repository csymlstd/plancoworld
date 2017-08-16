<template>
  <div class="ui form">
    <h3 class="title is-3">Personal Information</h3>

    <div class="field">
    <div class="field-body">
      <div class="field">
        <label class="label">First Name</label>
        <div class="control"><input type="text" v-model="user.name.first" class="input is-medium"></div>
      </div>
      <div class="field">
        <label class="label">Last Name</label>
        <div class="control"><input type="text" v-model="user.name.last" class="input is-medium"></div>
      </div>
    </div>
    </div>

    <div class="field">
      <label class="label">Email</label>
      <div class="control"><input type="email" v-model="user.email" class="input is-medium"></div>
    </div>
    <div class="field">
      <label class="label">Display Name</label>
      <div class="control"><input type="text" v-model="user.name.display" class="input is-medium"></div>
    </div>


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




    <Upload @uploaded="updateAvatar" folder="users" :maxItems="1" v-if="uploadAvatar">

    </Upload>

    <h4 class="ui dividing header">Change Your Password</h4>

    <div class="ui message warning visible" v-if="user.noPassword">
      You do not have a password. Enter one below and you can use your email address to login next time.
    </div>

    <div class="field" v-if="!user.noPassword">
      <label>New Password</label>
      <input type="password" v-model="user.password">
    </div>

    <div class="ui message visible">
      You can request a <a href="#">one-time login link</a> sent to the email address above at any time. This will let you log back in to PlanCo World if you forget your password or lose access to your Steam account.
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
    console.log(auth.getScope())
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
