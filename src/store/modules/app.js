import Vue from 'vue'
import { SETTINGS_LS } from '@/store/storage-types'
import { APP_MUTATIONS } from '@/store/mutation-types'
import { DEVICE_TYPE } from '@/utils/device'


const SIDEBAR_TYPE = {
  NONE: 'None',
  SIDE_MENU: 'SideMenu',
  DRAWER_MENU: 'DrawerMenu',
  MIX_MENU:'MixMenu'
}

const app = {
  state: {
    // 设置相关
    navTheme: '',
    layout: 'side',
    contentWidth: 'Fluid',
    // 内容全屏
    contentFullScreen: false,
    fixedHeader: false,
    fixSiderbar: false,
    primaryColor: null,
    colorWeak: false,
    multiTab: true,
    // 设备类型
    device: DEVICE_TYPE.DESKTOP,
    // 侧边栏状态
    sidebarType: SIDEBAR_TYPE.SIDE_MENU,
    sidebarCollapsed: false,
    keepAliveList:[]
  },
  getters: {
    // 设置相关
    navTheme: state => state.navTheme,
    layout: state => state.layout,
    contentWidth: state => state.contentWidth,
    fixedHeader: state => state.fixedHeader,
    fixSiderbar: state => state.fixSiderbar,
    primaryColor: state => state.primaryColor,
    colorWeak: state => state.colorWeak,
    multiTab: state => state.multiTab,
    // 设置类型
    device: state => state.device,
    // 侧边栏状态
    isDrawerMenu: state => state.sidebarType === SIDEBAR_TYPE.DRAWER_MENU,
    isSideMenu: state => state.sidebarType === SIDEBAR_TYPE.SIDE_MENU,
    isMixMenu: state => state.sidebarType === SIDEBAR_TYPE.MIX_MENU,
    isNoneMenu: state => state.sidebarType === SIDEBAR_TYPE.NONE,
    sidebarCollapsed: state => state.sidebarCollapsed,
    contentFullScreen: state => state.contentFullScreen,
    keepAliveList:state => state.keepAliveList
  },
  mutations: {
    // 整体风格设置
    [APP_MUTATIONS.TOGGLE_NAV_THEME]: (state, navTheme) => {
      Vue.ls.set(SETTINGS_LS.NAV_THEME, navTheme)
      state.navTheme = navTheme
    },
    // 主题色设置
    [APP_MUTATIONS.TOGGLE_PRIMARY_COLOR]: (state, primaryColor) => {
      Vue.ls.set(SETTINGS_LS.PRIMARY_COLOR, primaryColor)
      state.primaryColor = primaryColor
    },
    // 导航模式
    [APP_MUTATIONS.TOGGLE_LAYOUT]: (state, layout) => {
      // 若导航类型不是顶部，则默认内容宽度使用流式
      if (layout !== 'top') {
        Vue.ls.set(SETTINGS_LS.CONTENT_WIDTH_TYPE, 'Fluid')
        state.contentWidth = 'Fluid'
      }
      // 切换导航时，若导航类型是顶部，则强制关闭侧边栏
      if(state.device === DEVICE_TYPE.DESKTOP){
        if(layout === 'top'){
           state.sidebarType=SIDEBAR_TYPE.NONE
        }else if(layout === 'side'){
           state.sidebarType=SIDEBAR_TYPE.SIDE_MENU
        }else{
           state.sidebarType=SIDEBAR_TYPE.MIX_MENU
        }
        //state.sidebarType = layout === 'top' ? SIDEBAR_TYPE.NONE: SIDEBAR_TYPE.SIDE_MENU
      }else {
        state.sidebarType = SIDEBAR_TYPE.DRAWER_MENU
      }
      // 切换导航模式
      state.layout = layout
      Vue.ls.set(SETTINGS_LS.LAYOUT, layout)
    },
    // 内容区域宽度类型
    [APP_MUTATIONS.TOGGLE_CONTENT_WIDTH]: (state, type) => {
      Vue.ls.set(SETTINGS_LS.CONTENT_WIDTH_TYPE, type)
      state.contentWidth = type
    },
    // 固定头部
    [APP_MUTATIONS.TOGGLE_FIXED_HEADER]: (state, fixed) => {
      Vue.ls.set(SETTINGS_LS.FIXED_HEADER, fixed)
      state.fixedHeader = fixed
    },
    // 固定侧边栏
    [APP_MUTATIONS.TOGGLE_FIXED_SIDERBAR]: (state, fixed) => {
      Vue.ls.set(SETTINGS_LS.FIXED_SIDE_MENU, fixed)
      state.fixSiderbar = fixed
    },
    // 色弱模式
    [APP_MUTATIONS.TOGGLE_COLOR_WEAK]: (state, flag) => {
      Vue.ls.set(SETTINGS_LS.COLOR_WEAK, flag)
      state.colorWeak = flag
    },
    // 多页签
    [APP_MUTATIONS.TOGGLE_MULTI_TAB]: (state, multiTabOpened) => {
      Vue.ls.set(SETTINGS_LS.MULTI_TAB, multiTabOpened)
      state.multiTab = multiTabOpened
    },

    // 当前设备类型
    [APP_MUTATIONS.TOGGLE_DEVICE]: (state, device) => {
      state.device = device
      // 切换导航时，若导航类型是顶部，则强制关闭侧边栏
      if(state.device === DEVICE_TYPE.DESKTOP){
        if(state.layout === 'top'){
          state.sidebarType=SIDEBAR_TYPE.NONE
       }else if(state.layout === 'side'){
          state.sidebarType=SIDEBAR_TYPE.SIDE_MENU
       }else{
          state.sidebarType=SIDEBAR_TYPE.MIX_MENU
       }
        // state.sidebarType = state.layout === 'top' ? SIDEBAR_TYPE.NONE: SIDEBAR_TYPE.SIDE_MENU
        state.sidebarCollapsed = false
      }else {
        state.sidebarType = SIDEBAR_TYPE.DRAWER_MENU
        state.sidebarCollapsed = true
      }
    },
    // 侧边菜单的折叠状态
    [APP_MUTATIONS.TOGGLE_SIDE_BAR_COLLAPSED]: (state, sidebarCollapsed) => {
      state.sidebarCollapsed = sidebarCollapsed
    },
    // 是否内容全屏
    [APP_MUTATIONS.TOGGLE_CONTENT_FULL_SCREEN]: (state) => {
      state.contentFullScreen = !state.contentFullScreen
    },
    // 多页签 keepAlive 的组件列表
    [APP_MUTATIONS.TOGGLE_SET_KEEPALIVE]:(state,keepAliveList)=>{
      state.keepAliveList=keepAliveList
    }
  },
}

export default app
