<template>
  <a-layout :class="['layout', device]">
    <!-- SideBar -->
    <side-bar :menus="menus" />

    <a-layout
      :class="[layout, `content-width-${contentWidth}`]"
      :style="{ paddingLeft: contentPaddingLeft, minHeight: '100vh' }"
    >
      <!-- layout header -->
      <global-header :mode="layout" :menus="menus" :theme="navTheme" />

      <!-- 公告彩条 -->
      <!--      <announcement-ribbon />-->

      <!-- 多页签 -->
      <div
        v-if="multiTab"
        :class="[
          fixedHeader && 'ant-header-fixedHeader',
          (isSideMenu || isMixMenu) ? (sidebarCollapsed ? 'ant-header-side-closed': 'ant-header-side-opened') : null,
        ]"
        :style="{top: '48px', zIndex: 16}"
      >
        <multi-tab :class="fixedHeader && 'ballcat-multi-tab-fixed'" />
      </div>
      <!-- 固定头部时进行 占位使用 -->
      <div v-if="multiTab && fixedHeader" style="visibility:hidden;" class="ballcat-multi-tab" />

      <!-- layout content -->
      <a-layout-content>
        <transition name="page-transition">
          <router-view />
        </transition>
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

export default {
  name: 'BasicLayout',
  components: {
    SideBar,
    GlobalHeader,
    GlobalFooter,
    GlobalWebSocket
  },
  mixins: [mixin, mixinDevice],
  data () {
    return {
      production: process.env.NODE_ENV === 'production',
      enableWebsocket: projectConfig.enableWebsocket
    }
  },
  computed: {
    ...mapGetters(['sidebarCollapsed', 'isSideMenu', 'isMixMenu', 'userRouters']),
    contentPaddingLeft () {
      if (!this.fixSiderbar || !this.isSideMenu) {
        if (this.isMixMenu) {
          return this.sidebarCollapsed ? '48px' : '208px'
        }
        return '0'
      }
      return this.sidebarCollapsed ? '48px' : '208px'
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
@import url('~@/styles/global.less');
@import url('~@/styles/ballcat.less');

/*
 * The following styles are auto-applied to elements with
 * transition="page-transition" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the page transition by editing
 * these styles.
 */

.page-transition-enter {
  opacity: 0;
}

.page-transition-leave-active {
  opacity: 0;
}

.page-transition-enter .page-transition-container,
.page-transition-leave-active .page-transition-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
