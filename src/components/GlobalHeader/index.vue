<template>
  <a-layout-header :style="headerStyle">
    <transition name="showHeader">
      <div
        :class="[
          'ballcat-global-header',
          fixedHeader && 'ant-header-fixedHeader',
          (isSideMenu || isMixMenu) ? (sidebarCollapsed ? 'ant-header-side-closed': 'ant-header-side-opened') : null,
        ]"
      >
        <div v-if="mode === 'side'" class="header">
          <header-left-content />
          <header-breadcrumb v-if="!isMobile" style="padding-left: 12px" />
          <div style="flex: 1 1 0" />
          <header-right-content />
        </div>
        <div v-else-if="mode === 'mix'" class="header">
          <header-left-content />
          <top-menu v-if="device !== 'mobile'" :menus="menus" />
          <header-right-content />
        </div>
        <div v-else :class="['top-nav-header-index', theme]">
          <div class="header-index-wide">
            <template v-if="isMobile">
              <header-left-content />
              <div style="flex: 1 1 0" />
            </template>
            <template v-else>
              <div class="header-index-left">
                <project-logo class="ballcat-top-nav-header-logo" />
              </div>
              <s-menu
                mode="horizontal"
                :menu="menus"
                :theme="theme"
                style="flex: 1 1 0"
              />
            </template>
            <header-right-content />
          </div>
        </div>
      </div>
      <!-- 固定头部时进行 占位使用 -->
      <div v-if="fixedHeader" style="visibility:hidden;" class="header" />
    </transition>
  </a-layout-header>
</template>

<script>
import SMenu from '@/components/Menu'
import HeaderBreadcrumb from '@/components/Breadcrumb/Breadcrumb'
import HeaderLeftContent from '@/components/GlobalHeader/LeftContent'
import HeaderRightContent from '@/components/GlobalHeader/RightContent'
import TopMenu from '@/components/Menu/TopMenu'
import ProjectLogo from '@/components/ProjectLogo'
import { mixin, mixinDevice } from '@/utils/mixin'
import { mapGetters } from 'vuex'

export default {
  name: 'GlobalHeader',
  components: {
    HeaderBreadcrumb,
    HeaderLeftContent,
    HeaderRightContent,
    ProjectLogo,
    SMenu,
    TopMenu
  },
  mixins: [mixin, mixinDevice],
  props: {
    mode: {
      type: String,
      // side, top
      default: 'side'
    },
    menus: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    }
  },
  data() {
    return {
      hidden: false,
    }
  },
  computed: {
    ...mapGetters(['sidebarCollapsed', 'isSideMenu','isMixMenu']),
    headerStyle() {
      let style = {
        padding: '0px',
        zIndex: 19
      }
      this.hidden && (style.display = 'none')
      return style
    }
  },
  created () {
    this.$bus.$on('content-full-screen', this.switchShowHidden)
  },
  destroyed () {
    this.$bus.$off('content-full-screen', this.switchShowHidden)
  },
  methods: {
    switchShowHidden(){
      this.hidden = !this.hidden
    }
  }
}
</script>

<style lang="less">
@import url('index');

.showHeader-enter-active {
  transition: all 0.25s ease;
}

.showHeader-leave-active {
  transition: all 0.5s ease;
}

.showHeader-enter, .showHeader-leave-to {
  opacity: 0;
}
</style>
