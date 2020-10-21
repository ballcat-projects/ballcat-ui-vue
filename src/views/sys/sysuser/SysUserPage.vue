<template>
  <div class="ant-pro-page-container-children-content">

    <div v-show="tableShow">
      <a-row :gutter="14">
        <a-col :md="5" :style="{height: organizationColHeight}">
          <a-card :bodyStyle="{padding: '24px 18px'}" :bordered="false" style="height: 100%">
            <a-input-search style="margin-bottom: 8px" placeholder="Search" @change="searchOrganization"/>
            <a-tree
              :blockNode="true"
              :treeData="organizationTree"
              :expandedKeys="organizationExpandedKeys"
              :selectedKeys="organizationSelectedKeys"
              @select="selectOrganization"
              @expand="expandOrganization"
              :multiple="true"
              :replaceFields="{
                title: 'name',
                key: 'id',
                value: 'id'
              }"
            >
              <template v-slot:title="{ name }">
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
        <a-col :md="19" ref="sysUserCol">
          <div class="ant-pro-table-search">
            <a-form v-bind="searchFormLayout">
              <a-row :gutter="16">
                <a-col :md="8" :sm="24">
                  <a-form-item label="用户名">
                    <a-input v-model="queryParam.username" placeholder=""/>
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-item label="状态">
                    <a-select v-model="queryParam.status" placeholder="请选择" default-value="0">
                      <a-select-option value="">全部</a-select-option>
                      <a-select-option value="0">关闭</a-select-option>
                      <a-select-option value="1">运行中</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <template v-if="advanced">
                  <a-col :md="8" :sm="24">
                    <a-form-item label="昵称">
                      <a-input v-model="queryParam.nickname" style="width: 100%"/>
                    </a-form-item>
                  </a-col>
                  <a-col :md="8" :sm="24">
                    <a-form-item label="邮箱">
                      <a-input v-model="queryParam.email" style="width: 100%"/>
                    </a-form-item>
                  </a-col>
                  <a-col :md="8" :sm="24">
                    <a-form-item label="电话">
                      <a-input-number v-model="queryParam.phone" style="width: 100%"/>
                    </a-form-item>
                  </a-col>
                </template>
                <a-col :md="8" :sm="24" class="table-page-search-wrapper">
                  <div class="table-page-search-submitButtons">
                    <a-button type="primary" @click="reloadTable">查询</a-button>
                    <a-button style="margin-left: 8px" @click="resetSearchForm">重置</a-button>
                    <a @click="toggleAdvanced" style="margin-left: 8px">
                      {{ advanced ? '收起' : '展开' }}
                      <a-icon :type="advanced ? 'up' : 'down'"/>
                    </a>
                  </div>
                </a-col>
              </a-row>
            </a-form>
          </div>
          <a-card :bordered="false" :bodyStyle="{padding: 0}">
            <!-- 操作按钮区域 -->
            <div class="ant-pro-table-toolbar">
              <div class="ant-pro-table-toolbar-title">系统用户</div>
              <div class="ant-pro-table-toolbar-option">
                <a-dropdown v-has="'sys:sysuser:edit'" v-if="selectedRowKeys.length > 0">
                  <template #overlay>
                    <a-menu @click="handleUpdateStatus">
                      <a-menu-item key="1">
                        <a-icon type="delete"/>
                        开启
                      </a-menu-item>
                      <!-- lock | unlock -->
                      <a-menu-item key="0">
                        <a-icon type="lock"/>
                        锁定
                      </a-menu-item>
                    </a-menu>
                  </template>
                  <a-button style="margin-left: 8px">
                    批量操作
                    <a-icon type="down"/>
                  </a-button>
                </a-dropdown>
                <a-button v-has="'sys:sysuser:add'" type="primary" icon="plus" @click="handleAdd()">新建</a-button>
              </div>
            </div>

            <div class="ant-pro-table-wrapper">
              <a-alert :showIcon="true" style="margin-bottom: 16px">
                <template #message>
                  <span style="margin-right: 12px">已选择: <a style="font-weight: 600">{{ selectedRows.length }}</a></span>
                  <a style="margin-left: 24px" v-show='selectedRows.length > 0' @click="onClearSelected">清空</a>
                </template>
              </a-alert>

              <!--数据表格-->
              <a-table
                ref="table"
                size="middle"
                :rowKey="rowKey"
                :columns="columns"
                :dataSource="dataSource"
                :pagination="pagination"
                :loading="loading"
                @change="handleTableChange"
                :alert="{show: true, clear: true}"
                :rowSelection="{onChange: onSelectChange, selectedRowKeys: selectedRowKeys}"
              >
                <!--数据表格-->
                <template #status-slot="text">
                  <a-badge :status="text | statusTypeFilter" :text="text | statusFilter"/>
                </template>
                <template #gender-slot="text">
                  <dict-text dict-code="gender" :value="text"></dict-text>
                </template>
                <template #avatar-slot="text, record">
                  <a-avatar shape="square" :src="fileAbsoluteUrl(record.avatar)" icon="user" size="large"
                            @click="updateAvatar(record.userId)"/>
                </template>

                <template #action-slot="text, record">
                  <a-dropdown v-if="$has('sys:sysuser:pass') || $has('sys:sysuser:del')">
                    <a class="ant-dropdown-link" href="#">
                      操作
                    </a>
                    <template #overlay>
                      <a-menu>
                        <a-menu-item v-has="'sys:sysuser:edit'">
                          <a @click="handleEdit(record)">编辑</a>
                        </a-menu-item>
                        <a-menu-item v-has="'sys:sysuser:grant'">
                          <a @click="handleGrant(record)">授权</a>
                        </a-menu-item>
                        <a-menu-item v-has="'sys:sysuser:pass'">
                          <a @click="changePass(record)">改密</a>
                        </a-menu-item>
                        <a-menu-item v-has="'sys:sysuser:del'">
                          <a-popconfirm
                            title="确认要删除吗？"
                            @confirm="() => handleDel(record)">
                            <a href="javascript:;">删除</a>
                          </a-popconfirm>
                        </a-menu-item>
                      </a-menu>
                    </template>
                  </a-dropdown>
                </template>
              </a-table>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!--表单页面-->
    <a-card v-if="formInited" v-show="!tableShow" :bordered="false" :title="cardTitle">
      <form-page ref="formPage" @backToPage="backToPage" :organizationTree="organizationTree"></form-page>
    </a-card>

    <!--头像弹框-->
    <cropper-modal ref="avatarModal"></cropper-modal>

    <!--用户授权-->
    <div v-if="scopeInited">
      <scope-modal ref="scopeModal"></scope-modal>
    </div>

    <!--修改密码-->
    <div v-if="passInited">
      <password-modal ref="passwordModal"></password-modal>
    </div>


  </div>
