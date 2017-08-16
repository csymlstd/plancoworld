<template>
  <div class="filters">
    <div class="field">
      <div class="control box" v-for="group in groups">
        <div class="field filter-list">
          <div class="level" style="min-height: 36px;" v-if="group.label">
            <div class="level-left">
              <div class="level-item"><h5 class="title is-5">{{ group.label }}</h5></div>
              <div class="level-item"><div class="tag is-rounded is-outlined" v-if="options[group.model].dlc">DLC</div></div>
            </div>
            <div class="level-right">
              <div class="level-item" v-if="options[group.model].min && calcSelected(group.model) < options[group.model].min"><span class="icon"><i class="fas fa-check has-text-primary"></i></span> You must select at least {{ options[group.model].min }}</div>
              <div class="level-item" v-if="options[group.model].type == 'list' && options[group.model].force !== true">
                <a class="button is-white" v-if="isVisible(group.model, options[group.model].visible)" @click="toggleVisibility(group.model)"><span class="icon has-text-grey-light"><i class="far fa-eye-slash"></i></span></a>
                <a class="button is-white" v-if="!isVisible(group.model, options[group.model].visible)" @click="toggleVisibility(group.model)"><span class="icon"><i class="far fa-eye has-text-grey-light"></i></span></a>
              </div>
            </div>
          </div>

          <div v-if="options[group.model].description && isVisible(group.model, options[group.model].visible)">
            <p class="description">{{ options[group.model].description }}</p>
          </div>
          <div v-else-if="isVisible(group.model, options[group.model].visible)">
            <p class="description" v-if="group.model == 'parks-plans'">Starting points from fresh land to bustling parks</p>
            <p class="description" v-if="group.model == 'billboards-context'">What the billboards represent, and where they would be placed</p>
            <p class="description" v-if="group.model == 'amenities'">Additions to your park that wow your guests and improves your park rating</p>
            <p class="description" v-if="group.model == 'themes'">Different themes of scenery and building materials in PlanCo</p>
            <p class="description" v-if="group.model == 'facilities'">Various facilities required to keep your park running in tip-top shape</p>
            <p class="description" v-if="group.model == 'shops'">Various drink, food, and gift shops that keep your guests happy and increase park rating</p>
            <p class="description" v-if="group.model == 'materials'">Types of building materials available in PlanCo</p>
            <p class="description" v-if="group.model == 'rides'">Types of transportation, water, and flat rides. Basically not a coaster</p>
            <p class="description" v-if="group.model == 'coasters'">Types of roller coasters available in-game</p>
            <p class="description" v-if="group.model == 'scenery'">Different types of decorations, displays, nature and objects</p>
            <p class="description" v-if="group.model == 'buildings'">Common building and structure types found through out theme parks.</p>
            <p class="description" v-if="group.model == 'style'">Creations influenced by real world styles, movements, and cultures. <a>Suggest a Style</a></p>
            <p class="description" v-if="group.model == 'regions'">Parks may have terrain spanning across 4 different biomes and regions</p>
            <p class="description" v-if="options[group.model].dlc">You won't be able to interact with these props in-game if you haven't purchased them. <a href="http://store.steampowered.com/dlc/493340/" target="_blank">Shop DLC</a></p>
          </div>

          <div class="field toggles" v-if="options[group.model].type == 'toggle'">
              <a class="toggle is-box" v-for="tag in group.tags" :class="{ 'is-selected': isSelected(tag._id, group.model) }" @click="checkTag(tag._id, group.model)">{{ tag.name }}</a>
          </div>

          <div class="dropdown is-hoverable" v-else-if="options[group.model].type == 'dropdown'">
            <div class="dropdown-trigger">
              <button class="button is-medium is-white" :class="{ 'is-primary is-inverted': calcSelected(group.model) }">
                <span class="text">{{ group.label }}</span>
              </button>
            </div>
            <div class="dropdown-menu">
              <div class="dropdown-content">
                  <label class="checkbox dropdown-item" :class="{ 'is-selected': isSelected(tag._id, group.model) }" v-for="tag in group.tags">
                    <!--  @click="checkTag(tag._id, group.model)" -->
                    <input type="checkbox" name="selected[]" :value="tag._id" v-model="selected[group.model]">
                    {{ tag.name }}
                  </label>
              </div>
            </div>
          </div>

          <div v-else>
            <div class="controls" v-if="isVisible(group.model, options[group.model].visible)">

              <label class="checkbox dropdown-item" @click="checkTag(tag._id, group.model)" :class="{ 'is-selected': isSelected(tag._id, group.model) }" v-for="tag in group.tags">
                <!-- @click="checkTag(tag._id, group.model)" -->
                <!-- <input type="checkbox":value="tag._id" :model="selected" /> -->
                {{ tag.name }}

                <span class="tag is-rounded is-outlined" v-if="['back-to-the-future','knight-rider','the-munsters'].indexOf(tag.slug) > -1">$2.99</span>

                <span class="tag is-rounded is-outlined" v-if="tag.slug == 'shop' && group.model == 'buildings'">Shop Category</span>
                <span class="tag is-rounded is-outlined" v-if="tag.slug == 'building' && group.model == 'buildings'">Building Category</span>
                <span class="tag is-rounded is-outlined" v-if="['display-sequence','entertainment-point'].indexOf(tag.slug) > -1">Special Object</span>
                <span class="tag is-rounded is-outlined" v-if="['festive'].indexOf(tag.slug) > -1">1.1</span>
                <span class="tag is-rounded is-outlined" v-if="['security-camera','racing'].indexOf(tag.slug) > -1">1.2</span>
                <span class="tag is-rounded is-outlined" v-if="['screen','projection-screen','stars-and-stripes'].indexOf(tag.slug) > -1">1.3</span>
              </label>
            </div>
          </div>

          <div class="selected-tags tags" v-if="!isVisible(group.model, options[group.model].visible)">
            <div class="tag is-rounded is-medium is-primary" v-for="tag in group.tags" v-if="isSelected(tag._id, group.model)">{{ tag.name }} <button class="delete is-small" @click="checkTag(tag._id, group.model)"></button></div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import API from '@/services/api'

