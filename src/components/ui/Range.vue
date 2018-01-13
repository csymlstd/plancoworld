<template>
    <div class="control range-wrapper">
        <div class="range"></div>
        <input type="number" :value="value" :min="min" :max="max" :step="step" v-model="value" />
    </div>
</template>

<script>
import '@/styles/ui/_range.scss'
import slider from 'nouislider'
import 'nouislider/distribute/nouislider.css'

export default {
    props: {
        value: [String, Number],
        min: { type: [String, Number], default: '0' },
        max: { type: [String, Number], default: '10' },
        step: { type: [String, Number], default: '0.01' },
    },
    methods: {
        update(v) {
            this.$emit('input', v)
        }
    },
    mounted() {
        this.range = slider.create(this.$el, {
            step: Number(this.step),
            start: 0,
            range: {
                'min': [ Number(this.min) ],
                'max': [ Number(this.max) ],
            },
            pips: {
                mode: 'range',
                density: 10
            }
        })

        this.range.on('update', (e) => {
            this.update(e[0])
        })
    }
}
</script>