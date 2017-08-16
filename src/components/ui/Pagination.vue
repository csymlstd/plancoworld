<template>
<nav class="pagination is-centered is-medium">
  <a class="pagination-previous" :disabled="current <= 1" @click="goTo(current-1)">Previous</a>
  <a class="pagination-next" :disabled="current >= pages" @click="goTo(current+1)">Next page</a>
  <ul class="pagination-list">
    <li v-if="current > 3"><a class="pagination-link" @click="goTo(1)">1</a></li>
    <li v-if="current > 3"><span class="pagination-ellipsis">&hellip;</span></li>
    <li><a class="pagination-link" :class="{ 'is-current': p == current }" @click="goTo(p)" v-for="(p, i) in pages" v-if="Math.abs(p - current) < 3 || p == pages - 1 || p == 0">{{ p }}</a></li>
    <li v-if="current < (pages - 2)"><span class="pagination-ellipsis">&hellip;</span></li>
    <li v-if="current < (pages - 2)"><a class="pagination-link" @click="goTo(1)"> {{ pages }} </a></li>
  </ul>
</nav>
</template>

<script>

export default {
  name: 'pagination',
  props: {
    total: { type: Number, default: 0 },
    current: { type: Number, default: 1 },
    pages: { type: Number, default: 1 },
    limit: { type: Number, default: 25 }
  },
  data () {
    return {

    }
  },
  methods: {
    goTo(p) {
      if(p > 0 && p <= this.pages) {
        this.$emit('goTo', p)
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
