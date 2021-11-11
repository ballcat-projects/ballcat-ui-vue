<template>
  <!-- eslint-enable-->
  <s-menu
    :collapsed="sidebarCollapsed"
    :menu="currentMenus"
    :theme="navTheme"
    :mode="mode"
    @select="onSelect"
  />
</template>

<script>
import SMenu from './index'
import { mapGetters } from 'vuex'

export default {
  name: 'SideMenu',
  components: { SMenu },
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
    ...mapGetters(['sidebarCollapsed', 'navTheme', 'layout']),
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
    },
    menus (){
      this.firstToUpper(this.$route)
    }
  },
  created () {
    // 刚刚开始加载菜单
    this.firstToUpper(this.$route)
  },
  methods: {
    /**
     * 混合布局的时候，需要根据顶部菜单自动切割当前菜单
     * @param path
     * @returns {*[]}
     */
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
@import url('SideMenu');
</style>
