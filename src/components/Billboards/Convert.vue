<template>
  <div>
  <section class="hero">
    <div class="container">
      <div class="level">
        <div class="level-left">
          <h1 class="title level-item"><router-link :to="{ name: 'Billboards' }">Billboards</router-link></h1>
          <h1 class="title level-item"> / Convert to WebM</h1>
        </div>
        <div class="level-right">
          <a class="level-item">Generator</a>
          <router-link :to="{ name: 'Convert' }" class="level-item">Convert to WebM</router-link>
          <a class="level-item">Glossary</a>
          <router-link :to="{ name: 'ImportBillboard' }" class="button is-primary is-medium">Add a Billboard</router-link>
        </div>
      </div>
    </div>
  </section>
  <main class="container billboards">
    <Upload @uploaded="addMedia" folder="billboards" :transcode="true" :isDark="true" :enableToolbox="false" instructions="Drop an mp4 here to convert to a webm, or click to browse"></Upload>
  </main>
  </div>
</template>

<script>
import API from '@/services/api'
import Upload from '@/components/ui/Upload'

export default {
  components: {
    Upload
  },
  methods: {
    addMedia() {

    }
  }
}
</script>


<style>

</style>
