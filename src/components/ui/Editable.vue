<template>
    <span contenteditable @input="$emit('input', $event.target.innerHTML)" @keypress.enter="onReturn" v-html="userContent"></span>
</template>

<script>
export default {
    props: ['value'],
    data() {
       return {
            userContent: ''
       }
    },
    methods: {
        onReturn(e) {
            console.log('cancel')
            e.preventDefault()
            return false
        }
    },
    mounted() {
        this.userContent = this.value
    }
}
</script>