export default {
  name: 'filters',
  props: {
    options: {
      type: Object,
      default: () => {
        return {

        }
      }
    }
  },
  data () {
    return {
      selected: [],
      checked: [],
      groups: [],
      tags: [],
      visibility: {},
      valid: false
    }
  },
  methods: {
    getTags () {

      let tags = sessionStorage.getItem('tags')
      if(tags) {
        tags = JSON.parse(tags)

        if(tags.length > 0) {
          console.log('returning cached tags')
          return new Promise((resolve, reject) => { resolve(tags) })
        }
      } else {
        console.log('returning new tags')
        return API.fetch('tags').then((data) => {
          this.tags = data
          let cache = JSON.stringify(data)
          sessionStorage.setItem('tags', cache)
          return data
        })
      }
    },
    calcSelected(model) {
      let group = this.groups.filter((g) => {
        return g.model == model
      })

      let selected = group[0].tags.filter((s) => {
        return this.selected.indexOf(s._id) > -1
      })

      return selected.length;
    },
    getSelected(model) {
      let group = this.groups.filter((g) => {
        return g.model == model
      })

      return group[0].tags.filter((s) => {
        return this.selected.indexOf(s._id) > -1
      })
    },
    checkTag(value, model) {
      let total = this.calcSelected(model)
      let isSelected = this.selected.indexOf(value);
      if(isSelected > -1) {
        this.selected.splice(isSelected, 1)
      } else {
        if(this.options[model].max == 1 && total == 1) {
          let selected = this.getSelected(model)[0]._id
          let index = this.selected.indexOf(selected)
          this.selected.splice(index, 1)
        } else if(this.options[model].max == total) {
           return false
        }

        this.selected.push(value);
      }

      this.$emit('selected', this.selected)
      // this.$emit('valid', this.valid)
    },
    isSelected(key, model) {
      return (this.selected.indexOf(key) > -1)
    },
    isChecked(key) {
      return (this.checked.indexOf(key) > -1)
    },
    filterTags(model, data) {
      return data.filter((tag) => {
        return tag.model == model;
      })
    },
    isVisible(model, d = false) {
      if(this.visibility[model] == undefined) this.visibility[model] = this.$set(this.visibility, model, d)
      let v = this.visibility[model]
      return v
    },
    toggleVisibility(model) {
      if(this.visibility[model]) {
        this.$set(this.visibility, model, false)
      } else {
        this.$set(this.visibility, model, true)
      }
    }
  },
  mounted () {
    this.getTags().then((tags) => {
      this.groups = []

      for(let model in this.options) {
        this.groups.push({
          label: this.options[model].label || null,
          model: model,
          tags: this.filterTags(model, tags),
        })
        // this.selected[model] = []
      }

      return
    }).then(() => {
      // $(this.$el).find('.pw--filters .ui.dropdown').dropdown({
      //   action: 'nothing',
      // });
      //
      // $(this.$el).find('.pw--sort .ui.dropdown').dropdown();
    }).catch((err) => {

    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .selected-tags {
    margin-top: 0.5rem;
  }
</style>
