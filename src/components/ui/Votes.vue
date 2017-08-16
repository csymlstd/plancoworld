<template>
  <div class="pw--votes">
    <a class="upvote">
      <i class="chevron up icon" />
    </a>
    <div class="count">{{ model.votes.upTotal }}</div>
    <a class="downvote">
      <i class="chevron down icon" />
    </a>
  </div>
</template>

<script>
import API from '@/services/api'

export default {
  name: 'Votes',
  props: ['model'],
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
<style>

</style>
