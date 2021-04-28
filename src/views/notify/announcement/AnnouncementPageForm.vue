<template>
  <a-card :bordered="false" :title="title">
    <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item v-if="isUpdateForm" style="display: none">
        <a-input v-decorator="['id']" />
      </a-form-item>

      <a-form-item label="标题">
        <a-input v-decorator="['title', decoratorOptions.title]" placeholder="标题" />
      </a-form-item>

      <a-form-item label="内容">
        <wang-editor
          v-decorator="['content', decoratorOptions.content]"
          :upload-img-req="reqFunctions.uploadImage"
        />
      </a-form-item>

      <a-form-item label="筛选类型">
        <dict-select
          v-decorator="['recipientFilterType', decoratorOptions.recipientFilterType]"
          dict-code="recipient_filter_type"
          @change="recipientFilterTypeChange"
        />
      </a-form-item>

      <a-form-item
        v-if="recipientFilterType && recipientFilterType !== 1"
        label="筛选条件"
      >
        <a-select
          v-if="recipientFilterType === 2"
          v-decorator="['recipientFilterCondition', decoratorOptions.recipientFilterType]"
          mode="multiple"
          style="width: 100%"
          placeholder="请选择角色"
          :allow-clear="true"
        >
          <a-select-option
            v-for="selectData in roleSelectData"
            :key="selectData.value"
          >
            {{ selectData.name }}
          </a-select-option>
        </a-select>
        <a-tree-select
          v-if="recipientFilterType === 3"
          v-decorator="['recipientFilterCondition', decoratorOptions.recipientFilterType]"
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
        />
        <dict-select
          v-if="recipientFilterType === 4"
          v-decorator="['recipientFilterCondition',decoratorOptions.recipientFilterType]"
          dict-code="user_type"
          mode="multiple"
          placeholder="请选择用户类型"
        />
        <lov
          v-if="recipientFilterType === 5"
          v-decorator="['recipientFilterCondition', decoratorOptions.recipientFilterType]"
          keyword="lov_user"
          :show-handler-by-select-row="lovUserShowHandler"
        />
      </a-form-item>

      <a-form-item label="接收方式">
        <dict-check-box-group
          v-decorator="['receiveMode', decoratorOptions.receiveMode]"
          dict-code="notify_channel"
        />
      </a-form-item>

      <a-form-item label="永久有效">
        <a-row>
          <a-col :xs="5" :md="2">
            <a-switch v-model="isImmortal" />
          </a-col>
          <a-col :xs="16" :md="16">
            <a-form-item label="">
              <a-date-picker
                v-if="!isImmortal"
                v-decorator="['deadline']"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                :show-time="true"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form-item>

      <a-form-item :wrapper-col="{offset: 7 }">
        <a-button type="dashed" @click="preview">预览</a-button>
        <a-button
          style="margin-left: 8px"
          type="primary"
          :loading="submitLoading"
          @click="save"
        >仅保存</a-button>
        <a-button
          style="margin-left: 8px"
          type="primary"
          :loading="submitLoading"
          @click="saveAndPublish"
        >保存并发布
        </a-button>
        <a-button style="margin-left: 8px" @click="backToPage(false)">取消</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
import { PageFormMixin } from '@/mixins'
import { addObj, putObj, uploadImage } from '@/api/notify/announcement'
import { getSelectData } from '@/api/system/role'
import { getTree } from '@/api/system/organization'
import WangEditor from '@/components/Editor/WangEditor'

export default {
  name: 'AnnouncementPageForm',
  components: { WangEditor },
  mixins: [PageFormMixin],
  data () {
    return {
      reqFunctions: {
        create: addObj,
        update: putObj,
        uploadImage: uploadImage
      },

      // 校验配置
      decoratorOptions: {
        title: { rules: [{ required: true, message: '请输入公告标题!' }] },
        content: { initialValue: '', rules: [{ required: true, message: '请输入公告内容!' }] },
        recipientFilterType: { initialValue: [], rules: [{ required: true, message: '请选择接收人!' }] },
        recipientFilterCondition: { rules: [{ required: true, message: '请指定接收人范围!' }] },
        receiveMode: { rules: [{ required: true, message: '请选择接收方式!' }] }
      },

      // 标签和数值框布局
      labelCol: {
        sm: { span: 24 },
        md: { span: 5 }
      },
      wrapperCol: {
        sm: { span: 24 },
        md: { span: 16 }
      },

      // 是否永久有效
      isImmortal: true,
      // 接收人筛选类型
      recipientFilterType: null,
      // 创建公告的默认状态
      newAnnouncementStatus: 0,
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
      this.isImmortal = data.immortal === 1
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
    preview () {
      this.$emit('preview-announcement', this.form.getFieldsValue())
    },
    save () {
      this.newAnnouncementStatus = 2
      this.handleSubmit()
    },
    saveAndPublish () {
      this.newAnnouncementStatus = 1
      this.handleSubmit()
    },
    submitDataProcess (formData) {
      formData.immortal = this.isImmortal ? 1 : 0
      formData.status = this.newAnnouncementStatus
      return formData
    }
  }
}
</script>
