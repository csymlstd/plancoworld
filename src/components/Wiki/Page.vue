<template>
<article class="guide content box">
    <header>
        <Filters :options="{'wiki': { label: false, type: 'tags' }}" :inline="true" :readOnly="true" :large="true" ref="tags"></Filters>
        <h1 v-html="page.name"></h1>
        
    </header>
    
    {{ page.content }}
</article>
</template>

<script>
import API from '@/services/api'
import Auth from '@/services/auth'
import Filters from '@/components/ui/Filters'

export default {
    components: {
        Filters,
    },
    data() {
        return {
            page: {}
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
                this.$refs.tags.set(this.page.tags)
            })
        }
    },
    mounted() {
        this.getPage()
    }
}
</script>