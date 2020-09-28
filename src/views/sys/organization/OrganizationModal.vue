<template>
  <a-modal
    :title="formAction === this.FORM_ACTION.UPDATE? '修改组织机构': '新增组织机构'"
    :visible="visible"
    @ok="handleSubmit"
    @cancel="handleClose"
    :confirmLoading="submitLoading"
    :maskClosable="false"
    :bodyStyle="{padding:'12px 18px'}"
    :centered="true"
  >
    <a-form @submit="handleSubmit" :form="form" :labelCol=labelCol :wrapperCol=wrapperCol>
      <a-form-item v-if="formAction === this.FORM_ACTION.UPDATE" style="display: none">
        <a-input v-decorator="['id']"/>
      </a-form-item>

      <a-form-item label="父级组织">
        <a-tree-select
          v-decorator="['parentId']"
          placeholder="父级组织"
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :tree-data="organizationTree"
          tree-default-expand-all
          allow-clear
          :replaceFields="{
            title: 'name',
            key: 'id',
            value: 'id'
          }"
        >
        </a-tree-select>
      </a-form-item>

      <a-form-item label="组织名称">
        <a-input placeholder="组织名称" v-decorator="['name']"/>
      </a-form-item>

      <a-form-item label="排序">
        <a-input-number style="width: 60%" placeholder="按数值由小到大升序" v-decorator="['sort']"/>
      </a-form-item>

      <a-form-item label="描述信息">
        <a-textarea placeholder="描述信息" v-decorator="['description']"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { FormModalMixin } from '@/mixins'
import { addObj, putObj } from '@/api/sys/organization'

export default {
  name: 'OrganizationModal',
  mixins: [FormModalMixin],
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

      // 校验配置
      decoratorOptions: {}
    }
  },
  methods: {}
}
</script>
