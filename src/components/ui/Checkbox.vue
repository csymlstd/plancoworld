<template>
  <div class="ui checkbox">
    <input type="checkbox" @change="onChange" :name="name" :value="value">
    <label>{{ label }}</label>
  </div>
</template>

<script>
import API from '../services/api'

export default {
  name: 'checkbox',
  props: ['value', 'label','name','disabled'],
  methods: {
    onChange () {
      this.$emit('input', event.target.value)
    }
  },
  mounted () {
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

</style>