</template>

<script>
import { TablePageMixin } from '@/mixins'
import { getPage, delObj, updateStatus } from '@/api/sys/sysuser'
import { getTree } from '@/api/sys/organization'
import FormPage from './SysUserForm'
import ScopeModal from './ScopeModal'
import PasswordModal from './PasswordModal'
import CropperModal from '@/components/CropperModal'
import { mapGetters } from 'vuex'

const statusMap = {
  0: {
    status: 'default',
    text: '关闭'
  },
  1: {
    status: 'processing',
    text: '正常'
  }
}

export default {
  name: 'SysUserPage',
  mixins: [TablePageMixin],
  components: {
    CropperModal,
    FormPage,
    ScopeModal,
    PasswordModal
  },
  data () {
    return {
      getPage: getPage,
      delObj: delObj,
      rowKey: 'userId',

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
          dataIndex: 'action',
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
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    }
  },
  created () {
    getTree().then(res => {
      this.addTitleSlot(res.data)
      this.organizationTree = res.data
      // 默认展开一级组织
      this.organizationExpandedKeys = res.data.map(x => x.id)
    })
  },
  mounted () {
    const elt = this.$refs.sysUserCol.$el
    this.organizationColHeight = elt.clientHeight + 20 + 'px'
  },
  methods: {
    addTitleSlot (treeList) {
      if (treeList) {
        treeList.forEach(node => {
          node.scopedSlots = { title: 'title' }
          this.addTitleSlot(node.children)
        })
      }
    },
    handleGrant (record) {
      if (!this.scopeInited) {
        this.scopeInited = true
      }
      this.$nextTick(function () {
        this.$refs.scopeModal.show(record)
      })
    },
    changePass (record) {
      if (!this.passInited) {
        this.passInited = true
      }
      this.$nextTick(function () {
        this.$refs.passwordModal.show(record)
      })
    },
    handleUpdateStatus (e) {
      updateStatus(this.selectedRowKeys, e.key).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
          this.reloadTable()
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    updateAvatar (userId) {
      const _this = this
      _this.avatarUserId = userId
      _this.$refs.avatarModal.edit((fileObj) => {
        const formData = new FormData()
        formData.append('file', fileObj.data, fileObj.name)
        formData.append('userId', userId)
        return _this.$http.post('/sysuser/avatar', formData, { contentType: false, processData: false })
          .then((response) => {
            _this.handleUpdateAvatar(response.data)
            return response
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
      if(value){
        this.matchParentKey(0, this.organizationTree, expandedKeys)
      }else{
        expandedKeys = this.organizationTree.map(x => x.id)
      }
      Object.assign(this, {
        organizationExpandedKeys: expandedKeys,
        searchValue: value,
        autoExpandParent: true,
      });
    },
    matchParentKey (pId, treeList, result) {
      if (treeList) {
        let matched = false
        treeList.forEach(node => {
          if(node.children && node.children.length > 0){
            this.matchParentKey(node.id, node.children, result)
          }
          if(!matched && node.name.indexOf(this.searchValue) > -1){
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
      this.queryParam.organizationId = selectedKeys.join(",")
      this.loadData()
    },
    /**
     * 展开组织机构树
     * @param expandedKeys
     */
    expandOrganization (expandedKeys) {
      this.organizationExpandedKeys = expandedKeys
    },
    // 清空选项
    resetSearchForm () {
      this.queryParam = {
        organizationId: this.queryParam.organizationId
      }
    }
  }
}
</script>
