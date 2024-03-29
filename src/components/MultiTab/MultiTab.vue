<script>
import { APP_MUTATIONS } from '@/store/mutation-types'
import { mapGetters, mapMutations } from 'vuex'
import { enableI18n } from '@/config/projectConfig'
import { expend, compress } from '@/core/icons'

function covertToPage(currentRoute) {
  return {
    path: currentRoute.path,
    name: currentRoute.name,
    params: currentRoute.params,
    query: currentRoute.query,
    title: currentRoute.meta.title,
    componentName: currentRoute.meta.componentName,
    isExceptionPage: Boolean(currentRoute.meta.exceptionStatus)
  }
}

export default {
  name: 'MultiTab',
  components: { expend, compress },
  data() {
    return {
      pathList: [],
      pages: [],
      activeKey: '',
      newTabIndex: 0
    }
  },
  computed: {
    ...mapGetters(['lang', 'userRouters', 'contentFullScreen'])
  },
  watch: {
    $route: function(currentRoute) {
      const newPage = covertToPage(currentRoute)
      // 删除异常页面
      let exceptionPageIndex = this.pages.findIndex(item => item.isExceptionPage)
      if (exceptionPageIndex !== -1) {
        this.pages.splice(exceptionPageIndex, 1)
      }

      const index = this.pages.findIndex(page => page.path === newPage.path)
      if (index < 0) {
        this.pathList.push(newPage.path)
        this.pages.push(newPage)
      } else {
        const oldPage = this.pages[index]
        if (newPage.params) {
          if (oldPage.params !== newPage.params) {
            this.pages.splice(index, 1, newPage)
          }
        }
      }
      this.activeKey = newPage.path
      this.componentNameList()
    },
    activeKey: function(newPathKey) {
      // this.$router.push({ path: newPathKey })
      if (newPathKey === '/') {
        this.$router.push({ name: '/' })
      }
      let index = this.pages.findIndex(page => page.path === newPathKey)
      if (index >= 0) {
        const page = this.pages[index]
        this.$router.push({ name: page.name, params: page.params, query: page.query })
      }
    }
  },
  created() {
    // 开启国际化的清空下才需要监听事件变化
    if (enableI18n) {
      this.$bus.$on('switch-language', this.switchTitle)
    }
    const page = covertToPage(this.$route)
    this.pages.push(page)
    this.pathList.push(page.path)
    this.componentNameList()
    this.selectedLastPath()
  },
  destroyed() {
    // 销毁监听事件
    this.$bus.$off('switch-language', this.switchTitle)
  },
  methods: {
    ...mapMutations([APP_MUTATIONS.TOGGLE_CONTENT_FULL_SCREEN]),
    switchTitle() {
      const routes = this.$router.getRoutes()
      this.pages = this.pages.map(page => {
        const meta = routes.find(r => r.path === page.path).meta
        page.title = meta.title
        return page
      })
    },
    onEdit(targetKey, action) {
      this[action](targetKey)
    },
    remove(targetKey) {
      this.pages = this.pages.filter(page => page.path !== targetKey)
      this.pathList = this.pathList.filter(path => path !== targetKey)
      this.componentNameList()
      // 判断当前标签是否关闭，若关闭则跳转到最后一个还存在的标签页
      if (!this.pathList.includes(this.activeKey)) {
        this.selectedLastPath()
      }
    },
    selectedLastPath() {
      this.activeKey = this.pathList[this.pathList.length - 1]
    },

    // content menu
    closeThat(key) {
      // 判断是否为最后一个标签页，如果是最后一个，则无法被关闭
      if (this.pathList.length > 1) {
        this.remove(key)
      } else {
        this.$message.info('这是最后一个标签了, 无法被关闭')
      }
    },
    closeLeft(key) {
      const currentIndex = this.pathList.indexOf(key)
      if (currentIndex > 0) {
        this.pathList.forEach((item, index) => {
          if (index < currentIndex) {
            this.remove(item)
          }
        })
      } else {
        this.$message.info('左侧没有标签')
      }
    },
    closeRight(key) {
      const currentIndex = this.pathList.indexOf(key)
      if (currentIndex < this.pathList.length - 1) {
        this.pathList.forEach((item, index) => {
          if (index > currentIndex) {
            this.remove(item)
          }
        })
      } else {
        this.$message.info('右侧没有标签')
      }
    },
    closeOther(key) {
      const currentIndex = this.pathList.indexOf(key)
      this.pathList.forEach((item, index) => {
        if (index !== currentIndex) {
          this.remove(item)
        }
      })
    },
    closeAll(key) {
      this.pathList.forEach((item, index) => {
        this.remove(item)
      })
    },
    closeMenuClick(key) {
      this[key](this.activeKey)
    },
    componentNameList() {
      let componentList = []
      this.pages.forEach(page => {
        componentList.push(page.componentName)
      })
      this.$store.commit(APP_MUTATIONS.TOGGLE_SET_KEEPALIVE, [...componentList])
    },
    refreshContent() {
      this.$bus.$emit('refresh-content')
    },
    switchContentFullScreen(){
      this[APP_MUTATIONS.TOGGLE_CONTENT_FULL_SCREEN]()
    }
  },
  render() {
    const {
      onEdit,
      $data: { pages }
    } = this
    const panes = pages.map(page => {
      return (
        <a-tab-pane style={{ height: 0 }} tab={page.title} key={page.path} closable={pages.length > 1}></a-tab-pane>
      )
    })

    return (
      <div class="ballcat-multi-tab">
        <a-tabs
          hideAdd
          type={'editable-card'}
          v-model={this.activeKey}
          tabBarStyle={{ margin: 0 }}
          {...{ on: { edit: onEdit } }}
        >
          {panes}
          <div slot="tabBarExtraContent" >
            <span class="multi-tab-tool" {...{ on: { click: () => this.refreshContent() } }}>
                <a-icon type="reload" style={{ fontSize: '12px' }}/>
            </span>
            <a-dropdown class="multi-tab-tool">
              <span>
                <a-icon type="down"/>
              </span>
              <a-menu
                slot="overlay"
                {...{
                  on: {
                    click: ({ key }) => {
                      this.closeMenuClick(key)
                    }
                  }
                }}
              >
                <a-menu-item key="closeLeft">
                  <a-icon type="arrow-left" />
                  关闭左侧
                </a-menu-item>
                <a-menu-item key="closeRight">
                  <a-icon type="arrow-right" />
                  关闭右侧
                </a-menu-item>
                <a-menu-item key="closeOther">
                  <a-icon type="close"/>
                  关闭其他
                </a-menu-item>
              </a-menu>
            </a-dropdown>
            <span class="multi-tab-tool" {...{ on: { click: () => this.switchContentFullScreen() } }}>
                <a-icon component={this.contentFullScreen ? compress: expend}/>
            </span>
          </div>
        </a-tabs>
      </div>
    )
  }
}
</script>
<!-- <a-menu-item key="closeAll"><a-icon type="close-circle"/>关闭全部</a-menu-item> -->
