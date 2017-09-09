<template>
  <div>
    <RideGenerator></RideGenerator>
  </div>
</template>

<script>
import API from '@/services/api'
// import 'billboard-generator/src/scss/_range.scss'
// import 'billboard-generator/src/scss/billboards/_ride.scss'
import RideGenerator from 'billboard-generator/src/js/views/ride-billboard/RideBillboard.vue'

export default {
  components: {
    RideGenerator
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
