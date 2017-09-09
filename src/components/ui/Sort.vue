<template>
  <div class="tabs is-toggle level-item">
    <ul>
      <li :class="{ 'is-active': (sort == 'hot' && order == 'desc') }"><a @click="updateSort('hot'); updateOrder('desc')">Hot</a></li>
      <li :class="{ 'is-active': (sort == 'popular') }"><a @click="updateSort('popular', 'Popular')">Popular</a></li>
      <li :class="{ 'is-active': (sort == 'added' && order == 'desc') }"><a @click="updateSort('added'); updateOrder('desc')">Newest</a></li>
      <li :class="{ 'is-active': (sort == 'added' && order == 'asc') }"><a @click="updateSort('added'); updateOrder('asc')">Oldest</a></li>
    </ul>
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
      sort: 'hot',
      order: 'desc',
      selected: [],
      selectedLabels: {
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
