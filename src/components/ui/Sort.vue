<template>
  <div class="field is-grouped">
    <div class="control">
      <div class="dropdown is-hoverable">
        <div class="dropdown-trigger">
          <div class="field has-addons">
            <div class="control"><button class="button is-medium">Sort By</button></div>
            <div class="control"><button class="button is-static is-medium">{{ selectedLabels.sort }}</button></div>
          </div>
        </div>
        <div class="dropdown-menu">
          <div class="dropdown-content">
            <a class="dropdown-item" :class="{ 'is-active': (sort == 'popular') }" @click="updateSort('popular', 'Popular')">Popular</a>
            <a class="dropdown-item" :class="{ 'is-active': (sort == 'added' && order == 'desc') }" @click="updateSort('added', 'Newest'); updateOrder('desc')">Newest</a>
            <a class="dropdown-item" :class="{ 'is-active': (sort == 'added' && order == 'asc') }" @click="updateSort('added', 'Oldest'); updateOrder('asc')">Oldest</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'sort',
  props: {
    options: {
      type: Object,
      default: () => {
        return {

        }
      }
    }
  },
  data () {
    return {
      sort: 'popular',
      order: 'desc',
      selected: [],
      selectedLabels: {
        sort: 'Popular',
        order: 'Desc'
      },
      visibility: {}
    }
  },
  methods: {
    select(value) {
      let isSelected = this.selected.indexOf(value);
      if(isSelected > -1) {
        this.selected.splice(isSelected, 1)
      } else {
        this.selected.push(value);
      }

      this.$emit('selected', this.selected)
    },
    isSelected(key) {
      return (this.selected.indexOf(key) > -1)
    },
    updateSort(sort, label) {
      this.$emit('sort', sort)
      this.sort = sort
      this.selectedLabels.sort = label
    },
    updateOrder(order) {
      this.$emit('order', order)
      this.order = order
    },
    isVisible(model, d = false) {
      if(this.visibility[model] == undefined) this.visibility[model] = this.$set(this.visibility, model, d)
      let v = this.visibility[model]
      return v
    },
    toggleVisibility(model) {
      if(this.visibility[model]) {
        this.$set(this.visibility, model, false)
      } else {
        this.$set(this.visibility, model, true)
      }
    }
  },
  mounted () {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

</style>
