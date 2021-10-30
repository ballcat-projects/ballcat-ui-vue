<template>
  <a-modal
    :title="title"
    :visible="visible"
    :mask-closable="false"
    :body-style="{paddingBottom: '8px'}"
    :confirm-loading="submitLoading"
    @ok="handleSubmit"
    @cancel="handleClose"
  >
    <a-form
      :form="form"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item
        v-if="isUpdateForm"
        style="display: none"
      >
        <a-input v-decorator="['id']" />
      </a-form-item>

      <a-form-item label="角色名">
        <a-input
          v-decorator="['name', decoratorOptions.name]"
          placeholder="角色名"
        />
      </a-form-item>

      <a-form-item label="角色标识">
        <a-input
          v-decorator="['code', decoratorOptions.code]"
          :disabled="isUpdateForm"
          placeholder="角色标识必须以ROLE_开头!"
        />
      </a-form-item>

      <a-form-item label="角色类型">
        <dict-radio-group
          v-decorator="['type', decoratorOptions.type]"
          :disabled="isUpdateForm"
          type="button"
          dict-code="role_type"
        />
      </a-form-item>

      <a-form-item label="数据权限">
        <a-select v-decorator="['scopeType', decoratorOptions.scopeType]" @change="handleScopeTypeChange">
          <a-select-option :value="0">全部</a-select-option>
          <a-select-option :value="1">个人</a-select-option>
          <a-select-option :value="2">本人及子级</a-select-option>
          <a-select-option :value="3">本级</a-select-option>
          <a-select-option :value="4">本级及子级</a-select-option>
          <a-select-option :value="5">自定义</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        v-if="scopeType === 5"
        label="数据范围"
        :validate-status="scopeResources.validateStatus"
        :help="scopeResources.errorMsg"
      >
        <sys-organization-tree-select
          v-model="scopeResources.value"
          :organization-tree="organizationTree"
          :multiple="true"
          @change="validateScopeResources"
        />
      </a-form-item>

      <a-form-item label="备注">
        <a-textarea
          v-decorator="['remarks']"
          :auto-size="{ minRows: 4, maxRows: 8 }"
          placeholder="备注信息"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { PopUpFormMixin } from '@/mixins'
import { addObj, putObj } from '@/api/system/role'
import SysOrganizationTreeSelect from '@/views/system/organization/SysOrganizationTreeSelect'

export default {
  name: 'RoleModalForm',
  components: { SysOrganizationTreeSelect },
  mixins: [PopUpFormMixin],
  props: {
    organizationTree: {
      type: [Array],
      default: () => []
    },
  },
  data () {
    return {
      reqFunctions: {
        create: addObj,
        update: putObj
      },

      labelCol: {
        sm: { span: 24 },
        md: { span: 5 }
      },
      wrapperCol: {
        sm: { span: 24 },
        md: { span: 19 }
      },

      decoratorOptions: {
        name: {
          rules: [{ required: true, message: '请输入角色名!' }]
        },
        code: {
          rules: [{ required: true, message: '请输入角色标识!' }
            , { validator: this.validateCode }
          ]
        },
        type: {
          initialValue: 1,
          rules: [{ required: true, message: '请选择角色类型!' }]
        },
        scopeType: {
          initialValue: 1,
          rules: [{ required: true, message: '请选择数据权限!' }]
        }
      },

      scopeType: 1,
      scopeResources: {
        value: [],
        validateStatus: null,
        errorMsg: null,
      }
    }
  },
  methods: {
    /**
     * 钩子函数，回显数据处理
     * 默认无操作，子组件可重写此方法，拿到回显数据，对回显数据做处理，或者从回显数据中取值
     * @param data 回显数据
     */
    echoDataProcess (data) {
      this.scopeType = data.scopeType
      this.$nextTick(() => {
        this.scopeResources.value = data.scopeResources ? data.scopeResources.split(','): []
      })
    },
    /**
     * 表单提交数据处理函数
     * 子组件可复写此方法，在这里进行偷梁换柱
     * @param data 表单待提交数据
     * @returns {*} 真正的提交数据
     */
    submitDataProcess (data) {
      data.scopeResources = this.scopeResources.value.join(',')
      return data
    },
    validateCode (rule, value, callback) {
      if (value && value.indexOf('ROLE_') !== 0) {
        callback('角色标识必须以ROLE_开头！')
      }
      callback()
    },
    handleScopeTypeChange (scopeType) {
      this.scopeType = scopeType
    },
    validateScopeResources (scopeResources) {
      if(scopeResources && scopeResources.length > 0){
        this.scopeResources.validateStatus = "success"
        this.scopeResources.errorMsg = null
      }else {
        this.scopeResources.validateStatus = "error"
        this.scopeResources.errorMsg = "请选择权限范围！"
      }
    }
  }
}
</script>


