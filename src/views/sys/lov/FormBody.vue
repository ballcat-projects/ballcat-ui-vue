<template>
  <a-card title="表格列配置" class="antd-pro-pages-form-advanced-form-style-card">
    <a-button style="margin-bottom: 5px;margin-top: 5px;" @click="visible=true">新增表格列</a-button>

    <div v-for="(item,index) in value" :key="item.field" style="margin-bottom: 5px;">
      <a-input-group compact>
        <a-input :value="item.title" addonBefore="标题" read-only style="width: 200px" />
        <a-input :value="item.field" addonBefore="字段" read-only style="width: 200px" />
        <a-input :value="item.index" addonBefore="索引" read-only style="width: 100px" />
        <a-button style="color: blue;margin-top: -1px;" title="编辑" @click="json=item;editIndex=index;visible=true">
          <a-icon type="edit" />
        </a-button>
        <a-button style="color: red;margin-top: -1px;" title="删除" @click="value.splice(index,1)">
          <a-icon type="minus-circle" />
        </a-button>
      </a-input-group>
    </div>

    <!-- 不知道为什么，如果删除下面这个，就有问题 -->
    <a-divider style="display: none" />

    <a-modal :visible="visible" :width="800" title="新增表格列" @cancel="visible=false" @ok="createBody">
      <a-row :gutter="4" class="form-row">
        <a-col :span="6">
          <a-form-item label="标题" required>
            <a-input v-model="json.title" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item extra="展示的字段" label="字段" required>
            <a-input v-model="json.field" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item extra="用来排序，索引值小的在左边" label="索引" required>
            <a-input-number v-model="json.index" :min="1" style="width: 100%" />
          </a-form-item>
        </a-col>

        <a-col :span="24">
          <a-form-item extra="请保证内容为可用的json"
                       label="自定义属性">
            <codemirror v-model="json.property" :options="cmOptions"
                        style="line-height: 1.5"
                        @mouseleave.passive="leave"
            ></codemirror>
          </a-form-item>
        </a-col>
      </a-row>
    </a-modal>
  </a-card>
</template>

<script>

// codemirror
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/dracula.css'
import 'codemirror/mode/javascript/javascript'
import AFormItem from 'ant-design-vue/lib/form/FormItem'

export default {
  name: 'FormBody',
  components: {  codemirror },
  props: {
    value: {
      type: Array,
      default: function () {
        return []
      }
    },
    formAction: String,
    form: Object
  },
  data() {
    return {
      visible: false,
      editIndex: undefined,
      cmOptions: {
        // codemirror options
        size: { height: '150px' },
        tabSize: 2,
        mode: 'application/json',
        theme: 'dracula',
        lineNumbers: true,
        line: true,
        matchBrackets: true
      },
      json: {
        title: '',
        field: '',
        index: 1,
        property: '{\n\n}'
      }
    }
  },
  methods: {
    createBody() {
      const errMsg = this.valid()

      if (errMsg) {
        this.$message.error(errMsg)
        return
      }
      if (typeof this.editIndex !== 'number') {
        // 新增
        this.value.push({ ...this.json })
      }
      this.json = {
        title: '',
        field: '',
        index: 1,
        property: '{\n\n}'
      }
      this.editIndex = undefined
      this.visible = false
    },
    valid() {
      const json = { ...this.json }
      if (!json.title || json.title.trim().length === 0) {
        return '标题不能为空或纯空格'
      }
      if (!json.field || json.field.trim().length === 0) {
        return '字段不能为空或纯空格'
      }
      if (json.index === null || json.index === undefined) {
        return '索引不能为空'
      }

      try {
        JSON.parse(json.property)
      } catch (e) {
        console.error(e)
        return '自定义属性转换成json时报错,请检查内容,错误信息请查看控制台'
      }
    }
  }
}
</script>
