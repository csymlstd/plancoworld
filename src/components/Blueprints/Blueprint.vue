<template>
  <article class="billboard">
    <section class="hero hero--tall is-dark">

    </section>
    <main class="content ui container blueprint--content">
      <div class="level">
        <div class="level-left"><h2 class="title is-2">{{ blueprint.name }}</h2></div>
        <div class="level-right">
          <div class="field is-grouped">
            <div class="control"><button class="button is-dark">Subscribe on Steam</button></div>

            <div class="control"><button class="button">Add to Toolbox</button></div>
          </div>
        </div>
      </div>

      <div class="pw--tags">
        <div class="ui label" :class="{ ['pw--tag-'+tag.model]: true }" v-for="tag in blueprint.tags">{{ tag.name }}</div>
      </div>

      <div class="ui divider"></div>

      <p class="blueprint--description">{{ blueprint.description }}</p>

      <h3 class="ui header">Billboards <a class="is-text">Download All ({{blueprint.billboards.length}})</a></h3>
      <Billboard :model="billboard" :key="billboard._id" v-for="billboard in blueprint.billboards"></Billboard>

      <h3 class="ui header">Audio</h3>
      {{ blueprint.audio }}

    </main>
  </article>
</template>

<script>
import Tags from '@/components/Tags'
import Blueprint from '@/components/cards/Blueprint'
import Billboard from '@/components/Billboards/Card'
import API from '@/services/api'

import Dropdown from '@/components/ui/Dropdown'

export default {
  name: 'blueprint',
  components: {
    Tags,
    Blueprint,
    Billboard,
    Dropdown
  },
  data () {
    return {
      msg: 'These are the blueprints!',
      blueprint: {}
    }
  },
  mounted () {
    let ID = this.$route.params.id
    let SLUG = this.$route.params.slug

    if(ID) {
      API.fetch(`blueprints/${ID}`).then((blueprint) => {
        this.blueprint = blueprint
      }).catch((err) => {

      })
    }

    if(!ID && SLUG) {
      API.fetch('blueprints', { slug: SLUG }).then((blueprints) => {
        this.blueprint = blueprints[0]
      }).catch((err) => {

      })
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
