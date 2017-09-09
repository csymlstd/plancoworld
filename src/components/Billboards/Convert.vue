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
          <router-link :to="{ name: 'Generator' }" class="level-item">Generator</router-link>
          <router-link :to="{ name: 'Convert' }" class="level-item">Convert to WebM</router-link>
          <a class="level-item">Glossary</a>
          <router-link :to="{ name: 'ImportBillboard' }" class="button is-primary is-medium">Add a Billboard</router-link>
        </div>
      </div>
    </div>
  </section>
  <main class="container billboards">
    <div class="columns">
      <div class="column">
        <Upload @uploaded="addMedia" folder="billboards" :transcode="true" :isDark="true" :enableToolbox="false" instructions="Drop an mp4 here to convert to a webm, or click to browse"></Upload>
      </div>
      <div class="column is-one-third">
        <div class="box">
          <h5 class="is-5 title">Why WebM</h5>
          <p class="field">Planet Coaster uses the <a href="#">WebM</a> video format for its Movie Billboards. It's an open video format that allows high-quality at small file sizes.</p>
        </div>
        <div class="box">
          <h5 class="is-5 title">Usage</h5>
          <p class="field">Our converter will allow you to transcode up to <span class="tag is-medium is-outlined">10 Minutes</span> per month for <span class="tag is-medium is-outlined">free</span>.</p>
          <p class="field">Drop or browse and select an <span class="tag is-medium is-outlined">MP4</span> Video. Other formats will be available soon.</p>
          <p>Once the transcode is complete, your media will be saved to your <i class="fas fa-archive"></i> Toolbox, ready to create a new Billboard.</p>
        </div>
      </div>
    </div>

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
  metaInfo: {
    title: 'Convert to WebM'
  },
  methods: {
    addMedia() {

    }
  }
}
</script>


<style>

</style>
