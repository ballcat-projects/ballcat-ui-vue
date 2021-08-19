<template>
  <div>
    <a-drawer
      v-if="isDrawerMenu"
      placement="left"
      :wrap-class-name="`drawer-sider ${navTheme}`"
      :drawer-style="drawerStyle"
      :closable="false"
      :visible="!sidebarCollapsed"
      :width="208"
      @close="drawerClose"
    >
      <side-menu
        mode="inline"
        :menus="menus"
        :collapsible="false"
        @menuSelect="menuSelect"
      />
    </a-drawer>
    <side-menu
      v-if="isSideMenu || isMixMenu"
      mode="inline"
      :menus="menus"
      :collapsed="sidebarCollapsed"
      :collapsible="true"
    />
  </div>
</template>

<script>
import SideMenu from '@/components/Menu/SideMenu'
import { mapGetters, mapMutations, mapState } from 'vuex'
import { APP_MUTATIONS } from '@/store/mutation-types'
import { mixin } from '@/utils/mixin'

export default {
  name: 'SideBar',
  components: { SideMenu },
  mixins: [mixin],
  props: {
    menus: {
      type: Array,
      required: true
    }
  },
  computed: {
    ...mapGetters(['sidebarCollapsed', 'isDrawerMenu', 'isSideMenu', 'isMixMenu']),
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
