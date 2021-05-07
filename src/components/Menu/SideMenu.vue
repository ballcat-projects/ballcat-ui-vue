<template>
  <!-- eslint-disable vue/no-mutating-props-->
  <a-layout-sider
    :class="['sider', isDesktop ? null : 'shadow', theme, fixSiderbar ? 'ant-fixed-sidemenu' : null ]"
    width="208px"
    :collapsed="sidebarCollapsed"
    :collapsible="true"
    :style="style"
    :trigger="null"
  >
    <!-- eslint-enable-->
    <project-logo />
    <s-menu
      :collapsed="sidebarCollapsed"
      :menu="currentMenus"
      :theme="theme"
      :mode="mode"
      @select="onSelect"
    />
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
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    menus: {
      type: Array,
      required: true
    }
  },
  data(){
    return{
      currentMenus:[]
    }
  }, 
  computed: {
    ...mapGetters(['sidebarCollapsed']),
    style(){
      const width = this.sidebarCollapsed ?  '48px': '208px'
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
  watch:{
      $route(to){
        this.firstToUpper(to)
      },
      layout(){
        this.firstToUpper(this.$route)
      },
      device(){
        this.firstToUpper(this.$route)
      }
  },
  created(){
     // 刚刚开始加载菜单
     this.firstToUpper(this.$route)
  },
  methods: {
    firstToUpper(path) {
        if(this.device=="mobile" || this.layout=='side'){return this.currentMenus=this.menus};
        let pathName=path.matched[1].name
        this.menus.find((item)=>{
           if(pathName){
              return (!item.hidden && item.name==pathName) && (this.currentMenus=item.children)
           }else{
              return !item.hidden && (this.currentMenus=item.children)
           }
        })
    },
    onSelect (obj) {
      this.$emit('menuSelect', obj)
    }
  }
}
</script>
