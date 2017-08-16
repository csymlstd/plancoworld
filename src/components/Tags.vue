<template>
  <div class="pw--tags">
    <div class="pw--tag-wrapper" v-for="group in groups">
      <div class="ui attached top header">{{ group.label }}</div>
      <div class="ui attached segment">
        <div class="ui relaxed list">
          <div class="item" v-for="tag in group.tags">
            <div class="ui checkbox">
              <input type="checkbox" :name="tag.slug" :value="tag._id" v-model="selected" @change="selectTag">
              <label>{{ tag.name }}</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import API from '@/services/api'

//import 'semantic-ui-sass/js/checkbox.js'

export default {
  name: 'tags',
  props: {
    models: '',
    labels: {
      default: 'Tags'
    }
  },
  data () {
    return {
      selected: [],
      groups: []
    }
  },
  methods: {
    getTags () {
      return new Promise((resolve, reject) => {
        let tags = sessionStorage.getItem('tags')
        tags = JSON.parse(tags)
        if(tags.length > 0) {
          this.tags = tags;
        }
      })
      API.fetch(this, 'tags', {}).then((data) => { // { models: this.models }
        let models = this.models.split(',')
        let labels = this.labels.split(',')
        for(let m=0;m<models.length;m++) {
          this.groups.push({
            label: labels[m],
            model: models[m],
            tags: this.filterTags(models[m], data)
          })
        }

      })
    },
    selectTag() {
      console.log('selected', this.selected)
      this.$emit('selected', this.selected)
    },
    filterTags(model, data) {
      return data.filter((tag) => {
        return tag.model == model;
      })
    }
  },
  mounted () {
    this.getTags().then(() => {
      //$(this.$el).find('.checkbox').checkbox();
    }).catch((err) => {

    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .pw--tag {
    background: #fff;
  }
</style>
