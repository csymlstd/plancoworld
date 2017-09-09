<template>
  <article class="billboard">
    <section class="hero hero--tall">

    </section>
    <section class="hero">
      <div class="container">
        <div class="level is-mobile">
          <div class="level-left">
            <h1 class="title level-item"><router-link :to="{ name: 'Billboards' }">Billboard</router-link></h1>
            <h2 class="title level-item"> / {{ billboard.name }}</h2>
          </div>
          <div class="level-right">
            <button class="button level-item is-medium is-dark"><span class="icon"><i class="fas fa-link"></i></span></button>
            <button class="button is-primary is-medium level-item" :class="{ 'is-loading': downloading }" @click="downloadBillboard()" :disabled="!billboard.media">Download Billboard</button>
            <div class="field has-addons level-item">
              <div class="control"><button class="button is-medium">Download Source</button></div>
              <div class="control">
                <Dropdown :alignRight="true">
                  <button slot="trigger" class="button is-medium">.sketch</button>
                  <div slot="menu">
                    <a class="dropdown-item">
                      <span>Sketch</span>
                    </a>
                  </div>
                </Dropdown>
              </div>
            </div>
            <SaveToToolbox model="billboards" :data="billboard"></SaveToToolbox>
          </div>
        </div>
      </div>
    </section>
    <main class="content ui container billboard--content">

      <div class="pw--tags">
        <div class="ui label" :class="{ ['pw--tag-'+tag.model]: true }" v-for="tag in billboard.tags">{{ tag.name }}</div>
      </div>

      <div class="ui divider"></div>

      <p class="billboard--description">{{ billboard.description }}</p>

    </main>
  </article>
</template>

<script>
import SaveToToolbox from '@/components/ui/SaveToToolbox'
import Filters from '@/components/ui/Filters'
import Blueprint from '@/components/cards/Blueprint'
import Billboard from '@/components/Billboards/Card'
import API from '@/services/api'

import Dropdown from '@/components/ui/Dropdown'

export default {
  name: 'billboards',
  components: {
    Blueprint,
    Billboard,
    Dropdown,
    SaveToToolbox
  },
  data () {
    return {
      msg: 'These are the billboards!',
      billboard: {},
      downloading: false
    }
  },
  methods: {
    downloadBillboard () {
      this.downloading = true
      let mediaID = billboard.media[0]._id
      API.fetch(`media/${mediaID}/download`).then((billboard) => {
        let url = billboard.signedRequest
        console.log(url)
        window.open(url)
        this.downloading = false
      })
    }
  },
  mounted () {
    let ID = this.$route.params.id
    let SLUG = this.$route.params.slug

    if(ID) {
      API.fetch(`billboards/${ID}`).then((billboard) => {
        this.billboard = billboard
      }).catch((err) => {

      })
    }

    if(!ID && SLUG) {
      API.fetch('billboards', { slug: SLUG }).then((billboards) => {
        this.billboard = billboards[0]
      }).catch((err) => {

      })
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
