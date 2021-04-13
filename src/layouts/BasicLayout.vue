<template>
  <a-layout :class="['layout', device]">
    <!-- SideMenu -->
    <a-drawer
      v-if="isMobile"
      placement="left"
      :wrap-class-name="`drawer-sider ${navTheme}`"
      :closable="false"
      :visible="sideMenuCollapsed"
      :width="208"
      @close="drawerClose"
    >
      <side-menu
        mode="inline"
        :menus="menus"
        :theme="navTheme"
        :collapsible="false"
        @menuSelect="menuSelect"
      />
    </a-drawer>

    <side-menu
      v-else-if="isSideMenu()"
      mode="inline"
      :menus="menus"
      :theme="navTheme"
      :collapsed="sideMenuCollapsed"
      :collapsible="true"
    />

    <a-layout
      :class="[layoutMode, `content-width-${contentWidth}`]"
      :style="{ paddingLeft: contentPaddingLeft, minHeight: '100vh' }"
    >
      <!-- layout header -->
      <global-header
        :mode="layoutMode"
        :menus="menus"
        :theme="navTheme"
      />

      <multi-tab v-if="multiTab" />

      <!-- 公告彩条 -->
      <!--      <announcement-ribbon />-->

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

      <!-- Setting Drawer (show in development mode) -->
      <setting-drawer v-if="!production" />
    </a-layout>

    <!-- websocket -->
    <global-web-socket />
  </a-layout>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import { mixin, mixinDevice } from '@/utils/mixin'
import config from '@/config/defaultSettings'

import SideMenu from '@/components/Menu/SideMenu'
import GlobalHeader from '@/components/GlobalHeader'
import GlobalFooter from '@/components/GlobalFooter'
import GlobalWebSocket from '@/components/WebSocket/GlobalWebSocket'
import SettingDrawer from '@/components/SettingDrawer/SettingDrawer'

export default {
  name: 'BasicLayout',
  components: {
    SettingDrawer,
    SideMenu,
    GlobalHeader,
    GlobalFooter,
    GlobalWebSocket
  },
  mixins: [mixin, mixinDevice],
  data () {
    return {
      production: config.production,
      menus: []
    }
  },
  computed: {
    ...mapGetters(['sideMenuCollapsed']),
    ...mapState({
      // 动态主路由
      mainMenu: state => state.userRouter.userRouters
    }),
    contentPaddingLeft () {
      if (!this.fixSidebar || this.isMobile) {
        return '0'
      }
      return this.sideMenuCollapsed ? '48px' : '208px'
    }
  },
  created () {
    this.menus = this.mainMenu.find(item => item.path === '/').children
  },
  mounted () {
    const userAgent = navigator.userAgent
    if (userAgent.indexOf('Edge') > -1) {
      this.$nextTick(() => {
        this.TOGGLE_SIDE_MENU_COLLAPSED();
        setTimeout(() => {
          this.TOGGLE_SIDE_MENU_COLLAPSED();
        }, 16)
      })
    }
  },
  methods: {
    ...mapMutations(['TOGGLE_SIDE_MENU_COLLAPSED']),
    // toggle () {
    //   this.collapsed = !this.collapsed
    //   this.setSidebar(!this.collapsed)
    //   triggerWindowResizeEvent()
    // },
    paddingCalc () {
      let left = ''
      if (this.sideMenuCollapsed) {
        left = (this.isMobile && '0') || ((this.fixSidebar && '48px') || '0')
      } else {
        left = this.isDesktop ? '48px': '208px'
      }
      return left
    },
    menuSelect () {
      if (!this.isDesktop) {
        this.TOGGLE_SIDE_MENU_COLLAPSED();
      }
    },
    drawerClose () {
      this.TOGGLE_SIDE_MENU_COLLAPSED();
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
