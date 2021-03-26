<template>
  <div class="ant-pro-page-container-children-content">
    <a-row :gutter="10">
      <a-col :span="9">
        <a-card :bordered="false">
          <a-button-group style="margin-bottom: 16px">
            <a-button v-has="'sys:syspermission:add'" type="primary" @click="handleAdd()">添加</a-button>
            <a-button v-has="'sys:syspermission:edit'" type="primary" @click="handleUpdate()">编辑</a-button>
            <a-button v-has="'sys:syspermission:del'" type="primary" @click="handleDelete()">删除</a-button>
          </a-button-group>

          <a-tree
            :block-node="true"
            :tree-data="treeData"
            :expanded-keys="expandedKeys"
            :show-icon="true"
            @select="onSelect"
            @expand="onExpand"
          >
            <template slot="custom" slot-scope="{ icon }">
              <a-icon v-if="icon" :type="icon" />
            </template>
          </a-tree>
        </a-card>
      </a-col>

      <a-col :span="15">
        <a-card :bordered="false">
          <a-form
            :form="form"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            @submit="handleSubmit"
          >

            <a-form-item label="类型">
              <a-radio-group
                v-decorator="['type']"
                :disabled="readOnly"
                @change="onTypeChange"
              >
                <a-radio :value="0">目录</a-radio>
                <a-radio :value="1">菜单</a-radio>
                <a-radio :value="2">按钮/权限</a-radio>
              </a-radio-group>
            </a-form-item>

            <a-form-item label="父级节点">
              <a-input
                v-decorator="['parentId']"
                placeholder="父级节点"
                :disabled="true"
              />
            </a-form-item>

            <a-form-item label="节点">
              <a-input
                v-decorator="['id', decoratorOptions.id]"
                placeholder="节点"
                type="number"
                :disabled="formAction !== FORM_ACTION.CREATE"
              />
            </a-form-item>

            <a-form-item label="标题">
              <a-input
                v-decorator="['title', decoratorOptions.title]"
                placeholder="请输入标题"
                :disabled="readOnly"
              />
            </a-form-item>

            <div v-show="permissionType === 0">
              <a-form-item label="重定向">
                <a-input
                  v-decorator="['redirect', decoratorOptions.redirect]"
                  placeholder="路由重定向地址(redirect)"
                  :disabled="readOnly"
                />
              </a-form-item>
            </div>

            <div v-show="permissionType === 1">
              <a-form-item label="菜单路径">
                <a-input
                  v-decorator="['path', decoratorOptions.path]"
                  placeholder="请输入菜单路径"
                  :disabled="readOnly"
                />
              </a-form-item>
            </div>

            <div v-show="permissionType === 2">
              <a-form-item label="授权标识">
                <a-input
                  v-decorator="['code']"
                  placeholder="授权标识"
                  :disabled="readOnly"
                />
              </a-form-item>
            </div>

            <div v-show="permissionType === 0 || permissionType === 1">
              <a-form-item label="路由名称">
                <a-input
                  v-decorator="['routerName', decoratorOptions.routerName]"
                  placeholder="请输入前端路由名称"
                  :disabled="readOnly"
                />
              </a-form-item>

              <a-form-item label="前端组件">
                <a-input
                  v-decorator="['component', decoratorOptions.component]"
                  placeholder="请输入前端组件"
                  :disabled="readOnly"
                />
              </a-form-item>

              <a-form-item label="菜单图标">
                <a-input
                  v-decorator="['icon']"
                  placeholder="点击右侧按钮选择图标"
                  :disabled="readOnly"
                >
                  <template #addonAfter>
                    <a-icon type="setting" @click="selectIcons" />
                  </template>
                </a-input>
              </a-form-item>
            </div>

            <a-form-item label="排序">
              <a-input-number
                v-decorator="['sort']"
                placeholder="请输入排序号"
                :disabled="readOnly"
                style="width: 250px"
              />
            </a-form-item>

            <a-form-item
              v-show="permissionType === 0 || permissionType === 1"
              label="隐藏路由"
            >
              <a-radio-group v-decorator="['hidden']" :disabled="readOnly">
                <a-radio :value="1">是</a-radio>
                <a-radio :value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>

            <a-form-item
              v-show="formAction !== FORM_ACTION.NONE"
              :wrapper-col="{offset: 7 }"
            >
              <a-button html-type="submit" type="primary">{{
                formAction === FORM_ACTION.CREATE ? '提交' : '修改'
              }}
              </a-button>
              <a-button style="margin-left: 8px" @click="cancel">取消</a-button>
            </a-form-item>

            <icon-select-modal ref="iconSelectModal" @choose="chooseIcon" />
          </a-form>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import pick from 'lodash.pick'

