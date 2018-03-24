<template>
<Modal :class="['is-wide']" :show="show">
    <header>
        <h2 class="title">Create a Kit</h2>
    </header>
    <main>
        <form @submit="create">
            <div class="notification is-warning" v-if="error">
                {{ error }}
            </div>
            <div class="field">
                <div class="control">
                <input type="text" @input="$v.name.$touch()" v-model="name" placeholder="Name" class="input is-medium" :class="{ 'is-danger': $v.name.$error }" />
                </div>
                
            </div>

            <div class="level">
                <div class="level-left">
                <button class="button is-medium is-primary level-item" :class="{ 'is-loading': loading }" type="submit"><span>Create Kit</span></button>
                <button class="button is-light is-medium level-item" @click="cancel()">Cancel</button>
                </div>
            </div>
        </form>
    </main>
</Modal>
</template>

<script>
import Modal from '@/components/ui/Modal'
import api from '@/services/api'

import { required } from 'vuelidate/lib/validators'

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
            error: false,
            name: '',
        }
    },
    validations: {
        name: {
            required
        },
    },
    methods: {
        create(e) {
            if(e) e.preventDefault()
            
            this.error = false
            this.$v.name.$touch()
            if(this.$v.name.$invalid) return

            this.loading = true
            api.post('kits', {
                name: this.name
            }).then(kit => {
                this.$emit('created', kit)
            }).catch(err => {
                this.loading = false
                this.error = err.response.data.message
            })
        },
        cancel() {
            this.$emit('cancel')
        }
    }
}
</script>