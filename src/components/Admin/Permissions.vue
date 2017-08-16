<template>
  <div class="box">
    <table class="table is-bordered">
      <tr>
        <th>Permissions</th>
        <th v-for="role in roles">{{ role.name }}</th>
      </tr>
      <tr v-for="permission in permissions">
        <td>{{ permission.description }}</td>
        <td v-for="role in roles" class="has-text-centered">
          <input type="checkbox" :value="permission._id" @click="select(permission._id, role._id)" :checked="isSelected(permission._id, role._id)" />
        </td>
      </tr>
    </table>

    <button class="button is-primary is-medium" @click="" :class="{ loading: updating }" type="submit">Save</button>
  </div>
</template>

<script>
import API from '@/services/api'
import auth from '@/services/auth'

export default {
  components: {

  },
  data () {
    return {
      loading: true,
      updating: false,
      roles: [],
      permissions: [],
      selected: {}
    }
  },
  methods: {
    getRolesAndPerms(params = {}) {
      return Promise.all([API.fetch('auth/roles'), API.fetch('auth/permissions')])
      .then((data) => {
        this.roles = data[0]
        this.permissions = data[1]
      }).then(() => {
        for(let r=0;r<this.roles.length;r++) {
          this.$set(this.selected, this.roles[r]._id, this.roles[r].permissions)
        }
      })
    },
    select(permission, role) {
      if(!this.isSelected(permission, role)) {
        console.log('selecting')
        this.selected[role].push(permission)
      } else {
        console.log('removing')
        let index = this.selected[role].indexOf(permission)
        this.selected[role].splice(index, 1)
      }
    },
    isSelected(permission, role) {
      return this.selected[role] ? this.selected[role].indexOf(permission) > -1 : false
    },
    updateUser(event) {
      event.preventDefault()
      this.updating = true

      // API.put('user', data).then((updatedUser) => {
      //   console.log(updatedUser)
      //   this.updating = false
      //   this.$notify('notifications', 'Profile saved', 'success')
      // }).catch((err) => {
      //   console.log(err)
      //   this.updating = false
      //   this.$notify('notifications', 'Error saving profile', 'error')
      // })
    }
  },
  mounted() {
    this.getRolesAndPerms().then(() => {
      this.loading = false
    }).catch((err) => {

    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
