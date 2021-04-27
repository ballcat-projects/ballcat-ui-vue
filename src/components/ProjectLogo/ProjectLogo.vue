<template>
  <div class="project-logo">
    <router-link :to="{name:'/'}">
      <img src="@/assets/logo.svg" alt="logo">
      <h1 v-if="!sidebarCollapsed || layout === 'top'">{{ projectTitle }}</h1>
    </router-link>
  </div>
</template>

<script>
import projectConfig from '@/config/projectConfig'
import { mapGetters } from 'vuex'

export default {
  name: 'Logo',
  data () {
    return {
      projectTitle: projectConfig.projectTitle
    }
  },
  computed: {
    ...mapGetters(['sidebarCollapsed', 'layout'])
  }
}
</script>

<style scoped lang="less">
@import "ProjectLogo.less";
</style>
