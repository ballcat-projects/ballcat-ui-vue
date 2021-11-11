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
  <sider v-else-if="isSideMenu || isMixMenu" :menus="menus" />
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
  updated () {
    console.log(this.isSideMenu, this.isMixMenu)
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
    }
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
    }
  }
}
</script>
