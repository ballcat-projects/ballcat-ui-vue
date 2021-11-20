<template>
  <div class="ant-pro-page-container-children-content">

    <pro-table
      ref="table"
      :toolbar-title="$t('i18n.i18nData.text')"
      :row-key="rowKey"
      :request="tableRequest"
      :columns="columns"
    >
      <!-- 查询表单 -->
      <template #search-form="searchFormState">
        <a-row :gutter="16">
          <a-col :xl="6" :md="12" :sm="24">
            <a-form-item
              :label="$t('i18n.i18nData.code')"
              :label-col="{ xl: { span: 8 }, md: { span: 6 } }"
              :wrapper-col="{ xl: { span: 16 }, md: { span: 18 } }"
            >
              <a-input v-model="searchFormState.queryParam.code" :placeholder="$t('message.pleaseEnter')" />
            </a-form-item>
          </a-col>
          <a-col :xl="6" :md="12" :sm="24">
            <a-form-item :label="$t('i18n.i18nData.message')">
              <a-input v-model="searchFormState.queryParam.message" :placeholder="$t('message.pleaseEnter')" />
            </a-form-item>
          </a-col>
          <a-col :xl="6" :md="12" :sm="24">
            <a-form-item
              :label="$t('i18n.i18nData.languageTag')"
              :label-col="{ xl: { span: 9 }, md: { span: 6 } }"
              :wrapper-col="{ xl: { span: 15 }, md: { span: 18 } }"
            >
              <a-input v-model="searchFormState.queryParam.languageTag" :placeholder="$t('message.pleaseEnter')" />
            </a-form-item>
          </a-col>
          <a-col :xl="6" :md="12" :sm="24">
            <a-form-item :wrapper-col="{flex: '1 1 0'}" class="search-actions-wrapper">
              <a-space>
                <a-button type="primary" :loading="searchFormState.loading" @click="searchFormState.reloadTable(true)">查询</a-button>
                <a-button @click="searchFormState.resetSearchForm">重置</a-button>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </template>

      <!-- 操作按钮区域 -->
      <template #toolbar-action>
        <a-button
          v-has="'i18n:i18n-data:export'"
          :loading="$refs.table ? $refs.table.localLoading : false"
          style="margin-left: 8px"
          icon="download"
          @click="handleExport()"
        >
          {{ $t('action.export') }}
        </a-button>
        <a-button
          v-has="'i18n:i18n-data:import'"
          icon="upload"
          @click="handleImport()"
        >{{ $t('action.import') }}
        </a-button>
        <a-button
          v-has="'i18n:i18n-data:add'"
          type="primary"
          icon="plus"
          @click="handleAdd()"
        >{{ $t('action.create') }}
        </a-button>
      </template>

      <!--数据表格区域-->
      <template #action-slot="text, record">
        <a v-has="'i18n:i18n-data:edit'" @click="handleEdit(record)">{{ $t('action.edit') }}</a>
        <a-divider type="vertical" />
        <a-popconfirm
          v-has="'i18n:i18n-data:del'"
          :title="$t('message.confirmDelete')"
          @confirm="() => handleDel(record)"
        >
          <a href="javascript:" class="ballcat-text-danger">{{ $t('action.delete') }}</a>
        </a-popconfirm>
      </template>
    </pro-table>

    <!--新建弹窗-->
    <i18n-data-create-modal ref="createModal" @reload-page-table="reloadPageTable" />
    <!--修改弹窗-->
    <i18n-data-update-modal ref="updateModal" @reload-page-table="reloadPageTable" />
    <!--导入弹窗-->
    <i18n-data-import-modal ref="importModal" @reload-page-table="reloadPageTable" />
  </div>
</template>

<script>
import { getPage, delObj, exportExcel } from '@/api/i18n/i18n-data'
import I18nDataCreateModal from '@/views/i18n/i18n-data/I18nDataCreateModal'
import I18nDataUpdateModal from '@/views/i18n/i18n-data/I18nDataUpdateModal'
import I18nDataImportModal from '@/views/i18n/i18n-data/I18nDataImportModal'
import { remoteFileDownload } from '@/utils/fileUtil'
import ProTable from '@/components/Table/ProTable'

export default {
  name: 'I18nDataPage',
  components: { ProTable, I18nDataCreateModal, I18nDataUpdateModal, I18nDataImportModal },
  data() {
    return {
      rowKey: 'id',
      tableRequest: getPage
    }
  },
  computed: {
    columns() {
      return [
        {
          title: '#',
          dataIndex: 'id'
        },
        {
          title: this.$t('i18n.i18nData.languageTag.text'),
          dataIndex: 'languageTag'
        },
        {
          title: this.$t('i18n.i18nData.code.text'),
          dataIndex: 'code'
        },
        {
          title: this.$t('i18n.i18nData.message.text'),
          dataIndex: 'message'
        },
        {
          title: this.$t('common.remarks'),
          dataIndex: 'remarks'
        },
        {
          title: this.$t('common.createTime'),
          dataIndex: 'createTime',
          width: '150px',
          sorter: true
        },
        {
          title: this.$t('common.operation'),
          align: 'center',
          width: '150px',
          scopedSlots: { customRender: 'action-slot' }
        }
      ]
    }
  },
  methods: {
    // 刷新表格
    reloadPageTable (withFirstPage = true) {
      this.$refs.table.reloadTable(withFirstPage)
    },
    /**
     * 新建国际化信息
     */
    handleAdd() {
      const attributes = { title: this.$t('action.create') + '：' + this.$t('i18n.i18nData.text') }
      this.$refs.createModal.add(attributes)
    },
    /**
     * 编辑国际化信息
     * @param record 当前国际化信息属性
     */
    handleEdit(record) {
      const attributes = { title: this.$t('action.edit') + '：' + this.$t('i18n.i18nData.text') }
      this.$refs.updateModal.update(record, attributes)
    },
    // 删除
    handleDel(record) {
      delObj(record.code, record.languageTag)
        .then(res => {
          if (res.code === 200) {
            this.$message.success(res.message)
            this.reloadPageTable(false)
          } else {
            this.$message.error(res.message)
          }
        })
        .catch(e => {
          // 未被 axios拦截器处理过，则在这里继续处理
          !e.resolved && this.$message.error(e.message || 'error request')
        })
    },
    /**
     * 导出国际化信息
     */
    handleExport() {
      this.$refs.table.localLoading = true
      exportExcel(this.$refs.table.queryParam)
        .then(response => {
          remoteFileDownload(response)
        })
        .finally(() => {
          this.$refs.table.localLoading = false
        })
    },
    /**
     * 导入国际化信息
     */
    handleImport() {
      const attributes = { title: this.$t('action.import') + ' ' + this.$t('i18n.i18nData.text') }
      this.$refs.importModal.show(attributes)
    }
  }
}
</script>
