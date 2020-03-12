<template>
  <div>
    <a-card v-show="tableShow" :bordered="false">
      <!-- 查询条件 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
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
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons"
                    :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="reloadTable">查询</a-button>
                <a-button style="margin-left: 8px" @click="resetSearchForm">重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <!-- 操作按钮区域 -->
      <div class="table-operator">
        <a-button v-has="'sys:sysuser:add'" type="primary" icon="plus" @click="handleAdd()">新建</a-button>
        <a-dropdown v-has="'sys:sysuser:edit'" v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay" @click="handleUpdateStatus">
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
          <a-button style="margin-left: 8px">
            批量操作
            <a-icon type="down"/>
          </a-button>
        </a-dropdown>
      </div>


      <div class="table-wrapper">
        <a-alert :showIcon="true" style="margin-bottom: 16px">
          <template slot="message">
            <span style="margin-right: 12px">已选择: <a style="font-weight: 600">{{selectedRows.length}}</a></span>
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
          <span slot="status-slot" slot-scope="text">
            <a-badge :status="text | statusTypeFilter" :text="text | statusFilter"/>
          </span>
          <span slot="avatar-slot" slot-scope="text, record">
            <a-avatar shape="square" :src="fileAbsoluteUrl(record.avatar)" icon="user" size="large"
                      @click="updateAvatar(record.userId)"/>
          </span>

          <span slot="action-slot" slot-scope="text, record">
            <template>
              <a v-has="'sys:sysuser:edit'" @click="handleEdit(record)">编辑</a>
              <a-divider type="vertical"/>
              <a v-has="'sys:sysuser:grant'" @click="handleGrant(record)">授权</a>
              <a-divider type="vertical"/>
              <a-dropdown v-if="$has('sys:sysuser:pass') || $has('sys:sysuser:del')">
                <a class="ant-dropdown-link" href="#">
                  操作
                </a>
                <a-menu slot="overlay">
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
              </a-dropdown>
            </template>
          </span>
        </a-table>
      </div>
    </a-card>

    <!--表单页面-->
    <a-card v-if="formInited" v-show="!tableShow" :bordered="false" :title="cardTitle">
      <form-page ref="formPage" @backToPage="backToPage"></form-page>
    </a-card>


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
import { PageMixin } from '@/mixins'
import { getPage, delObj, updateStatus } from '@/api/sys/sysuser'
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
  mixins: [PageMixin],
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
          align: 'center'
        },
        {
          title: '邮箱',
          dataIndex: 'email',
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
          scopedSlots: { customRender: 'status-slot' }
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          align: 'center',
          width: '180px',
          sorter: true
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          width: '165px',
          scopedSlots: { customRender: 'action-slot' }
        }
      ],

      //授权模块初始化标识
      scopeInited: false,
      //密码模态框 初始化标识
      passInited: false,
      // 正在修改头像的用户Id
      avatarUserId: null,
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
  },
  methods: {
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
          this.$message.success(res.msg)
          this.reloadTable()
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    updateAvatar (userId){
      const _this = this
      _this.avatarUserId = userId
      _this.$refs.avatarModal.edit( (fileObj) => {
        const formData = new FormData()
        formData.append('file', fileObj.data, fileObj.name)
        formData.append('userId', userId)
        return _this.$http.post('/sysuser/avatar', formData, { contentType: false, processData: false})
          .then((response) => {
            _this.handleUpdateAvatar(response.data);
            return response
          });
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
    }
  }
}
</script>
