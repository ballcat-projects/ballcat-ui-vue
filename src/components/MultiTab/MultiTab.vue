<script>
import events from './events'
import { APP_MUTATIONS } from '@/store/mutation-types'
export default {
  name: 'MultiTab',
  data () {
    return {
      fullPathList: [],
      pages: [],
      activeKey: '',
      newTabIndex: 0
    }
  },
  watch: {
    '$route': function (newVal) {
      const index = this.pages.findIndex(n=>n.fullPath === newVal.fullPath)
      if(index < 0){
        this.fullPathList.push(newVal.fullPath)
        this.pages.push(newVal)
      }else{
        const data = this.pages[index]
        if(newVal.params){
          if(data.params !== newVal.params){
            this.pages.splice(index,1,newVal)
          }
        }
      }
      this.activeKey = newVal.fullPath
      this.componentNameList()
      // this.activeKey = newVal.fullPath
      // this.componentNameList()
      // if (this.fullPathList.indexOf(newVal.fullPath) < 0) {
      //   this.fullPathList.push(newVal.fullPath)
      //   this.pages.push(newVal)
      // }
    },
    activeKey: function (newPathKey) {
      // this.$router.push({ path: newPathKey })
      if(newPathKey === '/'){
        this.$router.push({ name: '/'})
      }
      let index = this.pages.findIndex(n=>n.path === newPathKey)
      if(index >= 0){
        const data = this.pages[index]
        this.$router.push({ name: data.name, params: data.params })
      }
    }
  },
  created () {
    // bind event
    events.$on('open', val => {
      if (!val) {
        throw new Error(`multi-tab: open tab ${val} err`)
      }
      this.activeKey = val
    }).$on('close', val => {
      if (!val) {
        this.closeThat(this.activeKey)
        return
      }
      this.closeThat(val)
    })

    this.pages.push(this.$route)
    this.fullPathList.push(this.$route.fullPath)
    this.componentNameList()
    this.selectedLastPath()
  },
  methods: {
    onEdit (targetKey, action) {
      this[action](targetKey)
    },
    remove (targetKey) {
      this.pages = this.pages.filter(page => page.fullPath !== targetKey)
      this.fullPathList = this.fullPathList.filter(path => path !== targetKey)
      this.componentNameList()
      // 判断当前标签是否关闭，若关闭则跳转到最后一个还存在的标签页
      if (!this.fullPathList.includes(this.activeKey)) {
        this.selectedLastPath()
      }
    },
    selectedLastPath () {
      this.activeKey = this.fullPathList[this.fullPathList.length - 1]
    },

    // content menu
    closeThat (key) {
      // 判断是否为最后一个标签页，如果是最后一个，则无法被关闭
      if (this.fullPathList.length > 1) {
        this.remove(key)
      } else {
        this.$message.info('这是最后一个标签了, 无法被关闭')
      }
    },
    closeLeft (key) {
      const currentIndex = this.fullPathList.indexOf(key)
      if (currentIndex > 0) {
        this.fullPathList.forEach((item, index) => {
          if (index < currentIndex) {
            this.remove(item)
          }
        })
      } else {
        this.$message.info('左侧没有标签')
      }
    },
    closeRight (key) {
      const currentIndex = this.fullPathList.indexOf(key)
      if (currentIndex < (this.fullPathList.length - 1)) {
        this.fullPathList.forEach((item, index) => {
          if (index > currentIndex) {
            this.remove(item)
          }
        })
      } else {
        this.$message.info('右侧没有标签')
      }
    },
    closeOther (key) {
      const currentIndex = this.fullPathList.indexOf(key)
      this.fullPathList.forEach((item, index) => {
        if (index !== currentIndex) {
          this.remove(item)
        }
      })
    },
    closeAll (key) {
      this.fullPathList.forEach((item, index) => {
          this.remove(item)
      })
    },
    closeMenuClick (key) {
      this[key](this.activeKey)
    },
    componentNameList(){
       let componentList=[]
       this.pages.forEach(item=>{
          componentList.push(item.meta.componentName)
       });
       this.$store.commit(APP_MUTATIONS.TOGGLE_SET_KEEPALIVE,[...componentList]);
    }
  },
  render () {
    const { onEdit, $data: { pages } } = this
    const panes = pages.map(page => {
      return (
        <a-tab-pane
          style={{ height: 0 }}
          tab={page.meta.title}
          key={page.fullPath} closable={pages.length > 1}
        >
        </a-tab-pane>)
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
          <a-dropdown slot="tabBarExtraContent" class="multi-tab-drop">
            <div>
              <a-icon type="down"/>
            </div>
            <a-menu slot="overlay" {...{
              on: {
                click: ({ key }) => {
                  this.closeMenuClick(key)
                }
              }
            }}>
              <a-menu-item key="closeLeft">
                <a-icon type="arrow-left"/>
                关闭左侧
              </a-menu-item>
              <a-menu-item key="closeRight">
                <a-icon type="arrow-right"/>
                关闭右侧
              </a-menu-item>
              <a-menu-item key="closeOther">
                <a-icon type="close"/>
                关闭其他
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </a-tabs>
      </div>
    )
  }
}
</script>
<!-- <a-menu-item key="closeAll"><a-icon type="close-circle"/>关闭全部</a-menu-item> -->
