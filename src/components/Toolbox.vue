<template>
  <div class="toolbox--wrapper">
    <div class="toolbox--button">
      <div class="button is-medium is-warning" @click="toggle()"><span class="icon"><i class="fas fa-archive"></i> </span><span>Toolbox</span></div>
    </div>
    <div class="toolbox--menu" v-show="open">
      <main class="toolbox--content loader--parent">
        <Loader v-if="loading"></Loader>
        <div class="level">
          <div class="level-left">
            <div class="tabs is-toggle level-item">
              <ul>
                <li :class="{ 'is-active': context == 'user' }" @click="tab(active, 'user')"><a>Your {{ panes[active].title }}</a></li>
                <li :class="{ 'is-active': context == 'saved' }" @click="tab(active, 'saved')"><a>Saved {{ panes[active].title }}</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div class="toolbox--list">
          <div class="notification is-primary" v-if="selectMode">Select an image to use here!</div>

          <div class="toolbox--list-parks" v-if="active == 'parks'">
            <Park :model="park" :key="park._id" v-for="park in panes[active].data.parks"></Park>
          </div>
          <div class="toolbox--list-blueprints" v-if="active == 'blueprints'">
            <Blueprint :model="blueprint" :key="blueprint._id" v-for="blueprint in panes[active].data.blueprints" v-tooltip="{ content: selectMode ? 'Select this Blueprint' : null }"></Blueprint>
          </div>
          <div class="toolbox--list-images columns is-multiline" v-if="active == 'images'">
            <ImageThumbnail :key="image._id" :media="image" v-for="image in panes[active].data.media" @select="select(image)"></ImageThumbnail>
          </div>
          <div class="toolbox--list-videos columns is-multiline" v-if="active == 'videos'">
            <VideoThumbnail :key="video._id" :media="video" v-for="video in panes[active].data.media" @select="select(video)"></VideoThumbnail>
          </div>

          <Pagination :total="pagination.total" :current="pagination.current" :pages="pagination.pages" @goTo="goToPage" v-if="pagination.pages > 1"></Pagination>
        </div>



      </main>
      <nav class="toolbox--nav">
        <a @click="tab('parks')"><span class="icon"><i class="fas fa-cubes"></i></span> <span>Parks</span></a>
        <a @click="tab('blueprints')"><span class="icon"><i class="fas fa-cube"></i></span> <span>Blueprints</span></a>
        <a @click="tab('billboards')"><span class="icon"><i class="far fa-rectangle-portrait"></i></span> <span>Billboards</span></a>
        <a @click="tab('videos')"><span class="icon"><i class="fas fa-film"></i></span> <span>Videos</span></a>
        <a @click="tab('images')"><span class="icon"><i class="fas fa-image"></i></span> <span>Images</span></a>
      </nav>
    </div>
  </div>
</template>

<script>
import '@/styles/components/_Toolbox.scss'
import Pagination from '@/components/ui/Pagination'
import Loader from '@/components/ui/Loader'
import API from '@/services/api'
import { ToolBus } from './Toolbus.js'

import Park from '@/components/Parks/List'
import Blueprint from '@/components/Blueprints/List'
import ImageThumbnail from '@/components/Media/ImageThumbnail'
import VideoThumbnail from '@/components/Media/VideoThumbnail'

export default {
  name: 'toolbox',
  components: {
    Park,
    Blueprint,
    Loader,
    Pagination,
    VideoThumbnail,
    ImageThumbnail
  },
  data () {
    return {
      open: false,
      loading: true,
      selectMode: false,
      restricted: [],
      active: 'parks',
      context: 'user',
      pagination: {
        current: 1,
        pages: 1,
        total: 0,
        limit: 25
      },
      panes: {
        'parks': {
          title: 'Parks',
          query: 'parks',
          data: []
        },
        'blueprints': {
          title: 'Blueprints',
          query: 'blueprints',
          data: []
        },
        'billboards': {
          title: 'Billboards',
          query: 'billboards',
          data: []
        },
        'videos': {
          title: 'Videos',
          query: 'media',
          params: { type: 'video' },
          data: []
        },
        'images': {
          title: 'Images',
          query: 'media',
          params: { type: 'image' },
          data: []
        }
      }
    }
  },
  methods: {
    getToolbox(m) {
      this.loading = true
      let model = this.panes[m]
      let params = {}
      if(this.context == 'user') {
        params = { owned: true }
      } else if(this.context == 'saved') {
        params = { toolbox: true }
      }

      params = Object.assign(params, { page: this.pagination.current }, this.panes[m].params)
      return API.fetch(model.query, params).then((response) => {
        model.data = response
        this.pagination = {
          total: response.total,
          pages: response.pages,
          limit: response.limit,
          current: response.page
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    select(model) {
      if(this.selectMode) {
        console.log('emitting select')
        ToolBus.$emit('select', model)
        this.toggle()
      }
    },
    toggle() {
      if(this.open) {
        this.selectMode = false
        this.restricted = []
        return this.open = false
      } else {
        this.getToolbox(this.active)
        return this.open = true
      }
    },
    tab(model, context, selectMode = []) {
      if(selectMode.length > 0) {
        this.selectMode = true
      }

      this.active = model
      if(context) this.context = context
      this.pagination = {
        current: 1,
        pages: 1,
        total: 0,
        limit: 25
      }

      this.getToolbox(model)
    },
    goToPage(page) {
      this.pagination.current = page
      this.getParks().then(() => {
        this.loading = false
      })
    }
  },
  mounted () {
    ToolBus.$on('toggle', (options) => {
      let opts = Object.assign({ tab: 'parks', context: 'user', selectMode: false }, options)
      this.tab(opts.tab, opts.context, opts.selectMode)
      this.toggle()
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
hr {
  background-color: $warning-invert;
}

.tabs {
  margin: 0!important;
}
</style>
