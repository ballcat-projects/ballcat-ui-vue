import { enableI18n } from '@/config/projectConfig'
import { littleCamelToUnderline } from '@/utils/strUtil'
import AntTable from 'ant-design-vue/es/table/Table'
import './searchForm.less'
import './listToolBar.less'
import './toolbar.less'
import './alert.less'
import './proTable.less'
import { doRequest } from '@/utils/request'
import TableColumnSetting from './ColumnSetting'

export default {
  name: 'ProTable',
  props: Object.assign({}, AntTable.props, {

    // =================== searchForm ===============
    searchFormClassName: {
      type: String,
      default: null
    },

    // ===============  toolbar ================
    // toolbar 展示的标题
    toolbarEnabled: {
      type: Boolean,
      default: true
    },
    // toolbar 展示的标题
    toolbarTitle: {
      type: String,
      default: ''
    },
    // toolbar 选项区的控制
    toolbarOptions: {
      type: [Object, Boolean],
      default: () => {
        return {}
      }
    },

    // ================ alert ============================
    // 自定义批量操作工具栏左侧信息区域的 scopedSlotName, false 时整个 alert 都不显示
    tableAlertRender: {
      type: [String, Boolean],
      default: null
    },
    // 自定义批量操作工具栏右侧选项区域的 scopedSlotName, false 时不显示
    tableAlertOptionRender: {
      type: [String, Boolean],
      default: null
    },
    // 总是显示 alert 信息（必须开启 rowSelection ）
    alwaysShowAlert: {
      type: Boolean,
      default: false
    },

    // ================= 包裹表格的 tableCard 属性 ==================
    cardProps: {
      type: [Object, Boolean],
      default: () => {
        return {}
      }
    },

    // ======================= table ======================
    // 分页查询请求
    request: {
      type: Function,
      required: true
    },
    // request 的响应数据转换为 dataSource 的处理函数
    responseDataProcess: {
      type: Function,
      default: (data) => {
        return data.records
      }
    },
    // 分页数据加载成功钩子函数
    onPageLoadSuccess: {
      type: Function,
      default: function (){

      }
    },
    // 表格密度
    size: {
      type: String,
      default: 'middle'
    },
    // 主键 默认id
    rowKey: {
      type: [String, Function],
      default: 'id'
    },
    // 延迟加载，created时不主动加载数据
    lazyLoad: {
      type: Boolean,
      default: false
    },
    // 默认的 column 状态
    defaultColumnState: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 默认排序字段
    defaultSortField: {
      type: [String, Boolean],
      default: null
    },
    // 默认排序字段的排序规则，升序 asc/降序 desc
    defaultSortOrder: {
      type: String,
      default: 'desc'
    },
    // 分页器设置
    pagination: {
      type: [Object, Boolean],
      default: function () {
        return {
          total: 0,
          current: 1,
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) => {
            let rangeBegin = range[0]
            let rangeEnd = range[1]
            if (enableI18n) {
              return this.$t('pagination.pageInfo', { rangeBegin: rangeBegin, rangeEnd: rangeEnd, total: total })
            } else {
              return rangeBegin + '-' + rangeEnd + ' ' + '共' + total + '条'
            }
          }
        }
      }
    }
  }),
  components: { TableColumnSetting },
  data () {
    return {
      // 查询参数
      queryParam: {},
      // 搜索表单配置
      search: {
        // 表单 label 全局配置
        labelCol: { md: { span: 6 } },
        // 表单 wrapper 全局配置
        wrapperCol: { md: { span: 18 } },
        // 查询按钮文本
        searchText: '查询',
        // 重置按钮文本
        resetText: '重置',
        // 表单的 className
        className: null,
        // 是否收起
        collapsed: true
      },
      // 默认的 Toolbar Option 配置
      defaultToolbarOptions: {
        // 全屏
        fullScreen: true,
        // 刷新
        reload: true,
        // 列设置
        setting: true,
        // 表格密度
        density: true
      },
      // 表格全屏
      tableFullScreen: false,
      // 默认排序字段
      sortField: null,
      // 升序 asc/降序 desc
      sortOrder: null,
      // 筛选参数字段
      filters: {},
      // 已选中数据集合
      selectedRows: [],
      // 已选中的数据主键集合
      selectedRowKeys: [],
      // 数据加载动画
      localLoading: this.loading,
      // 数据加载动画
      localSize: this.size,
      // 数据数组
      localDataSource: this.dataSource,
      // 列设置，根据 hideInTable 属性，过滤掉当前不可见的元素
      localColumns: this.loopColumn(this.columns, (x) => x.hideIntable),
      // 字段的排序和显示属性, key: dataIndex, value（boolean）: 是否显示在表格中
      tableColumns: this.localColumns,
      // 本地分页器
      localPagination: this.pagination instanceof Object ? Object.assign({}, this.pagination) : this.pagination
    }
  },
  computed: {
    tableSizeKeys () {
      return [this.localSize]
    },
    enablePagination () {
      return this.localPagination instanceof Object
    }
  },
  created () {
    this.initDefaultSort()
    !this.lazyLoad && this.reloadTable()
  },
  methods: {
    loopColumn (columns, excluder) {
      const result = []
      for (let column of columns) {
        if (excluder(column)) {
          continue
        }
        if (!column.children) {
          result.push(column)
        } else if (column.children.length > 0) {
          let data = this.loopColumn(column.children, excluder)
          if (data.length > 0) {
            result.push(Object.assign({}, column, { children: data }))
          }
        }
      }
      return result
    },
    /**
     * 切换表格的 size
     */
    switchTableSize ({ key }) {
      this.localSize = key
    },
    /**
     * 切换全屏状态
     */
    switchTableFullScreen () {
      this.tableFullScreen = !this.tableFullScreen
    },
    /**
     * 默认排序规则
     */
    initDefaultSort () {
      if (this.defaultSortField !== false) {
        this.sortField = this.defaultSortField ? this.defaultSortField : littleCamelToUnderline(this.rowKey)
        this.sortOrder = this.sortOrder ? this.defaultSortField : 'desc'
      } else {
        this.sortField = null
        this.sortOrder = null
      }
    },
    /**
     * 表格重新加载方法
     * 如果参数为 true, 则强制刷新到第一页
     * @param withFirstPage
     */
    reloadTable (withFirstPage = true) {
      if (withFirstPage && this.enablePagination) {
        this.localPagination.current = 1
      }
      this.loadData()
    },
    /**
     * 合并查询参数，分页参数，排序参数，过滤参数
     * @returns {{current: number, size: number} & {sortOrders: null, sortFields: null}}
     */
    pageParams: function () {
      return Object.assign({}
        , this.queryParam
        , this.enablePagination ?
          {
            current: this.localPagination.current,
            size: this.localPagination.pageSize
          } : {}
        , {
          // TODO 多列排序支持
          sortFields: this.sortField,
          sortOrders: this.sortOrder
        }
        , { ...this.filters }
      )
    },
    /**
     * 表格数据加载方法
     */
    loadData () {
      const params = this.pageParams()
      this.localLoading = true

      doRequest(this.request(params), {
        successMessage: false,
        onSuccess: (res) => {
          const data = res.data

          if (this.enablePagination) {
            // 为防止删除数据后导致页面当前页面数据长度为 0 ,自动翻页到上一页
            if (data.records.length === 0 && this.localPagination.current > 1) {
              this.localPagination.current--
              this.loadData()
              return
            } else {
              this.localPagination.total = data.total
            }
          }

          // 处理响应数据，转换为 datasource
          this.localDataSource = this.responseDataProcess(data)
          // 当分页加载成功时执行
          this.onPageLoadSuccess(data)
        },
        onFinally: () => {
          this.localLoading = false
        }
      })
    },
    /**
     * 分页、排序、筛选变化时进行数据更新
     * @param pagination
     * @param filters
     * @param sorter
     */
    handleTableChange (pagination, filters, sorter) {
      this.filters = filters
      if (sorter && sorter.field) {
        if (sorter.order) {
          this.sortField = sorter.field
          this.sortOrder = sorter.order === 'ascend' ? 'asc' : 'desc'
        } else {
          this.initDefaultSort()
        }
      }
      this.localPagination = pagination
      this.loadData()
    },
    // 选择
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    // 清空选项
    onCleanSelected () {
      this.selectedRowKeys = []
      this.selectedRows = []
    },

    // 展开/关闭 搜索条件
    toggleSearchCollapsed () {
      this.search.collapsed = !this.search.collapsed
    },
    // 清空搜索条件
    resetSearchForm () {
      this.queryParam = {}
    },
    renderSearchForm () {
      let searchForm = null
      if (this.$scopedSlots['search-form']) {
        const searchFormState = {
          loading: this.localLoading,
          reloadTable: this.reloadTable,
          queryParam: this.queryParam,
          collapsed: this.search.collapsed,
          resetSearchForm: this.resetSearchForm,
          toggleSearchCollapsed: this.toggleSearchCollapsed
        }
        searchForm = (
          <div class={['ballcat-pro-table-search', this.searchFormClassName ? this.searchFormClassName : null]}>
            <a-form labelCol={this.search.labelCol} wrapperCol={this.search.wrapperCol}>
              {this.$scopedSlots['search-form'](searchFormState)}
            </a-form>
          </div>
        )
      }
      return searchForm
    },
    renderAlert () {
      let alert = null
      if (this.tableAlertRender !== false && this.rowSelection) {
        const alertState = {
          selectedRows: this.selectedRows,
          selectedRowKeys: this.selectedRowKeys,
          onCleanSelected: this.onCleanSelected
        }

        let alertInfoRender = null
        let infoSlot = this.$scopedSlots[this.tableAlertRender]
        if (infoSlot) {
          alertInfoRender = infoSlot(alertState)
        } else {
          alertInfoRender = (
            <a-space>
              <span>{'已选择'}</span>
              <span>{this.selectedRowKeys.length}</span>
              <span>{'项'}&nbsp;&nbsp;</span>
            </a-space>
          )
        }

        let alertOptionRender = null
        if (this.tableAlertOptionRender !== false) {
          let optionSlot = this.$scopedSlots[this.tableAlertOptionRender]
          if (optionSlot) {
            alertOptionRender = optionSlot(alertState)
          } else {
            alertOptionRender = (
              <a v-show={this.selectedRowKeys.length > 0} onClick={this.onCleanSelected}>清空</a>
            )
          }
        }

        alert = (
          <div class="ballcat-pro-table-alert" v-show={this.alwaysShowAlert || this.selectedRowKeys.length > 0}>
            <a-alert>
              <template slot="message">
                <div class="ballcat-pro-table-alert-info">
                  {alertInfoRender ? <div class="ballcat-pro-table-alert-info-content">{alertInfoRender}</div> : null}
                  {alertOptionRender ?
                    <div class="ballcat-pro-table-alert-info-option">{alertOptionRender}</div> : null}
                </div>
              </template>
            </a-alert>
          </div>
        )
      }
      return alert
    },
    renderToolbarList (finalToolbarOptions) {
      let toolbarList = null
      if (this.toolbarEnabled) {
        // 表格刷新
        let reloadOption = null
        // 表格密度
        let densityOption = null
        // 表格列设置
        let settingOption = null
        // 表格全屏
        let fullScreenOption = null

        if (this.toolbarOptions !== false && this.toolbarOptions instanceof Object) {
          // 合并用户自定义配置和默认配置
          const finalToolbarOptions = Object.assign({}, this.toolbarOptions, this.defaultToolbarOptions)

          if (finalToolbarOptions.reload) {
            reloadOption = (
              <a-tooltip title="刷新">
                <a-icon
                  type="reload"
                  class="ballcat-pro-table-list-toolbar-setting-item"
                  onClick={() => this.reloadTable(false)}/>
              </a-tooltip>
            )
          }

          if (finalToolbarOptions.density) {
            densityOption = (
              <a-dropdown class="ballcat-pro-table-list-toolbar-setting-item" trigger={['click']}>
                <a-tooltip title="密度">
                  <a-icon type="column-height"/>
                </a-tooltip>
                <a-menu slot="overlay" selectedKeys={this.tableSizeKeys}
                        onClick={(e) => this.switchTableSize(e)}>
                  <a-menu-item key="default">
                    默认
                  </a-menu-item>
                  <a-menu-item key="middle">
                    中等
                  </a-menu-item>
                  <a-menu-item key="small">
                    紧凑
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            )
          }

          if (finalToolbarOptions.setting) {
            settingOption = (
              <table-column-setting
                columns={this.localColumns}
                defaultColumnState={this.defaultColumnState}
                onChange={ x => this.tableColumns = x}
                class="ballcat-pro-table-list-toolbar-setting-item"/>
            )
          }

          if (finalToolbarOptions.fullScreen) {
            fullScreenOption = (
              <a-tooltip title="全屏">
                <a-icon
                  type={this.tableFullScreen ? 'fullscreen-exit' : 'fullscreen'}
                  class="ballcat-pro-table-list-toolbar-setting-item"
                  onClick={() => this.switchTableFullScreen()}
                />
              </a-tooltip>
            )
          }
        }

        // toolbarTitle 优先使用 slot
        let toolbarTitleDom = this.$slots['toolbar-title']
        if (toolbarTitleDom == null) {
          toolbarTitleDom = this.toolbarTitle
        }

        toolbarList = (
          <div class="ballcat-pro-table-list-toolbar">
            <div class="ballcat-pro-table-list-toolbar-container">
              <div class="ballcat-pro-table-list-toolbar-left">
                <div class="ballcat-pro-table-toolbar-title">{toolbarTitleDom}</div>
              </div>
              <div class="ballcat-pro-table-list-toolbar-right">
                <a-space size="middle">
                  {this.$slots['toolbar-action'] ? this.$slots['toolbar-action'] : null}
                  <a-space size={12}>
                    {reloadOption}
                    {densityOption}
                    {settingOption}
                    {fullScreenOption}
                  </a-space>
                </a-space>
              </div>
            </div>
          </div>
        )
      }
      return toolbarList
    }
  },
  render () {
    const props = {}
    const localKeys = Object.keys(this.$data)

    Object.keys(AntTable.props).forEach(k => {
      const localKey = `local${k.substring(0, 1).toUpperCase()}${k.substring(1)}`
      if (localKeys.includes(localKey)) {
        props[k] = this[localKey]
        return props[k]
      }
      this[k] && (props[k] = this[k])
      return props[k]
    })

    // 搜索表单
    let searchForm = this.renderSearchForm()

    // 提醒
    let alert = this.renderAlert()
    if (alert !== null) {
      // 如果需要使用alert，则重新绑定 rowSelection 事件
      props.rowSelection = {
        ...this.rowSelection,
        selectedRows: this.selectedRows,
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          this.onSelectChange(selectedRowKeys, selectedRows)
          typeof this.rowSelection.onChange !== 'undefined' && this.rowSelection.onChange(selectedRowKeys, selectedRows)
        }
      }
    }

    // 过滤掉不展示的列（列控制显隐）
    props.columns =  this.tableColumns

    // 工具栏
    const toolbarListDom = this.renderToolbarList()

    // 表格区域
    const tableDom = (
      <div class={[this.tableFullScreen ? 'table-fullscreen' : '']}>
        {toolbarListDom}
        {alert}
        <a-table {...{ props, scopedSlots: { ...this.$scopedSlots } }} onChange={this.handleTableChange}
                 onExpand={(expanded, record) => {
                   this.$emit('expand', expanded, record)
                 }}>
          {Object.keys(this.$slots).map(name => (<template slot={name}>{this.$slots[name]}</template>))}
        </a-table>
      </div>
    )

    // cardProps 或者 有了 title 就不需要这个padding了，不然会导致不好对齐
    const cardProps = this.cardProps
    return (
      <div>
        {searchForm ? searchForm : null}
        {
          cardProps === false ?
            (tableDom) :
            (
              <a-card
                bordered={false}
                body-style={toolbarListDom ? { paddingTop: 0 } : { padding: 0 }}
                {...{ props: { ...cardProps } }}
              >
                {tableDom}
              </a-card>
            )
        }
      </div>
    )
  }
}
