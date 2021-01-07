<template>
  <transition name="showHeader">
    <div v-if="visible" class="header-animat">
      <a-layout-header
        v-if="visible"
        :class="[fixedHeader && 'ant-header-fixedHeader', sidebarOpened ? 'ant-header-side-opened' : 'ant-header-side-closed', ]"
        :style="{ padding: '0'}">
        <div v-if="mode === 'sidemenu'" class="header">
          <a-icon class="trigger" :type="collapsedButtonIconType" @click="toggle"/>
          <user-menu></user-menu>
        </div>
        <div v-else :class="['top-nav-header-index', theme]">
          <div class="header-index-wide">
            <div class="header-index-left">
              <img class="top-nav-header" src="@/assets/logo.svg" alt="logo"/>
              <s-menu v-if="device !== 'mobile'" mode="horizontal" :menu="menus" :theme="theme"/>
              <a-icon v-else class="trigger" :type="collapsedButtonIconType" @click="toggle"/>
            </div>
            <user-menu class="header-index-right"></user-menu>
          </div>
        </div>
      </a-layout-header>
    </div>
  </transition>
</template>

<script>
import UserMenu from '../tools/UserMenu'
import SMenu from '../Menu/'
import { mixin } from '@/utils/mixin'

export default {
  name: 'GlobalHeader',
  components: {
    UserMenu,
    SMenu
  },
  mixins: [mixin],
  props: {
    mode: {
      type: String,
      // sidemenu, topmenu
      default: 'sidemenu'
    },
    menus: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    device: {
      type: String,
      required: false,
      default: 'desktop'
    }
  },
  data () {
    return {
      visible: true,
      oldScrollTop: 0
    }
  },
  computed: {
    collapsedButtonIconType () {
      const isMobile = this.device === 'mobile'
      const collapsed = this.collapsed
      if ((collapsed && isMobile) || (!collapsed && !isMobile)) {
        return 'menu-fold'
      } else {
        return 'menu-unfold'
      }
    }
  },
  mounted () {
    document.addEventListener('scroll', this.handleScroll, { passive: true })
  },
  beforeDestroy () {
    document.body.removeEventListener('scroll', this.handleScroll, true)
  },
  methods: {
    handleScroll () {
      if (!this.autoHideHeader) {
        return
      }

      const scrollTop = document.body.scrollTop + document.documentElement.scrollTop
      if (!this.ticking) {
        this.ticking = true
        requestAnimationFrame(() => {
          if (this.oldScrollTop > scrollTop) {
            this.visible = true
          } else if (scrollTop > 300 && this.visible) {
            this.visible = false
          } else if (scrollTop < 300 && !this.visible) {
            this.visible = true
          }
          this.oldScrollTop = scrollTop
          this.ticking = false
        })
      }
    },
    toggle () {
      this.$emit('toggle')
    }
  }
}
</script>

<style lang="less">
@import '../index.less';

.header-animat {
  position: relative;
  z-index: @ant-global-header-zindex;
}

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
