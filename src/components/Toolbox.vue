<template>
  <div class="toolbox--wrapper">
    <div class="toolbox--button">
      <div class="button is-medium is-warning" @click="toggle()"><span class="icon"><i class="fas fa-archive"></i> </span><span>Toolbox</span></div>
    </div>
    <div class="toolbox--menu" v-show="active">
      <main class="toolbox--content">
        Content
      </main>
      <nav class="toolbox--nav">
        <a href="#"><span class="icon"><i class="fas fa-film"></i></span> <span>Videos</span></a>
        <a href="#"><span class="icon"><i class="fas fa-image"></i></span> <span>Images</span></a>
        <a href="#"><span class="icon"><i class="fas fa-cube"></i></span> <span>Parks</span></a>
        <a href="#"><span class="icon"><i class="fas fa-cube"></i></span> <span>Blueprints</span></a>
        <a href="#"><span class="icon"><i class="fas fa-cube"></i></span> <span>Billboards</span></a>
      </nav>
    </div>
  </div>
</template>

<script>
import API from '@/services/api'
import { ToolBus } from './Toolbus.js'

export default {
  name: 'toolbox',
  props: {

  },
  data () {
    return {
      active: false
    }
  },
  methods: {
    getToolbox () {
      return new Promise((resolve, reject) => {
        resolve()
      })
    },
    toggle() {
      if(this.active) {
         return this.active = false
      } else {
        return this.active = true
      }
    }
  },
  mounted () {

    ToolBus.$on('toggle', (tab) => {
      this.toggle()
    })

    this.getToolbox().then(() => {

    }).catch((err) => {

    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

</style>