import { getList, addObj, putObj, delObj } from '@/api/sys/permission'
import { listToTree } from '@/utils/treeUtil'
import IconSelectModal from './IconSelectModal'

export default {
  name: 'PermissionPage',
  components: {
    IconSelectModal
  },
  data () {
    return {
      treeData: [],
      expandedKeys: [],
      permission: {},
      // 标签和数值框布局
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 }
      },

      formAction: this.FORM_ACTION.NONE,
      decoratorOptions: {
        title: {
          rules: [{ required: true, message: '请输入菜单名!' }]
        },
        id: {
          rules: [
            { required: true, message: '必须填写6位ID' },
            { pattern: /^\d{6}$/, message: '长度只能为6位数字' }
          ]
        }
      },
      displayData: {
        createTime: '',
        updateTime: ''
      },
      form: this.$form.createForm(this),
      permissionType: 0,
      readOnly: true
    }
  },
  created () {
    this.expandedKeys = [0]
    this.pageLoad()
  },
  methods: {
    pageLoad () {
      getList().then((res) => {
        this.permission = {}
        this.formAction = this.FORM_ACTION.NONE
        this.readOnly = true
        this.treeData = listToTree(res.data, 0, (treeNode, item) => {
          treeNode.permission = item
          treeNode.scopedSlots = { icon: 'custom' }
        })
      })
    },
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
    },
    onSelect (selectedKeys, e) {
      // console.log(e)
      if (e.selected) {
        this.permission = e.selectedNodes[0].data.props.permission
        this.readOnly ? this.redisplay() : this.handleUpdate()
      } else {
        this.formAction = this.FORM_ACTION.NONE
        this.permission = {}
        this.readOnly = true
        this.form.resetFields()
      }
    },
    redisplay () {
      let record = this.permission
      this.permissionType = record.type
      setTimeout(() => {
        // 获取仅展示元素
        this.displayData = pick(record, Object.keys(this.displayData))
        // 移除所有不用的元素，否则会抛出异常
        const fromData = pick(record, Object.keys(this.form.getFieldsValue()))
        this.$nextTick(function () {
          this.form.resetFields()
          this.form.setFieldsValue(fromData)
        })
      }, 0)
    },
    handleAdd () {
      this.formAction = this.FORM_ACTION.CREATE
      this.readOnly = false
      this.form.resetFields()
      const defaultValue = {
        'parentId': this.permission.id || 0,
        type: 1,
        hidden: 0
      }
      this.form.setFieldsValue(defaultValue)
    },
    handleUpdate () {
      if (!this.permission.id) {
        this.$message.warn('请先选中一个目标')
        return
      }
      this.formAction = this.FORM_ACTION.UPDATE
      this.readOnly = false
      this.redisplay()
    },
    handleDelete () {
      if (!this.permission.id) {
        this.$message.warn('请先选中一个目标')
        return
      }
      delObj(this.permission.id).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
          this.pageLoad()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleSubmit (e) {
      const req = this.formAction === this.FORM_ACTION.CREATE ? addObj : putObj
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          req(values).then(res => {
            if (res.code === 200) {
              this.$message.success(res.message)
              this.pageLoad()
            } else {
              this.$message.error(res.message)
            }
          })
        }
      })
    },
    onTypeChange (e) {
      this.permissionType = e.target.value
    },
    selectIcons () {
      if (this.formAction !== this.FORM_ACTION.NONE) {
        this.$refs.iconSelectModal.show()
      }
    },
    chooseIcon (icon) {
      this.form.setFieldsValue({ 'icon': icon })
    },
    cancel () {
      this.formAction = this.FORM_ACTION.NONE
      this.readOnly = true
      this.form.resetFields()
    }
  }
}
</script>
