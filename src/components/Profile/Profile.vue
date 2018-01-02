<template>
    <div class="profile">
        <section class="hero hero--tall" :style="{ backgroundImage: `url('')` }">
            <div class="hero-meta">
            <div class="container">
                <div class="level">
                <div class="level-left">
                    
                </div>
                <div class="level-right">
                    <a @click="" class="button level-item is-white is-medium" v-if="editMode"><span>Manage Photos</span></a>
                </div>
                </div>
            </div>
            </div>
        </section>
        <section class="hero">
            <div class="container">
            <div class="level is-mobile">
                <div class="level-left">
                <h1 class="title level-item">Creator</h1>
                <h2 class="title level-item"> / {{ $route.params.username }} </h2>
                </div>
                <div class="level-right">
                <button class="button level-item is-medium is-dark" @click="copy" v-tooltip="{ content: 'Copy Profile URL'  }"><span class="icon"><i class="fas fa-link"></i></span></button>

                <div class="field level-item has-addons" v-if="isOwner()">
                    <div class="control"><a @click="toggleEditMode" class="button is-warning is-medium construction">Edit</a></div>
                    <div class="control"><a @click="updatePark()" class="button is-light is-medium" v-if="editMode">Save</a></div>
                </div>

                </div>
            </div>
            </div>
        </section>
    </div>
</template>

<script>
export default {
    data() {
        return {
            editMode: false,
            profile: {}
        }
    },
    methods: {
        isOwner() {

        },
        copy() {
            
        }
    }
}
</script>