<template>
  <div class="profile profile--micro">
    <div class="avatar" style="{ 'backgroundImage': user.avatar.url }"></div>
    <div class="user">{{ user.name.display }}</div>
  </div>
</template>

<script>
import '@/styles/components/_avatar.scss'

export default {
  props: {
    user: {}
  }
}
</script>
