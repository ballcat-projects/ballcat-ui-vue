<template>
  <!-- eslint-disable vue/no-mutating-props-->
  <a-layout-sider
    v-model="collapsed"
    :class="['sider', isDesktop() ? null : 'shadow', theme, fixSiderbar ? 'ant-fixed-sidemenu' : null ]"
    width="208px"
    :collapsible="collapsible"
    :style="style"
    :trigger="null"
  >
    <!-- eslint-enable-->
    <div class="logo">
      <router-link :to="{name:'/'}">
        <img src="@/assets/logo.svg" alt="logo">
        <h1 v-if="isMobile() || !collapsed">Ball Cat</h1>
      </router-link>
    </div>
    <s-menu
      :collapsed="collapsed"
      :menu="menus"
      :theme="theme"
      :mode="mode"
      @select="onSelect"
    />
  </a-layout-sider>

</template>

<script>
import SMenu from './index'
import { mixin, mixinDevice } from '@/utils/mixin'

export default {
  name: 'SideMenu',
  components: { SMenu },
  mixins: [mixin, mixinDevice],
  props: {
    mode: {
      type: String,
      required: false,
      default: 'inline'
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    collapsible: {
      type: Boolean,
      required: false,
      default: false
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    menus: {
      type: Array,
      required: true
    }
  },
  computed: {
    style(){
      const width = this.collapsed ? '48px': '208px'
      return {
        overflow: 'hidden',
        flex: '0 0 ' + width,
        maxWidth: width,
        minWidth: width,
        width: width
      }
    }
  },
  methods: {
    onSelect (obj) {
      this.$emit('menuSelect', obj)
    }
  }
}
</script>
