<template>
  <div class="column is-one-third-desktop is-half-tablet">
    <div class="card has-level-bottom">
      <div class="card-image" :style="{ 'background': getBackground(model.media[0]) }" @click="viewPark">
        <div class="level bottom">
          <div class="level-left">
            <a @click.stop="$emit('remove', { id: model._id, model: 'parks' })" v-if="editMode" class="level-item"><span class="tag is-rounded is-warning is-medium"><i class="fas fa-times"></i>&nbsp; Remove</span></a>
            <div class="level-item"><Filters :options="tagOptions" :selected="model.tags" :inline="true" :readOnly="true" ref="tags"></Filters></div>
          </div>
          <div class="level-right">
            <a :href="'http://steamcommunity.com/sharedfiles/filedetails/?id='+model.steam_id" @click.stop target="_blank" class="level-item subscribe"><span class="tag is-rounded is-primary is-medium" v-tooltip="'Subscribe on Steam'"><span class="icon"><i class="fab fa-steam"></i></span></span></a>
            <div class="level-item" v-if="isSaved()"><span class="tag is-rounded is-warning is-medium" v-tooltip="'Saved to Toolbox'"><span class="icon"><i class="fas fa-archive"></i></span></span></div>
          </div>
        </div>
      </div>
      <div class="card-content">
        <div class="content">
          <h3 class="title"><a :href="'/parks/'+model.slug" @click="viewPark">{{ model.name | truncate(70) }}</a></h3>
          <div class="level bottom">
            <div class="level-left">
              <Creator :user="model.user" class="level-item"></Creator>
            </div>
            <div class="level-right">
              <Reaction :model="model"></Reaction>
              <!-- <div class="vote level-item"><span class="icon"><i class="fas fa-heart"></i></span><span class="count">{{ model.votes.upTotal || 0 }}</span></div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from '@/router'

import Filters from '@/components/ui/Filters'
import Reaction from '@/components/ui/Reaction'
import Creator from '@/components/ui/ProfileMicro'
import Media from '@/services/media'
import Auth from '@/services/auth'

export default {
  name: 'park-card',
  components: {
    Filters,
    Creator,
    Reaction
  },
  props: {
    model: {},
    editMode: false,
  },
  data () {
    return {
      selected: [],
      groups: [],
      addReaction: false,
      tagOptions: {
        'parks': {
          label: false,
          type: 'tags'
        }
      },
    }
  },
  methods: {
    viewPark (e) {
      e.preventDefault()
      router.push({ name: 'Park', params: { slug: this.model.slug }})
    },
    isSaved() {
      return (this.model.toolbox.indexOf(this.$store.state.user.profile._id) > -1)
    },
    getBackground(item = {}) {
        if(item.type != 'image') return ''
        let url = item.alternates.indexOf('600w') > -1 ? Media.getAlternateUrl('600w', item.url) : item.url
        return `url('${url}')`
    },
  },
  mounted () {
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
