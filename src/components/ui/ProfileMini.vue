<template>
  <div class="profile profile--mini">
    <div class="avatar" style="{ 'backgroundImage': user.avatar.url }"></div>
    <div class="user"><router-link :to="{ name: 'Profile', params: { username: user.name.display } }">{{ user.name.display }}</router-link></div>
  </div>
</template>

<script>
import '@/styles/components/_avatar.scss'

export default {
  props: {
    user: {
      type: Object,
      default () {
        return { name: {} }
      }
    }
  }
}
</script>
