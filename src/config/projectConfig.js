module.exports = {
  // 项目标题
  projectTitle: 'Ball Cat',
  // 项目描述
  projectDesc: 'Ball Cat 一个简单的项目启动脚手架',
  // Vue ls 配置
  storageOptions: {
    namespace: 'ballcat/', // key prefix
    name: 'ls', // name variable Vue.[ls] or this.[$ls],
    storage: 'local' // storage name session, local, memory
  },

  // 开启 websocket，开启此选项需要服务端同步支持 websocket 功能
  // 若服务端不支持，则本地启动时，抛出 socket 异常，导致 proxyServer 关闭
  enableWebsocket: true,

  // ------------- 国际化配置分隔符 -----------------

  // 是否开启国际化
  enableI18n: true,
  // 项目默认语言
  defaultLanguage: 'zh-CN',
  // 支持的语言列表
  supportLanguage: {
    'zh-CN': {
      lang: 'zh-CN',
      title: '简体中文',
      symbol: '🇨🇳'
    },
    'en-US': {
      lang: 'en-US',
      title: 'English',
      symbol: '🇺🇸'
    }
  },
  iconFontUrl: '//at.alicdn.com/t/font_2663734_n2opxzn2qcq.js',
  iconPrefix: 'ballcat-icon-'
}
