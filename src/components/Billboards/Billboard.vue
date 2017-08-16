<template>
  <article class="billboard">
    <section class="hero hero--tall">

    </section>
    <main class="content ui container billboard--content">
      <div class="level">
        <div class="level-left"><h2 class="title is-2">{{ billboard.name }}</h2></div>
        <div class="level-right">
          <div class="field is-grouped">
            <div class="control"><button class="button is-primary">Download for Game</button></div>

            <div class="control"><div class="field has-addons">
              <div class="control"><button class="button">Download Source</button></div>
              <div class="control">
                <Dropdown :alignRight="true">
                  <button slot="trigger" class="button">.sketch</button>
                  <div slot="menu">
                    <a class="dropdown-item">
                      <span>Sketch</span>
                    </a>
                  </div>
                </Dropdown>
              </div>
            </div></div>

            <div class="control"><button class="button">Add to Toolbox</button></div>
          </div>
        </div>
      </div>



      <div class="pw--tags">
        <div class="ui label" :class="{ ['pw--tag-'+tag.model]: true }" v-for="tag in billboard.tags">{{ tag.name }}</div>
      </div>

      <div class="ui divider"></div>

      <p class="billboard--description">{{ billboard.description }}</p>

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
  name: 'billboards',
  components: {
    Tags,
    Blueprint,
    Billboard,
    Dropdown
  },
  data () {
    return {
      msg: 'These are the billboards!',
      billboard: {}
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
