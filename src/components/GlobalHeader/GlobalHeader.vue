<template>
  <transition name="showHeader">
    <div :class="['ballcat-global-header']">
      <a-layout-header :style="{ padding: '0'}">
        <div
          :class="[
            fixedHeader && 'ant-header-fixedHeader',
            isSideMenu ? (sidebarCollapsed ? 'ant-header-side-closed': 'ant-header-side-opened') : null,
          ]"
        >
          <div v-if="mode === 'side'" class="header">
            <global-header-tool-left />
            <global-header-breadcrumb v-if="!isMobile" style="padding-left: 12px" />
            <div style="flex: 1 1 0" />
            <global-header-tool-right />
          </div>
          <div v-else :class="['top-nav-header-index', theme]">
            <div class="header-index-wide">
              <template v-if="isMobile">
                <global-header-tool-left />
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
              <global-header-tool-right />
            </div>
          </div>
        </div>
      </a-layout-header>

      <!-- 固定头部时进行 占位使用 -->
      <div v-if="fixedHeader" style="visibility:hidden;" class="header" />
    </div>
  </transition>
</template>

<script>
import SMenu from '../Menu/'
import GlobalHeaderBreadcrumb from '@/components/GlobalHeader/GlobalHeaderBreadcrumb'
import GlobalHeaderToolLeft from '@/components/GlobalHeader/GlobalHeaderToolLeft'
import GlobalHeaderToolRight from '@/components/GlobalHeader/GlobalHeaderToolRight'
import ProjectLogo from '@/components/ProjectLogo'
import { mixin, mixinDevice } from '@/utils/mixin'
import { mapGetters } from 'vuex'

export default {
  name: 'GlobalHeader',
  components: {
    ProjectLogo,
    GlobalHeaderToolRight,
    GlobalHeaderToolLeft,
    SMenu,
    GlobalHeaderBreadcrumb
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
  computed: {
    ...mapGetters(['sidebarCollapsed', 'isSideMenu'])
  }
}
</script>

<style lang="less">
@import url('./GlobalHeader');

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
