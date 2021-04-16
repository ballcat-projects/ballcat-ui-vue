/**
 * 项目默认配置项
 * primaryColor - 默认主题色, 如果修改颜色不生效，请清理 localStorage
 * navTheme - sidebar theme ['dark', 'light'] 两种主题
 * colorWeak - 色盲模式
 * layout - 整体布局方式 ['side', 'top'] 两种布局
 * fixedHeader - 固定 Header : boolean
 * fixSiderbar - 固定左侧菜单栏 ： boolean
 * contentWidth - 内容区布局： 流式 |  固定
 *
 * storageOptions: {} - Vue-ls 插件配置项 (localStorage/sessionStorage)
 *
 */
export const appDefaultSetting = {
  primaryColor: '#1890FF', // primary color of ant design
  navTheme: 'dark', // theme for nav menu
  layout: 'side', // nav menu position: side or top or mix
  contentWidth: 'Fixed', // layout of content: Fluid or Fixed, Does not work in side modes
  fixedHeader: false, // sticky header
  fixSiderbar: true, // sticky siderbar
  colorWeak: false,
  multiTab: true
}
