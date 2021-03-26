<template>
  <a-form
    :form="form"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    @submit="handleSubmit"
  >
    <a-form-item v-if="formAction === FORM_ACTION.UPDATE" style="display: none">
      <a-input v-decorator="['id']" />
    </a-form-item>

    <a-form-item label="字典标识">
      <a-input v-decorator="['dictCode']" placeholder="字典标识" :disabled="true" />
    </a-form-item>

    <a-form-item label="文本值">
      <a-input v-decorator="['name']" placeholder="文本值" />
    </a-form-item>

    <a-form-item label="数据值">
      <a-input v-decorator="['value']" placeholder="数据值" />
    </a-form-item>

    <a-form-item>
      <template #label>
        <span>
          排序
          <a-tooltip title="升序，数值越小优先级越高">
            <a-icon type="exclamation-circle" />
          </a-tooltip>
        </span>
      </template>
      <a-input-number
        v-decorator="['sort', {initialValue: 1}]"
        placeholder="排序（升序）"
        :min="0"
        style="width: 70%"
      />
    </a-form-item>

    <a-form-item label="附加属性">
      <div id="code">
        <codemirror
          v-model="itemAttributes"
          :options="cmOptions"
          style="line-height: 1.5"
          @mouseleave.passive="leave"
        />
      </div>
    </a-form-item>

    <a-form-item label="备注">
      <a-textarea
        v-decorator="['remarks']"
        placeholder="备注"
        :auto-size="{ minRows: 3, maxRows: 5 }"
      />
    </a-form-item>

    <a-form-item :wrapper-col="{offset: 7 }">
      <a-button html-type="submit" type="primary" :loading="submitLoading">提交</a-button>
      <a-button style="margin-left: 8px" @click="backToPage(false)">取消</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import { PageFormMixin } from '@/mixins'

import { addObj, putObj } from '@/api/sys/sysdictitem'
// codemirror
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/dracula.css'
import 'codemirror/mode/javascript/javascript'

export default {
  name: 'SysDictItemPageForm',
  components: { codemirror },
  mixins: [PageFormMixin],
  data () {
    return {
      reqFunctions: {
        create: addObj,
        update: putObj
      },

      labelCol: {
        sm: { span: 24 },
        md: { span: 3 }
      },
      wrapperCol: {
        sm: { span: 24 },
        md: { span: 20 }
      },

      // 校验配置
      decoratorOptions: {},

      cmOptions: {
        // codemirror options
        size: { height: '150px' },
        tabSize: 2,
        mode: 'application/json',
        theme: 'dracula',
        lineNumbers: true,
        line: true,
        matchBrackets: true,
        extraKeys: {
          // 格式化
          'Ctrl-Alt-L': () => {
            this.itemAttributesFormat()
          }
        }
        // more codemirror options, 更多 codemirror 的高级配置...
      },
      itemAttributes: '{}'
    }
  },
  methods: {
    createdFormCallback (attributes) {
      this.form.setFieldsValue({ dictCode: attributes.dictCode })
    },
    echoDataProcess (data) {
      this.itemAttributes = JSON.stringify(data.attributes, null, 2)
    },
    /**
     * 提交前校验数据
     */
    beforeStartSubmit () {
      if (this.itemAttributes && !this.checkItemAttributes()) {
        this.$message.error('附加属性必须为一个正确的json字符串对象或者为空')
        return false
      }
    },
    submitDataProcess (data) {
      data.attributes = JSON.parse(this.itemAttributes)
      return data
    },
    /**
     * 格式化 attributes
     */
    itemAttributesFormat () {
      if (this.itemAttributes && this.checkItemAttributes()) {
        this.itemAttributes = JSON.stringify(JSON.parse(this.itemAttributes), null, 2)
      }
    },
    /**
     * 校验附加属性是否是一个正确的 json 字符串, 切必须是一个对象
     * @returns {boolean}
     */
    checkItemAttributes () {
      let jsonStr
      try {
        jsonStr = JSON.parse(this.itemAttributes)
      } catch (e) {
      }
      return jsonStr && typeof jsonStr == 'object'
    }
  }
}
</script>


<style scoped lang="less">
.ant-form-item {
  margin-bottom: 8px;
}
</style>

<style lang="less">
/*TODO 不是全局样式不生效*/
#code {
  .CodeMirror {
    border: 1px solid #eee;
    height: 150px !important;
  }

  .CodeMirror-scroll {
    height: 150px !important;
    overflow-y: hidden;
    overflow-x: auto;
  }
}
</style>


