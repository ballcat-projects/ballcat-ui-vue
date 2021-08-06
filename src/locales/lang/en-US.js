import antLocale from 'ant-design-vue/es/locale-provider/en_US'
import momentLocale from 'moment/locale/eu'

const components = {
  antLocale: antLocale,
  momentName: 'eu',
  momentLocale: momentLocale
}

export default {
  ...components,

  dashboard: {
    workplace: {
      project: 'Project Count',
      teamRank: 'Team rank',
      views: 'Views'
    }
  }
}

