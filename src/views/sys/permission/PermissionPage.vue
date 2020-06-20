<template>
  <a-row :gutter="10">
    <a-col :span="9">
      <a-card :bordered="false">
        <a-button-group style="margin-bottom: 16px">
          <a-button v-has="'sys:syspermission:add'" type="primary" @click="handleAdd()">添加</a-button>
          <a-button v-has="'sys:syspermission:edit'" type="primary" @click="handleUpdate()">编辑</a-button>
          <a-button v-has="'sys:syspermission:del'" type="primary" @click="handleDelete()">删除</a-button>
        </a-button-group>

        <a-tree
          :blockNode="true"
          :treeData="treeData"
          :expandedKeys="expandedKeys"
          :showIcon="true"
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
        <a-form :form="form" @submit="handleSubmit">

          <a-form-item label="类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-radio-group v-decorator="['type']"
                           @change="onTypeChange"
                           :disabled="readOnly">
              <a-radio :value=0>目录</a-radio>
              <a-radio :value=1>菜单</a-radio>
              <a-radio :value=2>按钮/权限</a-radio>
            </a-radio-group>
          </a-form-item>


          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="父级节点">
            <a-input placeholder="父级节点" v-decorator="['parentId']"
                     :disabled="true"/>
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="节点">
            <a-input placeholder="节点"
                     v-decorator="['id', decoratorOptions.id]"
                     type="number"
                     :disabled="formAction !== this.FORM_ACTION.ADD"/>
          </a-form-item>


          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="标题">
            <a-input placeholder="请输入标题"
                     v-decorator="['title', decoratorOptions.title]"
                     :disabled="readOnly"/>
          </a-form-item>


          <div v-show="permissionType === 0">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="重定向">
              <a-input placeholder="路由重定向地址(redirect)"
                       :disabled="readOnly"
                       v-decorator="['redirect', decoratorOptions.redirect]"/>
            </a-form-item>
          </div>


          <div v-show="permissionType === 1">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="菜单路径">
              <a-input placeholder="请输入菜单路径"
                       :disabled="readOnly"
                       v-decorator="['path', decoratorOptions.path]"/>
            </a-form-item>
          </div>


          <div v-show="permissionType === 2">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="授权标识">
              <a-input placeholder="授权标识"
                       :disabled="readOnly"
                       v-decorator="['code']"/>
            </a-form-item>
          </div>


          <div v-show="permissionType === 0 || permissionType === 1">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="路由名称">
              <a-input placeholder="请输入前端路由名称"
                       v-decorator="['routerName', decoratorOptions.routerName]"
                       :disabled="readOnly"/>
            </a-form-item>

            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="前端组件">
              <a-input placeholder="请输入前端组件" v-decorator="['component', decoratorOptions.component]"
                       :disabled="readOnly"/>
            </a-form-item>

            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="菜单图标">
              <a-input placeholder="点击右侧按钮选择图标" v-decorator="['icon']"
                       :disabled="readOnly">
                <a-icon slot="addonAfter" type="setting" @click="selectIcons"/>
              </a-input>
            </a-form-item>


          </div>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="排序">
            <a-input-number placeholder="请输入排序号"
                            :disabled="readOnly"
                            style="width: 250px" v-decorator="['sort']"/>
          </a-form-item>


          <a-form-item
            v-show="permissionType === 0 || permissionType === 1"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="隐藏路由">
            <a-radio-group v-decorator="['hidden']" :disabled="readOnly">
              <a-radio :value=1>是</a-radio>
              <a-radio :value=0>否</a-radio>
            </a-radio-group>
          </a-form-item>

          <a-form-item v-show="formAction !== FORM_ACTION.NONE"
                       :wrapperCol="{offset: 4 }"
          >
            <a-button htmlType="submit" type="primary">{{this.formAction === this.FORM_ACTION.ADD ? '提交': '修改' }}
            </a-button>
            <a-button style="margin-left: 8px" @click="cancel">取消</a-button>
          </a-form-item>

          <icon-select-modal ref="iconSelectModal" @choose="chooseIcon"></icon-select-modal>
        </a-form>
      </a-card>
    </a-col>
  </a-row>
</template>

<script>
import pick from 'lodash.pick'
import AFormItem from 'ant-design-vue/es/form/FormItem'
import { getList, addObj, putObj, delObj } from '@/api/sys/permission'
import { listToTree } from '@/utils/treeUtil'
import IconSelectModal from './IconSelectModal'

export default {
  name: 'PermissionPage',
  components: {
    AFormItem, IconSelectModal
  },
  data () {
    return {
      treeData: [],
      expandedKeys: [],
      permission: {},

      formAction: this.FORM_ACTION.NONE,
      labelCol: { lg: { span: 4 }, sm: { span: 4 } },
      wrapperCol: { lg: { span: 12 }, sm: { span: 22 } },
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
          treeNode.scopedSlots = { icon: "custom" }
        })
        this.expandedKeys = [0]
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
      this.formAction = this.FORM_ACTION.ADD
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
          this.$message.success(res.msg)
          this.pageLoad()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleSubmit (e) {
      const req = this.formAction === this.FORM_ACTION.ADD ? addObj : putObj
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          req(values).then(res => {
            if (res.code === 200) {
              this.$message.success(res.msg)
              this.pageLoad()
            } else {
              this.$message.error(res.msg)
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
