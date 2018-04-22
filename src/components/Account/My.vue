<template>
  <div class="ui form">
    <div class="level">
      <div class="level-left">
        <figure class="image is-128x128 level-item">
          <img :src="user.avatar ? user.avatar.url : 'https://placehold.it/100x100'" class="ui image small" />
        </figure>
        <div class="level-item">
          <button class="ui button" @click="uploadAvatar = (uploadAvatar == false) ? true : false" type="submit">Update Avatar</button>
        </div>
      </div>
    </div>

    <Upload @uploaded="updateAvatar" :allowFiles="false" folder="users" :instant="true" :maxItems="1" v-if="uploadAvatar">

    </Upload>

    <div class="field">
    <div class="field-body">
      <div class="field">
        <label class="label">Real Name</label>
        <div class="control"><input type="text" v-model="user.name.real" class="input is-medium"></div>
      </div>
      <div class="field">
        <label class="label">Display Name (Steam Persona)</label>
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
      You can login using a one-time login link sent to the email saved above. This will let you log back in to PlanCo World if you lose access to your Steam account.
    </div>

    <div class="field">
    <div class="field-body">
      <div class="field">
        <label class="label">Distance Unit</label>
        <div class="control">
          <select v-model="user.settings.distanceUnit" class="input is-medium">
            <option value="m">Meters (m)</option>
            <option value="ft">Feet (ft)</option>
            <option value="yd">Yards (yd)</option>
          </select>
        </div>
      </div>
      <div class="field">
        <label class="label">Speed Unit</label>
        <div class="control">
          <select v-model="user.settings.speedUnit" class="input is-medium">
            <option value="mph">Miles Per Hour (mph)</option>
            <option value="kph">Kilometers Per Hour (kph)</option>
            <option value="ms">Meters Per Second (m/s)</option>
            <option value="fts">Feet Per Second (ft/s)</option>
          </select>
        </div>
      </div>


    </div>
    </div>

    <div class="notification is-warning"><p>The unit conversion feature is not quite ready yet. Save your preferred settings and you'll be ready once it is! For the time being, you'll need to use meters and miles per hour on your creations.</p></div>


    <div class="ui divider"></div>

    <div class="level">
      <div class="level-left">
        <button class="button is-primary is-medium level-item" @click="updateUser" :class="{ loading: updating }" type="submit">Save Account</button>
      </div>
      <!-- <div class="level-right">
        <a class="level-item has-text-danger" @click="openModal('delete')">Delete Account &amp; Data</a>
      </div> -->
    </div>

    <Modal :class="['deleteUser']" :show="modals.delete.show" @close="closeModal('delete')">
      <p class="field"><strong>Are you sure you want to delete your account?</strong> This cannot be undone. All media and data associated with your account will be removed.</p>

      <div class="field">
        <input type="text" :class="{ 'is-danger': modals.delete.error }" placeholder="Confirm your Steam Name" v-model="confirmName" class="input is-medium" />
      </div>

      <a @click="deleteUser()" class="button is-warning">Delete</a>
      <a @click="closeModal('delete')" class="button is-light">Cancel</a>
    </Modal>
  </div>
</template>

<script>
import API from '@/services/api'
import auth from '@/services/auth'
import Modal from '@/components/ui/Modal'

import Upload from '../ui/Upload'

export default {
  name: 'account',
  components: {
    Upload,
    Modal,
  },
  data () {
    return {
      msg: 'Your Account',
      loading: true,
      updating: false,
      uploadAvatar: false,
      modals: {
        delete: {
          show: false,
          loading: false,
          error: false,
        }
      },
      user: {
        name: {},
        avatar: {},
        settings: {}
      },
      errors: {
        email: false
      },
      confirmName: ''
    }
  },
  methods: {
    getUser (params = {}) {
      return API.fetch('user', params).then((data) => {
        this.user.name = data.name
        this.user.avatar = data.avatar
        this.user.email = data.email
        this.user.settings = data.settings
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
        this.$store.dispatch('refreshUser')
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

      console.log('Updating avatar', media)
      API.put('user', { avatar: media._id }).then(() => {
        this.updating = false
        this.uploadAvatar = false
        this.$notify('notifications', 'Avatar saved', 'success')
        this.$store.dispatch('refreshUser')
      }).catch((err) => {
        console.log(err)
        this.updating = false
        this.$notify('notifications', 'Error saving avatar', 'error')
      })
    },
    closeModal(modal) {
      this.modals[modal].show = false
      this.modals[modal].loading = false
    },
    openModal(modal) {
      this.modals[modal].show = true
      this.modals[modal].error = false
    },
    modalOpen(modal) {
      return this.modals[modal].show
    },
    deleteUser() {
      this.modals.delete.error = false
      if(this.confirmName != this.user.name.display) return this.modals.delete.error = true
      // API.delete('/users/'+this.user.id).then(response => {
      //   this.$notify('notifications', `Your account has been deleted.`, 'success')
      //   this.$router.push({ name: 'Home' })
      // }).catch(err => {
      //   this.$notify('notifications', 'There was a problem deleting your account.', 'error')
      // })
      this.closeModal('delete')
    },
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
