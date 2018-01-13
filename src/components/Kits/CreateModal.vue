<template>
<Modal :class="['is-wide']" :show="show">
    <header>
        <h2 class="title">Create a Kit</h2>
    </header>
    <main>
    <div class="field">
        <div class="control">
        <input type="text" placeholder="Name" class="input is-medium" />
        </div>
        
    </div>

    <div class="level">
        <div class="level-left">
        <button class="button is-medium is-primary level-item" :class="{ 'is-loading': loading }" @click="create()"><span>Create Kit</span></button>
        <button class="button is-light is-medium level-item" @click="cancel()">Cancel</button>
        </div>
    </div>

    </main>
</Modal>
</template>

<script>
import Modal from '@/components/ui/Modal'
export default {
    components: {
        Modal
    },
    props: {
        show: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            loading: false,
        }
    },
    methods: {
        create() {

        },
        cancel() {
            this.$emit('cancel')
        }
    }
}
</script>