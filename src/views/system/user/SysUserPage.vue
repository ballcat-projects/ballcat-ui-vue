<template>
  <div class="ant-pro-page-container-children-content">
    <a-row :gutter="14">
      <a-col :md="5">
        <a-card
          :body-style="{ padding: '24px 18px' }"
          :bordered="false"
          :style="{minWidth: '200px', height: organizationColHeight}"
        >
          <a-input-search style="margin-bottom: 8px" placeholder="Search" @change="searchOrganization" />
          <a-tree
            :block-node="true"
            :tree-data="organizationTree"
            :expanded-keys="organizationExpandedKeys"
            :selected-keys="organizationSelectedKeys"
            :multiple="true"
            :replace-fields="{
              title: 'name',
              key: 'id'
            }"
            @select="selectOrganization"
            @expand="expandOrganization"
          >
            <template #title="{ name }">
              <span v-if="name.indexOf(searchValue) > -1">
                {{ name.substr(0, name.indexOf(searchValue)) }}
                <span style="color: #f50">{{ searchValue }}</span>
                {{ name.substr(name.indexOf(searchValue) + searchValue.length) }}
              </span>
              <span v-else>{{ name }}</span>
            </template>
          </a-tree>
        </a-card>
      </a-col>
      <a-col ref="sysUserCol" :md="19">
        <pro-table
          ref="table"
          toolbar-title="系统用户"
          :row-key="rowKey"
          :request="tableRequest"
          :columns="columns"
          :row-selection="{}"
          table-alert-option-render="alert-option"
          :scroll="{ x: 800 }"
        >
          <template #search-form="searchFormState">
            <a-row :gutter="16">
              <a-col :md="8" :sm="24">
                <a-form-item label="用户名">
                  <a-input v-model="searchFormState.queryParam.username" placeholder="请输入" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="状态">
                  <dict-select v-model="searchFormState.queryParam.status" allow-clear dict-code="user_status" />
                </a-form-item>
              </a-col>
              <template v-if="!searchFormState.collapsed">
                <a-col :md="8" :sm="24">
                  <a-form-item label="昵称">
                    <a-input v-model="searchFormState.queryParam.nickname" placeholder="请输入" />
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-item label="邮箱">
                    <a-input v-model="searchFormState.queryParam.email" placeholder="请输入" />
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-item label="电话">
                    <a-input-number v-model="searchFormState.queryParam.phone" placeholder="请输入" style="width: 100%" />
                  </a-form-item>
                </a-col>
              </template>
              <a-col :xl="8" :md="12" :sm="24">
                <a-form-item :wrapper-col="{flex: '1 1 0'}" class="search-actions-wrapper">
                  <a-space size="middle">
                    <a-space>
                      <a-button type="primary" :loading="searchFormState.loading" @click="searchFormState.reloadTable(true)">查询</a-button>
                      <a-button @click="searchFormState.resetSearchForm">重置</a-button>
                    </a-space>
                    <a @click="searchFormState.toggleSearchCollapsed">
                      {{ searchFormState.collapsed ? '展开': '收起' }}
                      <a-icon :type="searchFormState.collapsed ? 'down': 'up'" />
                    </a>
                  </a-space>
                </a-form-item>
              </a-col>

            </a-row>
          </template>


          <!-- alert 操作区域 -->
          <template #alert-option="alertState">
            <div v-show="alertState.selectedRows.length > 0">
              <a-space size="middle">
                <a-dropdown v-has="'system:user:edit'">
                  <template #overlay>
                    <a-menu>
                      <a-menu-item key="1" @click="handleUpdateStatus(alertState.selectedRowKeys, 1)">
                        <a-icon type="delete" />
                        开启
                      </a-menu-item>
                      <a-menu-item key="0" @click="handleUpdateStatus(alertState.selectedRowKeys, 0)">
                        <a-icon type="lock" />
                        锁定
                      </a-menu-item>
                    </a-menu>
                  </template>
                  <a @click="e => e.preventDefault()">
                    批量操作&nbsp;<a-icon type="down" />
                  </a>
                </a-dropdown>
                <a @click="alertState.onCleanSelected">清空</a>
              </a-space>
            </div>
          </template>

          <!-- 操作按钮区域 -->
          <template #toolbar-action>
            <a-button
              v-has="'system:user:add'"
              type="primary"
              icon="plus"
              @click="handleAdd()"
            >新建
            </a-button>
          </template>

          <!-- 表格展示相关插槽 -->
          <template #status-slot="text">
            <dict-badge dict-code="user_status" :value="text" />
          </template>
          <template #gender-slot="text">
            <dict-text dict-code="gender" :value="text" />
          </template>
          <template #avatar-slot="text, record">
            <a-avatar
              shape="square"
              :src="fileAbsoluteUrl(record.avatar)"
              icon="user"
              size="large"
              @click="beforeUpdateAvatar(record.userId)"
            />
          </template>
          <template #action-slot="text, record">
            <a-dropdown v-if="$has('system:user:pass') || $has('system:user:del')">
              <a class="ant-dropdown-link" href="#">
                操作
              </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item v-has="'system:user:edit'">
                    <a @click="handleEdit(record)">编辑</a>
                  </a-menu-item>
                  <a-menu-item v-has="'system:user:grant'">
                    <a @click="handleGrant(record)">授权</a>
                  </a-menu-item>
                  <a-menu-item v-has="'system:user:pass'">
                    <a @click="changePass(record)">改密</a>
                  </a-menu-item>
                  <a-menu-item v-has="'system:user:del'">
                    <a-popconfirm title="确认要删除吗？" @confirm="() => handleDel(record)">
                      <a href="javascript:;">删除</a>
                    </a-popconfirm>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
        </pro-table>
      </a-col>
    </a-row>

    <!-- 用户表单弹窗 -->
    <sys-user-modal-form ref="formModal" :organization-tree="organizationTree" @reload-page-table="reloadPageTable" />

    <!--头像弹框-->
    <cropper-modal ref="avatarModal" />

    <!--用户授权-->
    <div v-if="scopeInited">
      <scope-modal ref="scopeModal" />
    </div>

    <!--修改密码-->
    <div v-if="passInited">
      <password-modal ref="passwordModal" />
    </div>
  </div>
