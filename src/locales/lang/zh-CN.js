import antLocale from 'ant-design-vue/es/locale-provider/zh_CN'
import momentLocale from 'moment/locale/zh-cn'

const components = {
  antLocale: antLocale,
  momentName: 'zh-cn',
  momentLocale: momentLocale
}

export default {
  ...components,

  dashboard: {
    workplace: {
      project: '项目数',
      teamRank: '团队排名',
      views: '项目访问'
    }
  }
}
