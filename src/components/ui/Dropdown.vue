<template>
  <div class="dropdown" :class="{ 'is-active': active, 'is-right': alignRight }">
    <div class="dropdown-trigger" @click="toggle">
      <slot name="trigger">
        <button class="button">
          Dropdown
        </button>
      </slot>
    </div>
    <div class="dropdown-menu" @click="close()">
      <div class="dropdown-content">
        <slot name="menu">
          <div class="dropdown-item">Dropdown Item</div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    'alignRight': {
      default: false
    }
  },
  data () {
    return {
      active: false
    }
  },
  methods: {
    toggle(e) {
      e.preventDefault()
      if(this.active == true) {
         this.close()
      } else {
        this.open()
      }
    },
    close() {
      this.active = false
    },
    open() {
      this.active = true
    }
  },
  mounted () {

  }
}

</script>
