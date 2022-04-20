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
        <sys-organization-tree-select
          v-decorator="['parentId', decoratorOptions.parentId]"
          placeholder="父级组织"
          :organization-tree="organizationTree"
          tree-default-expand-all
          allow-clear
        />
      </a-form-item>

      <a-form-item label="组织名称">
        <a-input v-decorator="['name', decoratorOptions.name]" placeholder="组织名称" />
      </a-form-item>

      <a-form-item label="排序">
        <a-input-number v-decorator="['sort']" style="width: 60%" placeholder="按数值由小到大升序" />
      </a-form-item>

      <a-form-item label="备注信息">
        <a-textarea
          v-decorator="['remarks', decoratorOptions.remarks]"
          placeholder="备注信息"
          rows="3"
          :max-length="512"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { PopUpFormMixin } from '@/mixins'
import { listOrganization, addObj, putObj } from '@/api/system/organization'
import { doRequest } from '@/utils/request'
import { listToTree } from '@/utils/treeUtil'
import SysOrganizationTreeSelect from '@/views/system/organization/SysOrganizationTreeSelect'

export default {
  name: 'OrganizationModalForm',
  components: { SysOrganizationTreeSelect },
  mixins: [PopUpFormMixin],
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
        remarks: {
          rules: [{ max: 512 }]
        }
      },

      organizationTree: []
    }
  },
  watch: {
    visible(val) {
      const organizationTree = this.organizationTree
      // 每次打开的时候都重新 load 树
      val && doRequest(listOrganization(), {
        successMessage: false,
        onSuccess(res) {
          const tree = listToTree(res.data, 0)
          organizationTree.length = 0
          organizationTree.push({ id: 0, name: '根目录', children: tree })
        }
      })
    }
  },
  methods: {}
}
</script>
