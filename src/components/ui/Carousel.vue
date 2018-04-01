<template>
    <div class="carousel">
        <div class="carousel-item" :key="item._id" v-for="item in media">
            <div class="carousel-image" v-if="item.type == 'image'" :style="getBackground(item)"></div>
        </div>
    </div>
</template>

<script>
import 'flickity/css/flickity.css'
import '@/styles/components/_carousel.scss'
import Flkty from 'flickity'

export default {
    props: {
        media: {
            type: Array,
            default() {
                return []
            }
        }
    },
    watch: {
        media() {
            console.log('media updated')
            if(this.flickity) this.flickity.destroy()
            this.$nextTick(() => {
                this.init()
            })
        }
    },
    data() {
        return {
            flickity: false
        }
    },
    methods: {
        getBackground(item) {
            return `background: url('${item.url}') no-repeat center;`
        },
        init() {
            this.flickity = new Flkty(this.$el, {
                prevNextButtons: false,
                pageDots: true,
                autoPlay: 4000
            })
        }
    },
    mounted() {
        this.init()
    }
}
</script>