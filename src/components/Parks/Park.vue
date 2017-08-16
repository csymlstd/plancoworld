<template>
  <div>
  <!-- <div class="park-status is-under-construction">
    <div class="level">
      <div class="level-left">
        Under Construction
      </div>
      <div class="level-right">
        <span class="level-item">Link your Park to the Steam Workshop to make it public on Planco World.</span>
        <a class="button is-link">Link to Workshop</a>
      </div>
    </div>
  </div> -->
  <section class="hero hero--tall" :style="{ backgroundImage: `url('${park.media ? park.media[0].url : '' }')` }">

  </section>
  <section class="hero">
    <div class="container">
      <div class="level">
        <div class="level-left">
          <h1 class="title level-item"><router-link :to="{ name: 'Parks' }">Parks</router-link></h1>
          <h2 class="title level-item"> / {{ park.name }}</h2>
        </div>
        <div class="level-right">
          <button class="button level-item is-medium is-primary"><span class="icon"><i class="fab fa-steam"></i></span> <span>Subscribe on Steam</span></button>
          <button class="button level-item is-medium is-warning" v-if="!isOwner()"><span>Add to </span> <span class="icon"><i class="fas fa-archive"></i></span></button>
        </div>
      </div>
    </div>
  </section>
  <main class="content ui container pw--park">

    <section class="box is-primary">
      <span class="icon"><i class="fas fa-exclamation-triangle"></i></span>
      This Park will not be visible to the community until you link it to a Steam Workshop item.
    </section>

    <div class="columns">
      <div class="column is-two-thirds">
        <section class="box" v-html="park.description"></section>

        <div class="columns">
          <div class="column">
            <div class="level">
              <div class="level-left">
                <h3 class="title level-item">Shops</h3>
                <button class="button level-item" v-if="isOwner()"><span class="icon"><i class="fas fa-plus"></i></span></button>
              </div>
            </div>

            <div class="card" v-for="shop in park.shops">
              <div class="card-content">
                <h5 class="title is-4">{{ shop.name }}</h5>
                <h6 class="subtitle is-5 has-text-grey">{{ shop.type }}</h6>
              </div>
            </div>

            <div class="card is-empty" v-if="isOwner() && park.shops.length == 0">
              <div class="card-content">
                <h5 class="title is-4">Add a Shop</h5>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="level">
              <div class="level-left">
                <h3 class="title level-item">Attractions</h3>
                <button class="button level-item" v-if="isOwner()"><span class="icon"><i class="fas fa-plus"></i></span></button>
              </div>
            </div>

            <div class="card" v-for="attraction in park.attractions">
              <div class="card-content">
                <h5 class="title is-4">{{ attraction.name }}</h5>
                <h6 class="subtitle is-5 has-text-grey">{{ attraction.type }}</h6>
              </div>
            </div>

            <div class="card is-empty" v-if="isOwner() && park.attractions.length == 0">
              <div class="card-content">
                <h5 class="title is-4">Add an Attraction</h5>
              </div>
            </div>
          </div>
        </div>

        <h3 class="ui header">Billboards <a class="is-text">Download All ({{park.billboards.length}})</a></h3>
        <Billboard :model="billboard" :key="billboard._id" v-for="billboard in park.billboards"></Billboard>

        <h3 class="ui header">Blueprints</h3>
        <Blueprint :model="blueprint" :key="blueprint._id" v-for="blueprint in park.blueprints"></Blueprint>


        <h3 class="ui header">Audio</h3>
        {{ park.audio }}
      </div>
      <div class="column is-one-third">
        <div class="tags">
          <div class="tag is-box" v-for="tag in park.tags">
            <div class="icon"></div>
            <span>{{ tag.name }}</span>
          </div>
        </div>
      </div>
    </div>

  </main>
  </div>
</template>

<script>
import Tags from '@/components/Tags'
import Blueprint from '@/components/cards/Blueprint'
import Billboard from '@/components/Billboards/Card'
import API from '@/services/api'
import auth from '@/services/auth'

export default {
  name: 'parks',
  components: {
    Tags,
    Blueprint,
    Billboard,
    auth
  },
  data () {
    return {
      msg: 'These are the parks!',
      park: {
        media: []
      }
    }
  },
  methods: {
    isOwner() {
      return auth.isOwner(this.park)
    }
  },
  mounted () {
    let ID = this.$route.params.id
    let SLUG = this.$route.params.slug
    let url

    if(ID) {
      url = `parks/${ID}`
    } else if(SLUG) {
      url = `parks/slug/${SLUG}`
    }

    API.fetch(url).then((park) => {
      this.park = park
    }).catch((err) => {

    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

</style>
