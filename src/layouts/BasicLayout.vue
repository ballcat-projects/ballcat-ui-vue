<template>
  <a-layout :class="['layout', device]">
    <!-- SideBar -->
    <side-bar :menus="menus" />

    <a-layout
      :class="[layout, `content-width-${contentWidth}`]"
      :style="{ position: 'relative' }"
    >
      <!-- layout header -->
      <global-header :mode="layout" :menus="menus" :theme="navTheme" />

      <!-- 公告彩条 -->
      <announcement-ribbon />

      <!-- 多页签 -->
      <div v-if="multiTab" :style="multiTabWrapperStyle">
        <multi-tab :class="fixedHeader && 'ballcat-multi-tab-fixed'" />
      </div>
      <!-- 固定头部时进行 占位使用 -->
      <div v-if="multiTab && fixedHeader" style="visibility:hidden;" class="ballcat-multi-tab" />

      <!-- layout content -->
      <a-layout-content>
        <router-view />
      </a-layout-content>

      <!-- layout footer -->
      <a-layout-footer>
        <global-footer />
      </a-layout-footer>
    </a-layout>

    <!-- websocket -->
    <global-web-socket v-if="enableWebsocket" />
  </a-layout>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { APP_MUTATIONS } from '@/store/mutation-types'
import { mixin, mixinDevice } from '@/utils/mixin'
import projectConfig from '@/config/projectConfig'
import SideBar from '@/components/SideBar'
import GlobalHeader from '@/components/GlobalHeader'
import GlobalFooter from '@/components/GlobalFooter'
import GlobalWebSocket from '@/components/WebSocket/GlobalWebSocket'
import AnnouncementRibbon from '@/components/Notify/AnnouncementRibbon'

export default {
  name: 'BasicLayout',
  components: {
    SideBar,
    GlobalHeader,
    GlobalFooter,
    GlobalWebSocket,
    AnnouncementRibbon
  },
  mixins: [mixin, mixinDevice],
  data () {
    return {
      production: process.env.NODE_ENV === 'production',
      enableWebsocket: projectConfig.enableWebsocket
    }
  },
  computed: {
    ...mapGetters(['sidebarCollapsed', 'contentFullScreen', 'isSideMenu', 'isMixMenu', 'isNoneMenu', 'userRouters']),
    contentPaddingLeft () {
      if (!this.isSideMenu) {
        if (this.isMixMenu) {
          return this.sidebarCollapsed ? '48px' : '208px'
        }
        return '0px'
      }
      return this.sidebarCollapsed ? '48px' : '208px'
    },
    multiTabWrapperStyle () {
      // 有公告彩条的时候高度加高
      const hasAnnouncementRibbon = true;
      let style = {
        top: hasAnnouncementRibbon ? '80px': '40px',
        width: '100%',
        zIndex: 16,
        right: 0,
        transition: 'width 0.3s',
      }
      // 固定头部时，宽度需要减掉侧边菜单的宽度
      if(this.fixedHeader){
        style.position = 'fixed'
        style.width = this.isNoneMenu? '100%': `calc(100% - ${this.contentPaddingLeft})`
      }
      // 当内容全屏时，不需考虑侧标栏，直接 100% 展开，且没有 header 占位，top 修改为 0
      if(this.contentFullScreen){
        style.top = '0px'
        style.width = '100%'
      }
      return style
    },
    menus () {
      return this.userRouters.find(item => item.path === '/').children
    }
  },
  methods: {
    ...mapMutations([APP_MUTATIONS.TOGGLE_SIDE_BAR_COLLAPSED]),
    menuSelect () {
      if (!this.isSideMenu) {
        this.drawerMenuClose()
      }
    },
    drawerMenuClose () {
      this[APP_MUTATIONS.TOGGLE_SIDE_BAR_COLLAPSED](true)
    }
  }
}
</script>

<style lang="less">
@import url('~@/styles/index.less');
@import url('~@/styles/global.less');
@import url('~@/styles/ballcat.less');
</style>
