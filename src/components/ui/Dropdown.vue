<template>
  <div class="dropdown" :class="{ 'is-active': active, 'is-right': alignRight }">
    <div class="dropdown-trigger" @click="toggle">
      <slot name="trigger">
        <button class="button">
          {{ label }}
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
    },
    label: {
      type: String,
      default: 'Dropdown'
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
    document.addEventListener('keydown', (e) => {
      if(this.active && e.keyCode == 27) {
        this.close();
      }
    })

    document.addEventListener('click', (e) => {
      if(this.active) {
        this.close();
      }
    })
  }
}

</script>
