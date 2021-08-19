<template>
  <a-modal
    :title="title"
    :visible="visible"
    :mask-closable="false"
    :footer="null"
    @cancel="handleClose"
  >
    <a-table
      bordered
      size="middle"
      row-key="languageTag"
      :data-source="dataSource"
      :columns="columns"
      :loading="dataLoading"
      :pagination="false"
    >
      <template #edit-message="text, record">
        <editable-cell :text="text" @change="onMessageChange(record, $event)" />
      </template>
    </a-table>
  </a-modal>
</template>
<script>
import { listByCode, putObj } from '@/api/i18n/i18n-data'
import EditableCell from '@/components/Table/EditableCell'

export default {
  name: 'I18nMessageModal',
  components: { EditableCell },
  data () {
    return {
      // 国际化数据的标识
      code: '',
      // 弹窗显隐空值对象
      visible: false,
      // 表格数据加载动画显示空值
      dataLoading: false,
      // 是否有更新
      hasUpdate: false,
      dataSource: [],
      columns: [
        {
          title: 'language Tag',
          dataIndex: 'languageTag',
          width: 150
        },
        {
          title: 'message',
          dataIndex: 'message',
          scopedSlots: { customRender: 'edit-message' }
        }
      ]
    }
  },
  computed: {
    title () {
      return `国际化标识：${this.code}`
    }
  },
  methods: {
    show (code) {
      this.visible = true
      this.dataLoading = true
      this.hasUpdate = false
      this.code = code
      listByCode(this.code).then(res => {
          this.dataSource = res.data
      }).finally(() => {
        this.dataLoading = false
      })
    },
    handleClose() {
      this.visible = false
      // 如果有更新，则通知父组件
      if(this.hasUpdate){
        this.$emit('has-update')
      }
    },
    /**
     * 当用户编辑了 message 时，进行更新
     * @param record
     * @param value
     */
    onMessageChange (record, value) {
      // 没改，直接 return
      if(record.message === value){
        return
      }
      this.hasUpdate = true
      // 值变更，则请求后台更新 i18nData 数据
      this.dataLoading = true
      putObj({
        code: record.code,
        languageTag: record.languageTag,
        message: value
      }).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
        } else {
          this.$message.error(res.message)
        }
      }).finally(() => {
        this.dataLoading = false
      })
    }
  }
}
</script>
