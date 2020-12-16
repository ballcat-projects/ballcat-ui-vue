<template>
  <a-form @submit="handleSubmit" :form="form" :labelCol=labelCol :wrapperCol=wrapperCol>
    <a-form-item v-if="formAction === this.FORM_ACTION.UPDATE" style="display: none">
      <a-input v-decorator="['id']"/>
    </a-form-item>

    <a-form-item label="标题"
                 required>
      <a-input placeholder="标题" v-decorator="['title']"/>
    </a-form-item>

    <a-form-item label="内容" required>
      <wang-editor v-decorator="['content', {initialValue: ''}]"></wang-editor>
    </a-form-item>

    <a-form-item label="选择接收人" required>
      <dict-select
        v-decorator="['recipientFilterType']"
        dict-code="recipient_filter_type"
        @change="recipientFilterTypeChange">
      </dict-select>
    </a-form-item>

    <a-form-item
      v-if="recipientFilterType && recipientFilterType !== 1"
      label="筛选方式的条件"
      required>
      <a-select
        v-if="recipientFilterType === 2"
        v-decorator="['recipientFilterCondition']"
        mode="multiple"
        style="width: 100%"
        placeholder="请选择角色"
        :allow-clear="true">
        <a-select-option v-for="selectData in roleSelectData"
                         :key="selectData.value">
          {{ selectData.name }}
        </a-select-option>
      </a-select>
      <a-tree-select
        v-if="recipientFilterType === 3"
        v-decorator="['recipientFilterCondition', {initialValue: []}]"
        placeholder="请选择组织"
        style="width: 100%"
        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
        :tree-data="organizationTree"
        tree-default-expand-all
        allow-clear
        multiple
        :replace-fields="{
          title: 'name',
          key: 'id',
          value: 'id'
        }"
      >
      </a-tree-select>
      <dict-select
        v-if="recipientFilterType === 4"
        v-decorator="['recipientFilterCondition', {initialValue: []}]"
        dict-code="user_type"
        mode="multiple"
        placeholder="请选择用户类型"/>
      <lov
        v-if="recipientFilterType === 5"
        v-decorator="['recipientFilterCondition', {initialValue: []}]"
        keyword="lov_user"
        :showHandlerBySelectRow="lovUserShowHandler"
      ></lov>
    </a-form-item>

    <a-form-item label="接收方式" required>
      <dict-check-box-group
        dict-code="notify_channel"
        v-decorator="['receiveMode']">
      </dict-check-box-group>
    </a-form-item>

    <a-form-item :wrapperCol="{offset: 7 }">
      <a-button htmlType="submit" type="primary" :loading="submitLoading">提交</a-button>
      <a-button style="margin-left: 8px" @click="preview">预览</a-button>
      <a-button style="margin-left: 8px" @click="backToPage(false)">取消</a-button>
    </a-form-item>

    <AnnouncementModal ref="announcementModal"/>
  </a-form>
</template>

<script>
import { FormPageMixin } from '@/mixins'
import { addObj, putObj } from '@/api/notify/announcement'
import { getSelectData } from '@/api/sys/role'
import { getTree } from '@/api/sys/organization'
import WangEditor from '@/components/Editor/WangEditor'
import AnnouncementModal from '@/components/notify/AnnouncementModal'

export default {
  name: 'AnnouncementFormPage',
  components: { WangEditor, AnnouncementModal },
  mixins: [FormPageMixin],
  data () {
    return {
      reqFunctions: {
        create: addObj,
        update: putObj
      },

      // 校验配置
      decoratorOptions: {},

      // 标签和数值框布局
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },

      // 接收人筛选类型
      recipientFilterType: null,
      // 角色选择框数据
      roleSelectData: [],
      // 组织树
      organizationTree: []
    }
  },
  created () {
    getSelectData({}).then(res => {
      this.roleSelectData = res.data
    })
    getTree().then(res => {
      this.organizationTree = res.data
    })
  },
  methods: {
    echoDataProcess (data) {
      this.recipientFilterType = data.recipientFilterType
    },
    recipientFilterTypeChange (val) {
      this.recipientFilterType = val
      // 筛选方式变更时，清空之前选中的条件数据
      this.form.setFieldsValue({ recipientFilterCondition: [] })
    },
    lovUserShowHandler (row) {
      return row.nickname
    },
    preview(){
      let data = this.form.getFieldsValue()
      this.$refs.announcementModal.show(data)
    }
  }
}
</script>
