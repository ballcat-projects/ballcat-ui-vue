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

      <a-card :bordered="false" :bodyStyle="{padding: 0}">
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
            :rowKey="rowKey"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="pagination"
            :loading="loading"
            @change="handleTableChange"
          >
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
              <a v-has="'notify:announcement:edit'" @click="handleEdit(record)">编辑</a>
              <a-divider type="vertical"/>
              <a-popconfirm v-has="'notify:announcement:del'"
                            title="确认要删除吗？"
                            @confirm="() => handleDel(record)">
                <a href="javascript:">删除</a>
              </a-popconfirm>
            </template>
          </a-table>
        </div>
      </a-card>
    </div>

    <!--表单页面-->
    <a-card v-if="formInited" :bordered="false" :title="cardTitle" v-show="!tableShow">
      <form-page ref="formPage" @backToPage="backToPage"></form-page>
    </a-card>

    <AnnouncementModal ref="announcementModal"></AnnouncementModal>
  </div>
</template>

<script>
import { getPage, delObj } from '@/api/notify/announcement'
import FormPage from './AnnouncementForm'
import { TablePageMixin } from '@/mixins'
import AnnouncementModal from '@/components/notify/AnnouncementModal'

export default {
  name: 'AnnouncementPage',
  components: { FormPage, AnnouncementModal },
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
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action-slot' }
        }
      ],
    }
  },
  methods: {
    /**
     * 预览公告
     */
    previewAnnouncement (record) {
      this.$refs.announcementModal.show(record)
    }
  }
}
</script>
