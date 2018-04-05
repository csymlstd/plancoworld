<template>
  <div class="column is-one-third-desktop is-half-tablet">
    <div class="card has-level-bottom">
      <a class="card-image" :style="{ 'backgroundImage': `url('${thumbnail}')` }" @click="viewKit">
        <div class="level bottom">
          <div class="level-left">
            <a @click.stop="$emit('remove', { id: model._id, model: 'kits' })" v-if="editMode" class="level-item"><span class="tag is-rounded is-warning is-medium"><i class="fas fa-times"></i>&nbsp; Remove</span></a>
            <div class="level-item"><Filters :options="tagOptions" :selected="model.tags" :inline="true" :readOnly="true" ref="tags"></Filters></div>
          </div>
          <div class="level-right">
            <div class="level-item" v-if="isSaved()"><span class="tag is-rounded is-warning is-medium" v-tooltip="'Saved to Toolbox'"><span class="icon"><i class="fas fa-archive"></i></span></span></div>
          </div>
        </div>
      </a>
      <div class="card-content">
        <div class="content">
          <h3 class="title"><a @click="viewKit">{{ model.name | truncate(70) }}</a></h3>
          <div class="level bottom">
            <div class="level-left">
              <Creator :user="model.user" class="level-item"></Creator>
            </div>
            <div class="level-right">
              <Reaction :model="model" :type="'kits'"></Reaction>
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
  name: 'kit-card',
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
      thumbnail: '',
      tagOptions: {
        'parks': {
          label: false,
          type: 'tags'
        }
      },
    }
  },
  methods: {
    viewKit (e) {
      e.preventDefault()
      router.push({ name: 'Kit', params: { slug: this.model.slug }})
    },
    isSaved() {
      return (this.model.toolbox.indexOf(Auth.user.profile._id) > -1)
    }
  },
  mounted () {
    if((this.model.media.length > 0) && this.model.media[0].alternates.indexOf('350w') > -1) {
      let url = Media.getAlternateUrl('350w', this.model.media[0].url)
      this.$set(this, 'thumbnail', url)
    } else if(this.model.media.length > 0) {
      this.$set(this, 'thumbnail', this.model.media[0].url)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
