<template>
<div class="reactions-meter--wrapper">
    <div class="reactions-meter meter fear">
        <div class="reaction is-selectable" :class="[current.key]" v-tooltip="{ content: current.value }" ></div>
    </div>
    <p class="text-center">Reactions</p>
</div>
</template>

<script>
export default {
    props: {
        reactions: false
    },
    computed: {
        current() {
           return this.lengths[0]
        },
        lengths() {
            if(typeof this.reactions == 'undefined' || !this.reactions) return [{ key: 'none', value: false }]
            let values = [
                { key: 'boring', value: this.reactions.boring.length },
                { key: 'nauseating', value: this.reactions.nauseating.length},
                { key: 'scary', value: this.reactions.scary.length},
                { key: 'exciting', value: this.reactions.exciting.length},
                { key: 'love', value: this.reactions.love.length},
            ]

            return values.sort((a,b) => {return (a.value > b.value) ? -1 : ((b.value > a.value) ? 1 : 0)})
        }
    }
}
</script>

<style>
 .reactions-meter.fear .love {
     left: 45%;
     position: absolute;
     transform: translateX(-50%);
 }
 .reactions-meter.fear .exciting {
     left: 35%;
     position: absolute;
     transform: translateX(-50%);
 }
 .reactions-meter.fear .scary {
     left: 75%;
     position: absolute;
     transform: translateX(-50%);
 }
 .reactions-meter.fear .nauseating {
     left: 95%;
     position: absolute;
     transform: translateX(-50%);
 }
</style>