<template>
  <div class="ant-pro-page-container-children-content">
    <div v-show="tableShow">
      <!-- 查询条件 -->
      <div class="ant-pro-table-search">
        <a-form v-bind="searchFormLayout">
          <a-row :gutter="16">
            <a-col :md="8" :sm="24">
              <a-form-item label="标题">
                <a-input v-model="queryParam.title" placeholder="支持模糊查询"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="接收人范围">
                <dict-select
                  v-model=queryParam.recipientFilterType
                  dict-code="recipient_filter_type">
                </dict-select>
              </a-form-item>
            </a-col>

            <!-- <template v-if="advanced">
             </template>-->
            <a-col :md="8" :sm="24" class="table-page-search-wrapper">
              <div class="table-page-search-submitButtons">
                <a-button type="primary" @click="reloadTable">查询</a-button>
                <a-button style="margin-left: 8px" @click="resetSearchForm">重置</a-button>
                <!--<a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>-->
              </div>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <a-card :bordered="false" :body-style="{padding: 0}">
        <!-- 操作按钮区域 -->
        <div class="ant-pro-table-toolbar">
          <div class="ant-pro-table-toolbar-title">公告信息</div>
          <div class="ant-pro-table-toolbar-option">
            <a-button v-has="'notify:announcement:add'" type="primary" icon="plus" @click="handleAdd()">新建</a-button>
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
            <template #status-slot="status">
              <a-badge :status="status | statusTypeFilter" :text="status | statusFilter"/>
            </template>

            <template #content-slot="content, record">
              <a href="javascript:;" @click="previewAnnouncement(record)">预览</a>
            </template>

            <template #recipient-slot="type">
              <dict-text dict-code="recipient_filter_type" :value="type"></dict-text>
            </template>

            <template #receive-mode-slot="modes">
              <dict-slot
                dict-code="notify_channel"
                v-for="mode in modes"
                :key="mode"
                :value="mode"
                style="margin-right: 5px"
              ></dict-slot>
            </template>

            <template #action-slot="text, record">
              <template v-has="'notify:announcement:edit'">
                <a :disabled="record.status !== 2" @click="handleEdit(record)">编辑</a>
                <a-divider type="vertical"/>
                <a-popconfirm title="确认要发布吗？"
                              @confirm="() => handlePublish(record)">
                  <a href="javascript:" :disabled="record.status !== 2">发布</a>
                </a-popconfirm>
                <a-divider type="vertical"/>
                <a-popconfirm title="确认要关闭吗？"
                              @confirm="() => handleClose(record)">
                  <a href="javascript:" :disabled="record.status === 0">关闭</a>
                </a-popconfirm>
              </template>
              <a-divider type="vertical" v-if="$has('notify:announcement:edit') || $has('notify:announcement:del')"/>
              <a-popconfirm v-has="'notify:announcement:del'"
                            title="确认要删除吗？"
                            @confirm="() => handleDel(record)">
                <a href="javascript:" class="ballcat-text-danger">删除</a>
              </a-popconfirm>
            </template>
          </a-table>
        </div>
      </a-card>
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
import { TablePageMixin } from '@/mixins'
import AnnouncementModal from '@/components/notify/AnnouncementModal'

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
  components: { AnnouncementPageForm, AnnouncementModal },
  filters: {
    statusFilter (status) {
      return statusFilterArr[status].text
    },
    statusTypeFilter (status) {
      return statusFilterArr[status].state
    }
  },
  mixins: [TablePageMixin],
  data () {
    return {
      getPage: getPage,
      delObj: delObj,

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
          customRender: function (text, record) {
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
    // 新增
    handleAdd () {
      this.switchPage()
      this.$refs.pageForm.add({ title: '新建公告' })
    },
    // 编辑
    handleEdit (record) {
      this.switchPage()
      this.$refs.pageForm.update(record, { title: '编辑公告' })
    },
    /**
     * 发布公告
     * @param record 公告对象
     */
    handlePublish (record) {
      publish(record.id).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
          this.reloadTable()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    /**
     * 关闭公告
     * @param record 公告对象
     */
    handleClose (record) {
      close(record.id).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
          this.reloadTable()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    /**
     * 预览公告
     */
    previewAnnouncement (record) {
      this.$refs.announcementModal.show(record, true)
    }
  }
}
</script>
