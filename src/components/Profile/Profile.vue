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
                    <a :href="''" target="_blank" class="button level-item is-medium is-primary"><span class="icon"><i class="fab fa-steam"></i></span> <span>Follow on Steam</span></a>

                    <div class="field level-item has-addons" v-if="isOwner()">
                        <div class="control"><a @click="toggleEditMode" class="button is-warning is-medium construction">Edit</a></div>
                        <div class="control"><a @click="updatePark()" class="button is-light is-medium" v-if="editMode">Save</a></div>
                    </div>

                </div>
            </div>
            </div>
        </section>

        <main class="container">
            <nav class="toolbox--nav is-horizontal">
                <a @click="tab('parks')" :class="{ 'is-active': active == 'parks' }"><span class="icon"><i class="fab fa-fort-awesome"></i></span> <span>Parks</span></a>
                <a @click="tab('blueprints')" :class="{ 'is-active': active == 'blueprints' }"><span class="icon"><i class="fas fa-box-open"></i></span> <span>Blueprints</span></a>
                <a @click="tab('billboards')" :class="{ 'is-active': active == 'billboards' }"><span class="icon"><i class="fas fa-sign"></i></span> <span>Billboards</span></a>
                <a @click="tab('kits')" :class="{ 'is-active': active == 'kits' }"><span class="icon"><i class="fas fa-box-full"></i></span> <span>Kits</span></a>
            </nav>
            <div class="columns">
            <div class="column is-one-quarter content">
                <Filters :options="filterOptions" :selected="selectedTags" @selected="selectedTags = $event"></Filters>
            </div>
            <div class="column">
     
                <div class="columns cards is-multiline loader--parent">

                </div>
            </div>
            </div>
        </main>

    </div>
</template>

<script>
import Filters from '@/components/ui/Filters'
import API from '@/services/api'

export default {
    components: {
        Filters
    },
    computed: {
        user() {
            return this.$store.state.user
        },
        username() {
            return this.$route.params.username
        }
    },
    data() {
        return {
            editMode: false,
            profile: {},
            active: 'parks',
            selectedTags: [],
            filterOptions: {
                'coasters': {
                label: 'Coasters',
                type: 'list'
                },
                'rides': {
                label: 'Rides',
                type: 'list'
                },
                'shops': {
                label: 'Shops',
                type: 'list'
                },
                'facilities': {
                label: 'Facilities & Utilities',
                type: 'list'
                },
                'buildings': {
                label: 'Buildings',
                type: 'list',
                visible: true
                },
                'scenery': {
                label: 'Scenery',
                type: 'list',
                visible: true
                },
                'age-groups': {
                label: 'Age Groups',
                type: 'toggle',
                },
                'materials': {
                label: 'Materials',
                type: 'list'
                },
                'themes': {
                label: 'Themes',
                type: 'list'
                },
                'style': {
                label: 'Styles',
                type: 'list'
                },
                'content-packs': {
                label: 'Content Packs',
                type: 'list',
                dlc: true,
                visible: true,
                force: true
                },
            }
        }
    },
    methods: {
        getProfile() {
            API.fetch('profile/'+this.username).then(profile => {
                this.profile = Object.assign({}, this.profile, profile)
            })
        },
        tab(t) {
            this.active = t
        },
        isOwner() {
            return this.profile._id == this.user.profile._id
        },
        copy() {
            
        }
    },
    created() {
        this.getProfile()
    }
}
</script>