<template>
  <div class="ant-pro-page-container-children-content">
    <!-- 查询条件 -->
    <div class="ant-pro-table-search">
      <a-form v-bind="searchFormLayout">
        <a-row :gutter="16">
          <a-col :xl="6" :md="12" :sm="24">
            <a-form-item
              :label="$t('i18n.i18nData.code')"
              :label-col="{ xl: { span: 8 }, md: { span: 6 } }"
              :wrapper-col="{ xl: { span: 16 }, md: { span: 18 } }"
            >
              <a-input v-model="queryParam.code" :placeholder="$t('message.pleaseEnter')" />
            </a-form-item>
          </a-col>
          <a-col :xl="6" :md="12" :sm="24">
            <a-form-item :label="$t('i18n.i18nData.message')">
              <a-input v-model="queryParam.message" :placeholder="$t('message.pleaseEnter')" />
            </a-form-item>
          </a-col>
          <a-col :xl="8" :md="12" :sm="24">
            <a-form-item
              :label="$t('i18n.i18nData.languageTag')"
              :label-col="{ xl: { span: 7 }, md: { span: 6 } }"
              :wrapper-col="{ xl: { span: 17 }, md: { span: 18 } }"
            >
              <a-input v-model="queryParam.languageTag" :placeholder="$t('message.pleaseEnter')" />
            </a-form-item>
          </a-col>
          <!-- <template v-if="advanced">
           </template>-->
          <a-col
            :xl="4"
            :md="12"
            :sm="24"
            class="table-page-search-wrapper"
          >
            <div class="table-page-search-submitButtons">
              <a-button type="primary" :loading="loading" @click="reloadTable">{{ $t('action.query') }}</a-button>
              <a-button style="margin-left: 8px" @click="resetSearchForm">{{ $t('action.reset') }}</a-button>
              <!--<a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? $t('action.expand') : $t('action.collapse') }}
                <icon-font :type="advanced ? 'up' : 'down'"/>
              </a>-->
            </div>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <a-card :bordered="false" :body-style="{ paddingTop: 0, paddingBottom: 0 }">
      <!-- 操作按钮区域 -->
      <div class="ant-pro-table-toolbar">
        <div class="ant-pro-table-toolbar-title">
          {{ $t('i18n.i18nData.text') }}
        </div>
        <div class="ant-pro-table-toolbar-option">
          <a-button
            v-has="'i18n:i18n-data:export'"
            :loading="loading"
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
        </div>
      </div>

      <!--数据表格区域-->
      <div class="ant-pro-table-wrapper">
        <a-table
          ref="table"
          size="middle"
          :row-key="rowKey"
          :columns="columns"
          :data-source="dataSource"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
        >
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
        </a-table>
      </div>
    </a-card>

    <!--新建弹窗-->
    <i18n-data-create-modal ref="createModal" @reload-page-table="reloadTable" />
    <!--修改弹窗-->
    <i18n-data-update-modal ref="updateModal" @reload-page-table="reloadTable" />
    <!--导入弹窗-->
    <i18n-data-import-modal ref="importModal" @reload-page-table="reloadTable" />
  </div>
</template>

<script>
import { getPage, delObj, exportExcel } from '@/api/i18n/i18n-data'
import { TablePageMixin } from '@/mixins'
import I18nDataCreateModal from '@/views/i18n/i18n-data/I18nDataCreateModal'
import I18nDataUpdateModal from '@/views/i18n/i18n-data/I18nDataUpdateModal'
import I18nDataImportModal from '@/views/i18n/i18n-data/I18nDataImportModal'
import { remoteFileDownload } from '@/utils/fileUtil'

export default {
  name: 'I18nDataPage',
  components: { I18nDataCreateModal, I18nDataUpdateModal, I18nDataImportModal },
  mixins: [TablePageMixin],
  data() {
    return {
      getPage: getPage,
      delObj: delObj
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
          title: this.$t('common.remark'),
          dataIndex: 'remark'
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
      this.delObj(record.code, record.languageTag)
        .then(res => {
          if (res.code === 200) {
            this.$message.success(res.message)
            this.reloadTable(false)
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
      this.loading = true
      exportExcel(this.queryParam)
        .then(response => {
          remoteFileDownload(response)
        })
        .finally(() => {
          this.loading = false
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
