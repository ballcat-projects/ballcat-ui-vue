<template>
  <transition name="showHeader">
    <div v-if="visible" class="ballcat-global-header">
      <a-layout-header
        v-if="visible"
        :class="[fixedHeader && 'ant-header-fixedHeader', sidebarOpened ? 'ant-header-side-opened' : 'ant-header-side-closed', ]"
        :style="{ padding: '0'}"
      >
        <div v-if="mode === 'sidemenu'" class="header">
          <global-header-tool-left />
          <global-header-breadcrumb v-if="!isMobile" style="padding-left: 12px" />
          <div style="flex: 1 1 0" />
          <global-header-tool-right />
        </div>
        <div v-else :class="['top-nav-header-index', theme]">
          <div class="header-index-wide">
            <div class="header-index-left">
              <template v-if="!isMobile">
                <div class="ballcat-top-nav-header-logo">
                  <img src="@/assets/logo.svg" alt="logo">
                  <h1>Ball Cat</h1>
                </div>
                <s-menu
                  mode="horizontal"
                  :menu="menus"
                  :theme="theme"
                />
              </template>
              <global-header-tool-left v-else />
            </div>
            <global-header-tool-right />
          </div>
        </div>
      </a-layout-header>
    </div>
  </transition>
</template>

<script>
import SMenu from '../Menu/'
import GlobalHeaderBreadcrumb from '@/components/GlobalHeader/GlobalHeaderBreadcrumb'
import GlobalHeaderToolLeft from '@/components/GlobalHeader/GlobalHeaderToolLeft'
import GlobalHeaderToolRight from '@/components/GlobalHeader/GlobalHeaderToolRight'
import { mixin, mixinDevice } from '@/utils/mixin'

export default {
  name: 'GlobalHeader',
  components: {
    GlobalHeaderToolRight,
    GlobalHeaderToolLeft,
    SMenu,
    GlobalHeaderBreadcrumb
  },
  mixins: [mixin, mixinDevice],
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
    }
  },
  data () {
    return {
      visible: true,
      oldScrollTop: 0
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
    }
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
