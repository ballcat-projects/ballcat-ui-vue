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
    <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item v-if="isUpdateForm" style="display: none">
        <a-input v-decorator="['id']" />
      </a-form-item>

      <a-form-item label="父级组织">
        <a-tree-select
          v-decorator="['parentId', decoratorOptions.parentId]"
          placeholder="父级组织"
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :tree-data="organizationTree"
          tree-default-expand-all
          allow-clear
          :replace-fields="{
            title: 'name',
            key: 'id',
            value: 'id'
          }"
        />
      </a-form-item>

      <a-form-item label="组织名称">
        <a-input v-decorator="['name', decoratorOptions.name]" placeholder="组织名称" />
      </a-form-item>

      <a-form-item label="排序">
        <a-input-number v-decorator="['sort']" style="width: 60%" placeholder="按数值由小到大升序" />
      </a-form-item>

      <a-form-item label="描述信息">
        <a-textarea
          v-decorator="['description', decoratorOptions.description]"
          placeholder="描述信息"
          rows="3"
          :max-length="512"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { PopUpFormMixin } from '@/mixins'
import { addObj, putObj } from '@/api/system/organization'

export default {
  name: 'OrganizationModalForm',
  mixins: [PopUpFormMixin],
  props: {
    organizationTree: {
      type: Array,
      default: () => {
        return []
      }
    }
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

      // 校验配置
      decoratorOptions: {
        parentId: {
          rules: [{
            required: true,
            type: 'number',
            message: '请选择父级组织'
          }]
        },
        name: {
          rules: [{ required: true, message: '请输入组织名称!' }]
        },
        description: {
          rules: [{ max: 512 }]
        }
      }
    }
  },
  methods: {}
}
</script>
