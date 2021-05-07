<template>
  <!-- eslint-disable vue/no-mutating-props-->
  <a-layout-sider
    :class="['sider',
             isDesktop ? null : 'shadow',
             navTheme === 'light' ? 'sider-light': null,
             fixSiderbar ? 'sider-fixed' : null ]"
    width="208px"
    :collapsed="sidebarCollapsed"
    :collapsible="true"
    :style="style"
    :theme="navTheme"
    :trigger="null"
  >
    <!-- eslint-enable-->
    <project-logo />
    <div style="flex: 1; overflow-y: auto; overflow-x: hidden;">
      <s-menu
        :collapsed="sidebarCollapsed"
        :menu="currentMenus"
        :theme="navTheme"
        :mode="mode"
        @select="onSelect"
      />
    </div>
  </a-layout-sider>

</template>

<script>
import SMenu from './index'
import { mixin, mixinDevice } from '@/utils/mixin'
import { mapGetters } from 'vuex'
import ProjectLogo from '@/components/ProjectLogo'

export default {
  name: 'SideMenu',
  components: { ProjectLogo, SMenu },
  mixins: [mixin, mixinDevice],
  props: {
    mode: {
      type: String,
      required: false,
      default: 'inline'
    },
    menus: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      currentMenus: []
    }
  },
  computed: {
    ...mapGetters(['sidebarCollapsed']),
    style () {
      const width = this.sidebarCollapsed ? '48px' : '208px'
      return {
        overflow: 'hidden',
        flex: '0 0 ' + width,
        maxWidth: width,
        minWidth: width,
        width: width,
        height: '100%'
      }
    }
  },
  watch: {
    $route (to) {
      this.firstToUpper(to)
    },
    layout () {
      this.firstToUpper(this.$route)
    },
    device () {
      this.firstToUpper(this.$route)
    }
  },
  created () {
    // 刚刚开始加载菜单
    this.firstToUpper(this.$route)
  },
  methods: {
    firstToUpper (path) {
      if (this.isMobile || this.layout === 'side') {
        return this.currentMenus = this.menus
      }

      let pathName = path.matched[1].name
      this.menus.find((item) => {
        if (pathName) {
          return (!item.hidden && item.name === pathName) && (this.currentMenus = item.children)
        } else {
          return !item.hidden && (this.currentMenus = item.children)
        }
      })
    },
    onSelect (obj) {
      this.$emit('menuSelect', obj)
    }
  }
}
</script>

<style lang="less">
@import url('./SideMenu');
</style>
