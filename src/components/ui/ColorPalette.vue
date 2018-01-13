<template>
  <div class="color-palette" v-if="(value && value.length > 0) || editMode">
    <div class="colors">
      <div class="color" v-tooltip="color" @click="copyColor(color, key)" :style="{ 'background': color }" v-for="(color, key) in value"><button class="delete" @click="deleteColor($event, key)" v-if="editMode"></button></div>
      <div class="color is-new" v-tooltip="'Add New Color'" @click="addColor()" v-if="editMode"><span class="icon"><i class="fas fa-plus"></i></span></div>
    </div>

    <div class="color-palette-picker" v-show="active !== false">
      <Chrome :value="picker" @input="changeHex" v-if="editMode" ref="colorPicker"></Chrome>
      <div class="text-center"><a class="button is-light is-small is-rounded" @click="active = false">Hide</a></div>
    </div>
  </div>
</template>

<script>
import '@/styles/components/_color-palette.scss'
import tinycolor from 'tinycolor2'
import { Chrome } from 'vue-color'

export default {
  components: {
    Chrome
  },
  props: {
    value: {
      type: Array
    },
    editMode: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      picker: { hex: '' },
      active: false
    }
  },
  methods: {
    copyColor(color, key) {
      if(!this.editMode) {
        this.$clipboard(color)
        this.$notify('notifications', 'Color Copied', 'success')
      } else {
        this.active = key
        this.setPicker(color)
      }
    },
    changeHex(data) {
      // this.value[this.active] = data.hex
      this.$set(this.value, this.active, data.hex)
      this.$emit('input', this.value)
    },
    addColor() {
      let newColor = '#000'
      this.value.push(newColor)
      this.active = this.value.length - 1
      this.setPicker(newColor)
    },
    deleteColor(e, key) {
      console.log('deleting ', key)
      e.stopPropagation()
      if(this.active == key) this.active = false
      this.value.splice(key, 1)
    },
    setPicker(color) {
      this.picker.hex = color
      this.$refs.colorPicker.inputChange(this.picker)
    }
  }
}
</script>
