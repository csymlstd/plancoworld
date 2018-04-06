<template>
  <button class="button level-item is-medium is-warning" @click="toggle()">
    <span>{{ savedToToolbox ? 'Saved' : 'Save to' }} </span> <span class="icon"><i class="fas" :class="{ 'fa-archive': !savedToToolbox, 'fa-check': savedToToolbox }"></i></span>
  </button>
</template>

<script>
import API from '@/services/api'
import Auth from '@/services/auth'

export default {
  props: {
    model: {
      type: String
    },
    data: {
      type: Object,
      default: () => {
        return { toolbox: [] }
      }
    }
  },
  data () {
    return {
      savedToToolbox: false,
      failed: false
    }
  },
  watch: {
    data () {
      this.check()
    }
  },
  methods: {
    toggle () {
      if(!this.$store.state.user.authenticated) {
        this.$store.commit('toggleModal', { modal: 'login', state: true })

        return false
      }
      API.post(`${this.model}/${this.data._id}/toolbox`).then((is) => {
        this.savedToToolbox = is.savedToToolbox
        this.$emit('savedToToolbox', this.savedToToolbox)
      }).catch(() => {
        this.failed = true
        this.$emit('savedToToolbox', this.savedToToolbox)
      })
    },
    check() {
      if(this.data.toolbox && this.data.toolbox.indexOf(Auth.user.profile._id) > -1) {
        this.savedToToolbox = true
      }
    }
  },
  mounted () {
    this.check()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
