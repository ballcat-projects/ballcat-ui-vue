<template>
  <a-drawer
    v-if="isDrawerMenu"
    placement="left"
    :wrap-class-name="`drawer-sider ${navTheme}`"
    :drawer-style="drawerStyle"
    :body-style="{ padding: '0px'}"
    :closable="false"
    :visible="!sidebarCollapsed"
    :width="208"
    @close="drawerClose"
  >
    <sider :menus="menus" />
  </a-drawer>
  <div v-else-if="isSideMenu || isMixMenu" :style="sideMenuWrapperStyle">
    <!-- 用来占位用的 -->
    <div :style="menuFixedPositionStyle" />
    <sider :menus="menus" />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { APP_MUTATIONS } from '@/store/mutation-types'
import { mixinDevice } from '@/utils/mixin'
import Sider from '@/components/SideBar/Sider'

export default {
  name: 'SideBar',
  components: {Sider},
  mixins: [mixinDevice],
  props: {
    menus: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      hidden: false,
    }
  },
  computed: {
    ...mapGetters(['sidebarCollapsed', 'navTheme', 'isDrawerMenu', 'isSideMenu', 'isMixMenu']),
    drawerStyle () {
      if(this.navTheme ==='dark'){
        return {
          backgroundColor: '#001529'
        }
      }
      return {}
    },
    menuFixedPositionStyle () {
      const width = this.sidebarCollapsed? '48px': '208px'
      return {
        width: `${width}`,
        overflow: "hidden",
        flex: `0 0 ${width}`,
        maxWidth: `${width}`,
        minWidth: `${width}`,
        transition: "background-color 0.3s ease 0s, min-width 0.3s ease 0s, max-width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) 0s"
      }
    },
    sideMenuWrapperStyle () {
      return this.hidden ? { display : 'none'} : {}
    }
  },
  created () {
    this.$bus.$on('content-full-screen', this.switchShowHidden)
  },
  destroyed () {
    this.$bus.$off('content-full-screen', this.switchShowHidden)
  },
  methods: {
    ...mapMutations([APP_MUTATIONS.TOGGLE_SIDE_BAR_COLLAPSED]),
    menuSelect () {
      if (!this.isSideMenu) {
        this.drawerClose()
      }
    },
    drawerClose () {
      this[APP_MUTATIONS.TOGGLE_SIDE_BAR_COLLAPSED](true)
    },
    switchShowHidden(){
      this.hidden = !this.hidden
    }
  }
}
</script>
