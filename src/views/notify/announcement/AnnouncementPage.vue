<template>
  <div class="ant-pro-page-container-children-content">
    <div v-show="tableShow">

      <pro-table
        ref="table"
        toolbar-title="公告信息"
        :row-key="rowKey"
        :request="tableRequest"
        :columns="columns"
        :scroll="{ x: 1000 }"
      >

        <template #search-form="searchFormState">
          <a-row :gutter="16">
            <a-col :md="8" :sm="24">
              <a-form-item label="标题">
                <a-input v-model="searchFormState.queryParam.title" placeholder="支持模糊查询" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="接收人范围">
                <dict-select v-model="searchFormState.queryParam.recipientFilterType" dict-code="recipient_filter_type" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24" class="table-page-search-wrapper">
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
        <template>
          <a-button
            v-has="'notify:announcement:add'"
            type="primary"
            icon="plus"
            @click="handleAdd()"
          >新建</a-button>
        </template>


        <!--数据表格区域-->
        <template #status-slot="status">
          <a-badge :status="status | statusTypeFilter" :text="status | statusFilter" />
        </template>
        <template #content-slot="content, record">
          <a href="javascript:;" @click="previewAnnouncement(record)">预览</a>
        </template>
        <template #recipient-slot="type">
          <dict-text dict-code="recipient_filter_type" :value="type" />
        </template>
        <template #receive-mode-slot="modes">
          <dict-tag
            v-for="mode in modes"
            :key="mode"
            dict-code="notify_channel"
            :value="mode"
            style="margin-right: 5px"
          />
        </template>
        <template #action-slot="text, record">
          <span v-has="'notify:announcement:edit'">
            <a :disabled="record.status !== 2" @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm title="确认要发布吗？" @confirm="() => handlePublish(record)">
              <a href="javascript:" :disabled="record.status !== 2">发布</a>
            </a-popconfirm>
            <a-divider type="vertical" />
            <a-popconfirm title="确认要关闭吗？" @confirm="() => handleClose(record)">
              <a href="javascript:" :disabled="record.status === 0">关闭</a>
            </a-popconfirm>
          </span>
          <a-divider v-if="$has('notify:announcement:edit') || $has('notify:announcement:del')" type="vertical" />
          <a-popconfirm v-has="'notify:announcement:del'" title="确认要删除吗？" @confirm="() => handleDel(record)">
            <a href="javascript:" class="ballcat-text-danger">删除</a>
          </a-popconfirm>
        </template>
      </pro-table>
    </div>

    <!--表单页面-->
    <announcement-page-form
      v-show="!tableShow"
      ref="pageForm"
      @back-to-page="backToPage"
      @preview-announcement="previewAnnouncement"
    />

    <!-- 公共弹窗，预览用 -->
    <announcement-modal ref="announcementModal" />
  </div>
</template>

<script>
import { getPage, delObj, publish, close } from '@/api/notify/announcement'
import AnnouncementPageForm from './AnnouncementPageForm'
import AnnouncementModal from '@/components/Notify/AnnouncementModal'
import ProTable from '@/components/Table/ProTable'

const statusFilterArr = [
  {
    state: 'default',
    text: '已关闭',
    value: 0
  },
  {
    state: 'processing',
    text: '已发布',
    value: 1
  },
  {
    state: 'warning',
    text: '待发布',
    value: 2
  }
]

export default {
  name: 'AnnouncementPage',
  components: { ProTable, AnnouncementPageForm, AnnouncementModal },
  filters: {
    statusFilter(status) {
      return statusFilterArr[status].text
    },
    statusTypeFilter(status) {
      return statusFilterArr[status].state
    }
  },
  data() {
    return {
      tableShow: true,

      rowKey: 'id',
      tableRequest: getPage,

      columns: [
        {
          title: '#',
          dataIndex: 'id'
        },
        {
          title: '标题',
          dataIndex: 'title'
        },
        {
          title: '内容',
          dataIndex: 'content',
          scopedSlots: { customRender: 'content-slot' }
        },
        {
          title: '接收人范围',
          dataIndex: 'recipientFilterType',
          scopedSlots: { customRender: 'recipient-slot' }
        },
        {
          title: '接收方式',
          dataIndex: 'receiveMode',
          scopedSlots: { customRender: 'receive-mode-slot' }
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status-slot' },
          filters: statusFilterArr
        },
        {
          title: '失效时间',
          dataIndex: 'deadline',
          customRender: function(text, record) {
            return record.immortal ? '永久有效' : text
          }
        },
        {
          title: '创建人',
          dataIndex: 'createUsername'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: '150px',
          sorter: true
        },
        {
          title: '操作',
          align: 'center',
          width: '185px',
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
    // 新增
    handleAdd() {
      this.switchPage()
      this.$refs.pageForm.add({ title: '新建公告' })
    },
    // 编辑
    handleEdit(record) {
      this.switchPage()
      this.$refs.pageForm.update(record, { title: '编辑公告' })
    },
    // 删除
    handleDel (record) {
      delObj(record[this.rowKey]).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
          this.reloadPageTable(false)
        } else {
          this.$message.error(res.message)
        }
      }).catch((e) => {
        // 未被 axios拦截器处理过，则在这里继续处理
        !e.resolved && this.$message.error(e.message || 'error request')
      })
    },
    // 切换表格/表单
    switchPage () {
      window.scrollTo(0, 0)
      this.tableShow = !this.tableShow
    },
    // 返回表格
    backToPage (needRefresh) {
      this.switchPage()
      needRefresh && this.reloadPageTable(false)
    },
    /**
     * 发布公告
     * @param record 公告对象
     */
    handlePublish(record) {
      publish(record.id).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
          this.reloadPageTable(false)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    /**
     * 关闭公告
     * @param record 公告对象
     */
    handleClose(record) {
      close(record.id).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
          this.reloadPageTable(false)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    /**
     * 预览公告
     */
    previewAnnouncement(record) {
      this.$refs.announcementModal.show(record, true)
    }
  }
}
</script>
