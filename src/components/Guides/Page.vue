<template>
<div class="box">
<Loader v-if="loading"></Loader>
<article class="guide content" v-show="!loading">
    <header>
        <Filters :options="{'wiki': { label: false, type: 'tags' }}" :selected="page.tags" :inline="true" :readOnly="true" :large="true" ref="tags"></Filters>
        <h1 v-html="page.name"></h1>
        
    </header>
    <div class="content">
    {{ page.content }}
    </div>
</article>
</div>
</template>

<script>
import Loader from '@/components/ui/Loader'
import API from '@/services/api'
import Auth from '@/services/auth'
import Filters from '@/components/ui/Filters'

export default {
    components: {
        Filters,
        Loader
    },
    data() {
        return {
            page: {}
        }
    },
    metaInfo() {
        return {
        title: this.page.name,
        titleTemplate: '%s • Guides • PlanCoWorld'
        }
    },
    watch: {
        $route(to ,from) {
            this.getPage()
        }
    },
    computed: {
        slug() {
            return this.$route.params.slug
        } 
    },
    methods: {
        getPage() {
            return API.fetch('wiki/slug/'+this.slug).then(page => {
                this.page = page
            })
        }
    },
    mounted() {
        this.getPage()
    }
}
</script>