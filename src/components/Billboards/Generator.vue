<template>
  <div>
    <RideGenerator></RideGenerator>
    <StoreGenerator></StoreGenerator>
  </div>
</template>

<script>
import API from '@/services/api'
import 'billboard-generator/src/scss/_range.scss'
import RideGenerator from 'billboard-generator/src/js/views/ride-billboard/RideBillboard.vue'

export default {
  components: {
    RideGenerator,
  },
  metaInfo: {
    title: 'Billboard Generator by João Luís'
  },
  methods: {

  }
}
</script>


<style>

</style>
