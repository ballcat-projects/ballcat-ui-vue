<template>
  <div class="ant-pro-page-container-children-content">
    <!-- 查询条件 -->
    <div class="ant-pro-table-search">
      <a-form v-bind="searchFormLayout">
        <a-row :gutter="16">
          <a-col :xl="6" :md="12" :sm="24">
            <a-form-item label="菜单ID">
              <a-input v-model="queryParam.id" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :xl="6" :md="12" :sm="24">
            <a-form-item label="菜单名称">
              <a-input v-model="queryParam.title" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :xl="6" :md="12" :sm="24">
            <a-form-item label="路由地址">
              <a-input v-model="queryParam.path" placeholder="请输入" />
            </a-form-item>
          </a-col>

          <!-- <template v-if="advanced">
           </template>-->
          <a-col
            :xl="6"
            :md="12"
            :sm="24"
            class="table-page-search-wrapper"
          >
            <div class="table-page-search-submitButtons">
              <a-button type="primary" @click="reloadTable">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetSearchForm">重置</a-button>
              <!--<a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'"/>
              </a>-->
            </div>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <a-card :bordered="false" :body-style="{paddingTop: '0'}">
      <!-- 操作按钮区域 -->
      <div class="ant-pro-table-toolbar">
        <div class="ant-pro-table-toolbar-title">菜单权限</div>
        <div class="ant-pro-table-toolbar-option">
          <a-button
            v-has="'sys:sysmenu:add'"
            type="primary"
            icon="plus"
            @click="handleAdd()"
          >新建
          </a-button>
        </div>
      </div>

      <!--数据表格区域-->
      <div class="ant-pro-table-wrapper">
        <a-table
          ref="table"
          size="middle"
          class="menu-tree-table"
          :row-key="rowKey"
          :columns="columns"
          :data-source="dataSource"
          :loading="loading"
          :expand-icon-column-index="1"
          :pagination="false"
          @change="handleTableChange"
        >
          <template #menu-title-slot="text, record">
            <a-icon v-if="record.icon" :type="record.icon" style="margin-right: 6px" />
            {{ record.title }}
          </template>
          <template #hidden-slot="text">
            <dict-text dict-code="tf" :value="text? 0: 1" />
          </template>
          <template #action-slot="text, record">
            <a v-has="'sys:sysmenu:add'" @click="handleAdd(record)">添加</a>
            <a-divider type="vertical" />
            <a v-has="'sys:sysmenu:edit'" @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm
              v-has="'sys:sysmenu:del'"
              title="确认要删除吗？"
              @confirm="() => handleDel(record)"
            >
              <a href="javascript:" class="ballcat-text-danger">删除</a>
            </a-popconfirm>
          </template>
        </a-table>
      </div>
    </a-card>

    <!--表单弹窗-->
    <sys-menu-modal-form ref="formModal" :non-button-menu-tree="nonButtonMenuTree" @reload-page-table="reloadTable" />
  </div>
</template>

<script>
import { list, delObj } from '@/api/sys/sysmenu'
import { TablePageMixin } from '@/mixins'
import SysMenuModalForm from '@/views/sys/sysmenu/SysMenuModalForm'
import { listToTree } from '@/utils/treeUtil'

const TREE_ROOT = [{ id: 0, title: '根目录', children: [] }]

export default {
  name: 'SysMenuPage',
  components: { SysMenuModalForm },
  mixins: [TablePageMixin],
  data () {
    return {
      delObj: delObj,

      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          width: 80
        },
        {
          title: '菜单名称',
          dataIndex: 'title',
          width: 200,
          scopedSlots: { customRender: 'menu-title-slot' }
        },
        {
          title: '权限标识',
          dataIndex: 'permission',
          width: 150,
          ellipsis: true
        },
        {
          title: '路由地址',
          dataIndex: 'path',
          width: 120,
          ellipsis: true
        },
        {
          title: '资源路径',
          dataIndex: 'uri',
          width: 180,
          ellipsis: true
        },
        {
          title: '排序',
          dataIndex: 'sort',
          width: 50
        },
        {
          title: '可见',
          dataIndex: 'hidden',
          width: 50,
          scopedSlots: { customRender: 'hidden-slot' }
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: 150
        },
        {
          title: '操作',
          align: 'center',
          width: 130,
          scopedSlots: { customRender: 'action-slot' }
        }
      ],

      // 懒加载，取消mixin中的自动加载，第一次加载交由组件自己处理
      lazyLoad: true,
      // 菜单树
      nonButtonMenuTree: TREE_ROOT
    }
  },
  created () {
    list().then(res => {
      const data = res.data
      this.dataSource = listToTree(data, 0)
      TREE_ROOT[0].children = listToTree(data.filter(x => x.type !== 2), 0)
    })
  },
  methods: {
    reloadTable () {
      list(this.queryParam).then(res => {
        this.dataSource = listToTree(res.data, 0)
      })
    },
    /**
     * 新建菜单权限
     */
    handleAdd (record) {
      const attributes = { title: '新建菜单权限' }
      // 按钮类型不允许有子级，所以默认变成创建平级
      if( record ){
        attributes.formData = {
          parentId: record.type === 2 ? record.parentId: record.id,
          type: record.type === 2 ? 2 : record.type + 1
        }
      }
      this.$refs.formModal.add(attributes)
    },
    /**
     * 编辑菜单权限
     * @param record 当前菜单权限属性
     */
    handleEdit (record) {
      const attributes = { title: '编辑菜单权限' }
      this.$refs.formModal.update(record, attributes)
    }
  }
}
</script>
<style scoped>
.menu-tree-table >>> td {
  white-space: nowrap !important;
}

.ant-tag.single-tag {
  margin-right: 0
}
</style>
