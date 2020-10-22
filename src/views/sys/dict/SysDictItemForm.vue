<template>
  <a-form @submit="handleSubmit" :form="form" :labelCol=labelCol
          :wrapperCol=wrapperCol>
    <a-form-item v-if="formAction === this.FORM_ACTION.UPDATE" style="display: none">
      <a-input v-decorator="['id']"/>
    </a-form-item>

    <a-form-item label="字典标识">
      <a-input placeholder="字典标识" v-decorator="['dictCode']" :disabled="true"/>
    </a-form-item>

    <a-form-item label="文本值">
      <a-input placeholder="文本值" v-decorator="['name']"/>
    </a-form-item>

    <a-form-item label="数据值">
      <a-input placeholder="数据值" v-decorator="['value']"/>
    </a-form-item>

    <a-form-item>
      <template #label>
        <span>
        排序
        <a-tooltip title="升序，数值越小优先级越高">
          <a-icon type="exclamation-circle"/>
        </a-tooltip>
      </span>
      </template>
      <a-input-number placeholder="排序（升序）" v-decorator="['sort', {initialValue: 1}]"
                      :min=0 style="width: 70%"/>
    </a-form-item>

    <a-form-item label="附加属性">
      <div id="code">
        <codemirror v-model="itemAttributes" :options="cmOptions" style="line-height: 1.5"
                    @mouseleave.passive="leave"
        ></codemirror>
      </div>
    </a-form-item>

    <a-form-item label="备注">
      <a-textarea placeholder="备注"  v-decorator="['remarks']"
                  :autoSize="{ minRows: 3, maxRows: 5 }"/>
    </a-form-item>


    <div v-show="formAction === this.FORM_ACTION.UPDATE">
      <a-form-item label="创建时间">
        <span>{{ displayData.createTime }}</span>
      </a-form-item>
      <a-form-item label="修改时间">
        <span>{{ displayData.updateTime }}</span>
      </a-form-item>
    </div>
    <a-form-item :wrapperCol="{offset: 7 }">
      <a-button htmlType="submit" type="primary" :loading="submitLoading">提交</a-button>
      <a-button style="margin-left: 8px" @click="backToPage(false)">取消</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import { FormPageMixin } from '@/mixins'
import AFormItem from 'ant-design-vue/es/form/FormItem'
import { addObj, putObj } from '@/api/sys/sysdictitem'
// codemirror
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/dracula.css'
import 'codemirror/mode/javascript/javascript'

export default {
  name: 'SysDictItemFormPage',
  components: { AFormItem, codemirror },
  mixins: [FormPageMixin],
  data () {
    return {
      reqFunctions: {
        create: addObj,
        update: putObj
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
      itemAttributes: ''
    }
  },
  methods: {
    createdFormCallback (argument) {
      this.form.setFieldsValue({ dictCode: argument })
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


