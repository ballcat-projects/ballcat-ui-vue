<template>
  <div class="project-logo">
    <router-link :to="{name:'/'}">
      <LogoSvg width="32" height="32" />
      <h1 v-if="!sidebarCollapsed || layout === 'top'">{{ projectTitle }}</h1>
    </router-link>
  </div>
</template>

<script>
import LogoSvg from '@/assets/logo.svg'
import projectConfig from '@/config/projectConfig'
import { mapGetters } from 'vuex'

export default {
  name: 'Logo',
  components: {
    LogoSvg
  },
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
