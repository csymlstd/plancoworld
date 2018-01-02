<template>
    <router-link :to="{ name: 'Profile', params: { username: user.name.display } }" class="profile profile--micro">
    <div class="avatar"><img :src="user.avatar.url" v-if="user.avatar" /></div>
    <div class="user">{{ user.name.display }}</div>
    </router-link>
</template>

<script>
import '@/styles/components/_avatar.scss'

export default {
  props: {
    user: {}
  }
}
</script>