</template>

<script>
import { getPage, delObj, updateStatus, updateAvatar } from '@/api/system/user'
import { getTree } from '@/api/system/organization'
import ScopeModal from './ScopeModal'
import PasswordModal from './PasswordModal'
import CropperModal from '@/components/CropperModal'
import { mapGetters } from 'vuex'
import SysUserModalForm from '@/views/system/user/SysUserModalForm'
import ProTable from '@/components/Table/ProTable'

export default {
  name: 'SysUserPage',
  components: {
    ProTable,
    CropperModal,
    ScopeModal,
    PasswordModal,
    SysUserModalForm
  },
  data () {
    return {
      rowKey: 'userId',
      tableRequest: (queryParam) => {
        const extraParam = {
          organizationId: this.organizationSelectedKeys.join(',')
        }
        return getPage(Object.assign({}, queryParam, extraParam))
      },

      searchValue: '',
      organizationTree: [],
      organizationExpandedKeys: [],
      organizationSelectedKeys: [],
      organizationColHeight: '100%',

      // 表头
      columns: [
        {
          title: '用户名',
          dataIndex: 'username',
          align: 'center'
        },
        {
          title: '昵称',
          dataIndex: 'nickname',
          align: 'center'
        },
        {
          title: '头像',
          dataIndex: 'avatar',
          align: 'center',
          scopedSlots: { customRender: 'avatar-slot' }
        },
        {
          title: '性别',
          dataIndex: 'sex',
          align: 'center',
          scopedSlots: { customRender: 'gender-slot' }
        },
        {
          title: '组织',
          dataIndex: 'organizationName',
          align: 'center'
        },
        {
          title: '电话',
          dataIndex: 'phone',
          align: 'center'
        },
        {
          title: '状态',
          dataIndex: 'status',
          align: 'center',
          width: '80px',
          scopedSlots: { customRender: 'status-slot' }
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          align: 'center',
          width: '150px',
          sorter: true
        },
        {
          title: '操作',
          align: 'center',
          width: '70px',
          scopedSlots: { customRender: 'action-slot' }
        }
      ],

      //授权模块初始化标识
      scopeInited: false,
      //密码模态框 初始化标识
      passInited: false,
      // 正在修改头像的用户Id
      avatarUserId: null
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created () {
    getTree().then(res => {
      this.organizationTree = res.data
      // 默认展开一级组织
      this.organizationExpandedKeys = res.data.map(x => x.id)
    })
  },
  mounted () {
    // 利用 ResizeObserver，监听 dom size 修改
    const resizeObserver = new ResizeObserver ( (mutations) => {
      this.organizationColHeight = mutations[0].contentRect.height + 'px'
    })
    resizeObserver.observe(this.$refs.sysUserCol.$el)
  },
  methods: {
    // 刷新表格
    reloadPageTable (withFirstPage = true) {
      this.$refs.table.reloadTable(withFirstPage)
    },
    // 新建用户
    handleAdd () {
      this.$refs.formModal.add({ title: '新建用户' })
    },
    // 编辑用户
    handleEdit (record) {
      this.$refs.formModal.update(record, { title: '编辑用户' })
    },
    // 删除
    handleDel (record) {
      delObj(record[this.rowKey]).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
          this.$refs.table.reloadTable(false)
        } else {
          this.$message.error(res.message)
        }
      }).catch((e) => {
        // 未被 axios拦截器处理过，则在这里继续处理
        !e.resolved && this.$message.error(e.message || 'error request')
      })
    },
    // 授权
    handleGrant (record) {
      if (!this.scopeInited) {
        this.scopeInited = true
      }
      this.$nextTick(function () {
        this.$refs.scopeModal.show(record)
      })
    },
    // 修改密码
    changePass (record) {
      if (!this.passInited) {
        this.passInited = true
      }
      this.$nextTick(function () {
        this.$refs.passwordModal.show(record)
      })
    },
    // 修改状态
    handleUpdateStatus (selectedRowKeys, status) {
      updateStatus(selectedRowKeys, status).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
          this.$refs.table.reloadTable()
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    beforeUpdateAvatar (userId) {
      const _this = this
      _this.avatarUserId = userId
      _this.$refs.avatarModal.edit(fileObj => {
        return updateAvatar(userId, fileObj).then(res => {
          _this.handleUpdateAvatar(res.data)
          return res
        })
      })
    },
    handleUpdateAvatar (avatar) {
      const userId = this.avatarUserId
      // 更新表格头像
      const newData = [...this.dataSource]
      const target = newData.filter(item => userId === item.userId)[0]
      if (target) {
        target.avatar = avatar
        this.dataSource = newData
      }
      // 更新当前登陆用户
      if (this.userInfo.userId === userId) {
        this.userInfo.avatar = avatar
      }
    },
    searchOrganization (e) {
      const value = e.target.value
      let expandedKeys = []
      if (value) {
        this.matchParentKey(0, this.organizationTree, expandedKeys)
      } else {
        expandedKeys = this.organizationTree.map(x => x.id)
      }
      Object.assign(this, {
        organizationExpandedKeys: expandedKeys,
        searchValue: value,
        autoExpandParent: true
      })
    },
    matchParentKey (pId, treeList, result) {
      if (treeList) {
        let matched = false
        treeList.forEach(node => {
          if (node.children && node.children.length > 0) {
            this.matchParentKey(node.id, node.children, result)
          }
          if (!matched && node.name.indexOf(this.searchValue) > -1) {
            matched = true
            result.push(pId)
          }
        })
      }
    },
    /**
     * 选择组织机构
     * 被选择时，立刻进行查询操作
     */
    selectOrganization (selectedKeys, e) {
      this.organizationSelectedKeys = selectedKeys
      this.$refs.table.loadData()
    },
    /**
     * 展开组织机构树
     * @param expandedKeys
     */
    expandOrganization (expandedKeys) {
      this.organizationExpandedKeys = expandedKeys
    }
  }
}
</script>
