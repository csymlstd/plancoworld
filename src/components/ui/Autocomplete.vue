<template>
  <div class="search">
    <div class="control has-icons-left is-medium is-expanded" :class="{ 'is-loading': loading || failed, 'is-failed': failed }">
      <input type="text" class="input is-medium search-input" v-model="queryTerms" @keydown.enter="enter" @keydown.esc="cancel" @keydown.down="down" @keydown.up="up" @input="change" :placeholder="placeholder" />
      <span class="icon is-small is-left"><i class="fas fa-search"></i></span>
    </div>
    <div class="dropdown search-dropdown" :class="{ 'is-active': open }">
      <div class="dropdown-menu">
        <div class="dropdown-content">
          <a class="dropdown-item" :class="{ 'is-active': isActive(index) }" :key="match._id" @click="select(index)" v-for="(match, index) in matches">
            <span class="name">{{ match.name }}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import API from '@/services/api'
export default {
  name: 'sort',
  props: {
    path: {
      type: String,
      default: 'kits'
    },
    placeholder: {
      type: String,
      default: 'Search for your kits'
    },
    owned: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data () {
    return {
      queryTerms: '',
      open: false,
      highlighted: 0,
      selected: false,
      matches: [],
      loading: false,
      failed: false,
    }
  },
  methods: {
    query(terms) {
      console.log('querying '+terms)
      this.loading = true
      this.failed = false
      let params = Object.assign({}, { q: terms, owned: this.owned }, this.params)
      return API.fetch(this.path, params).then((data) => {
        console.log(data)
        this.matches = data[this.path]
        this.loading = false
        return data
      }).catch((err) => {
        this.loading = false
        this.open = false
        this.failed = true
      })
    },
    select(index) {
      this.selected = this.matches[index]
      this.open = false
      console.log('selected', this.matches[index])
      this.$emit('selected', this.selected)
      this.queryTerms = ''
    },
    enter(e) {
      this.select(this.highlighted)
    },
    up(e) {
      e.preventDefault()
      if(this.open == false && this.matches.length > 0) this.open = true;
      if(this.highlighted > 0) this.highlighted--
    },
    down(e) {
      e.preventDefault()
      if(this.open == false && this.matches.length > 0) this.open = true;
      if(this.highlighted < this.matches.length - 1) this.highlighted++
    },
    cancel(e) {
      this.open = false
      this.highlighted = 0
      this.selected = false
      this.input.blur()
    },
    clear(e) {
      this.open = false
      this.highlighted = 0
    },
    isActive(index) {
      return index === this.highlighted
    },
    change(e) {
      if(this.open == false) {
        this.open = true
        this.highlighted = 0
      }
      if(this.queryTerms.length < 4) {
        this.clear()
      }
      if(this.queryTerms.length > 3) {
        this.query(this.queryTerms)
      }
    },
    getType(type) {
      switch(type) {
        case 'park':
          return 'Park'
          break;
        case 'blueprint':
          return 'Blueprint'
          break;
        case 'billboard':
          return 'Billboard'
          break;
        case 'audio':
          return 'Audio'
          break;
      }
    }
  },
  mounted () {
    this.input = this.$el.querySelector('.search-input')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.search {
  position: relative;
}
.dropdown.search-dropdown {
  position: absolute;
  width: 100%;

  .dropdown-menu {
    width: 100%;

    .dropdown-item {
      display: flex;
      padding: 0.375rem 1rem!important;

      span.name {
        flex-grow: 1;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        margin: 0 auto 0 0;
      }

      span.tag {
        margin-left: 1rem;
      }
    }
  }
}
</style>
