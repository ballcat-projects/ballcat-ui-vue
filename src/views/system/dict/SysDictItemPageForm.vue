<template>
  <a-form
    :form="form"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    @submit="handleSubmit"
  >
    <a-form-item v-if="isUpdateForm" style="display: none">
      <a-input v-decorator="['id']" />
    </a-form-item>

    <a-form-item v-if="isCreateForm" style="display: none">
      <a-input v-decorator="['status', { initialValue: 1 }]" />
    </a-form-item>

    <a-form-item label="字典标识">
      <a-input v-decorator="['dictCode']" placeholder="字典标识" :disabled="true" />
    </a-form-item>

    <a-form-item label="文本值">
      <a-input v-decorator="['name']" placeholder="文本值" />
    </a-form-item>

    <a-form-item label="数据值">
      <a-input v-decorator="['value']" placeholder="数据值提交后不可修改" :disabled="isUpdateForm" />
    </a-form-item>

    <a-row :gutter="16">
      <a-col :xs="12" :sm="24" :md="12">
        <a-form-item label="标签颜色" :label-col="rowLabelCol" :wrapper-col="rowWrapperCol">
          <a-popover trigger="click" placement="top">
            <template slot="content">
              <template v-for="tagColor in antdTagColor">
                <a-tag :key="tagColor" :color="tagColor" @click="presetTagColor(tagColor)">{{ tagColor }}</a-tag>
              </template>
            </template>
            <a-tag :color="tagColorAttribute" style="margin: 0 0 0 5px">点我换色</a-tag>
          </a-popover>

          <a-popover trigger="click" placement="right">
            <template slot="content">
              <sketch-picker v-model="tagColorPicker" @input="onTagColorPicker" />
            </template>
            <a href="javascript:" style="margin-left: 5px"><a-icon :component="colorPicker" /></a>
          </a-popover>

          <a
            v-if="tagColorAttribute"
            href="javascript:"
            style="margin-left: 5px; display: inline-block"
            @click="clearTagColor"
          >
            <a-icon type="delete" />
          </a>
        </a-form-item>
      </a-col>

      <a-col :xs="12" :sm="24" :md="12">
        <a-form-item label="文本颜色" :label-col="rowLabelCol" :wrapper-col="rowWrapperCol">
          <span :style="{ marginLeft: '5px', color: textColorAttribute || 'black' }">颜色演示</span>
          <a-popover trigger="click" placement="right">
            <template slot="content">
              <sketch-picker v-model="textColorPicker" @input="onTextColorPicker" />
            </template>
            <a href="javascript:" style="margin-left: 5px"><a-icon :component="colorPicker" /></a>
          </a-popover>
          <a
            v-if="textColorAttribute"
            href="javascript:"
            style="margin-left: 5px; display: inline-block"
            @click="clearTextColor"
          >
            <a-icon type="delete" />
          </a>
        </a-form-item>
      </a-col>
    </a-row>

    <a-row :gutter="16">
      <a-col :xs="12" :sm="24" :md="12">
        <a-form-item label="徽标颜色" :label-col="rowLabelCol" :wrapper-col="rowWrapperCol">
          <a-popover trigger="click" placement="top">
            <template slot="content">
              <template v-for="badgeColor in antdBadgeColor">
                <a :key="badgeColor" @click="presetBadgeColor(badgeColor)">
                  <a-badge :color="badgeColor" :text="badgeColor" style="margin: 0 0 0 5px" />
                </a>
              </template>
            </template>
            <a-badge
              :status="badgeStatus"
              :color="badgeColorAttribute"
              text="点我换色"
              style="margin: 0 0 0 5px"
            />
          </a-popover>

          <a-popover trigger="click" placement="right">
            <template slot="content">
              <sketch-picker v-model="badgeColorPicker" @input="onBadgeColorPicker" />
            </template>
            <a href="javascript:" style="margin-left: 5px"><a-icon :component="colorPicker" /></a>
          </a-popover>

          <a
            v-if="badgeColorAttribute"
            href="javascript:"
            style="margin-left: 5px; display: inline-block"
            @click="clearBadgeColor"
          >
            <a-icon type="delete" />
          </a>
        </a-form-item>
      </a-col>
      <a-col :xs="12" :sm="24" :md="12">
        <a-form-item label="徽标状态" :label-col="rowLabelCol" :wrapper-col="rowWrapperCol">
          <a-select v-model="badgeStatus">
            <a-select-option
              v-for="optionBadgeStatus in antdBadgeStatus"
              :key="optionBadgeStatus"
              :value="optionBadgeStatus"
            >
              <a-badge :status="optionBadgeStatus" :text="optionBadgeStatus" />
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>

    <a-form-item v-if="enableI18n" label="国际化">
      <a-space direction="vertical" style="width: 100%">
        <a-input
          v-for="language in supportLanguage"
          :key="language.lang"
          v-model="languagesAttribute[language.lang]"
          :addon-before="language.title"
        />
      </a-space>

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
        v-decorator="['sort', { initialValue: 1 }]"
        placeholder="排序（升序）"
        :min="0"
        style="width: 70%"
      />
    </a-form-item>

    <a-form-item label="备注">
      <a-textarea v-decorator="['remarks']" placeholder="备注" :auto-size="{ minRows: 3, maxRows: 5 }" />
    </a-form-item>

    <a-form-item :wrapper-col="{ offset: 7 }">
      <a-button html-type="submit" type="primary" :loading="submitLoading">提交</a-button>
      <a-button style="margin-left: 8px" @click="backToPage(false)">取消</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import { colorPicker } from '@/core/icons'
import { PageFormMixin } from '@/mixins'
import { enableI18n, supportLanguage } from '@/config/projectConfig'

import { addObj, putObj } from '@/api/system/dict-item'

import { Sketch } from 'vue-color'

export default {
  name: 'SysDictItemPageForm',
  components: { 'sketch-picker': Sketch },
  mixins: [PageFormMixin],
  data() {
    return {
      colorPicker,

      reqFunctions: {
        create: addObj,
        update: putObj
      },

      labelCol: {
        sm: { span: 24 },
        md: { span: 4 }
      },
      wrapperCol: {
        sm: { span: 24 },
        md: { span: 18 }
      },

      rowLabelCol: {
        sm: { span: 24 },
        md: { span: 8 }
      },
      rowWrapperCol: {
        sm: { span: 24 },
        md: { span: 12 }
      },

      // 校验配置
      decoratorOptions: {},

      antdTagColor: ['pink', 'red', 'orange', 'green', 'cyan', 'blue', 'purple'],
      antdBadgeStatus: ['success', 'processing', 'default', 'error', 'warning'],
      antdBadgeColor: [
        'pink',
        'red',
        'yellow',
        'orange',
        'cyan',
        'green',
        'blue',
        'purple',
        'geekblue',
        'magenta',
        'volcano',
        'gold',
        'lime'
      ],

      // dict-tag 的颜色
      // 拾色器绑定对象
      tagColorPicker: '',
      // 颜色属性
      tagColorAttribute: '',
      // dict-badge 的颜色
      // 拾色器绑定对象
      badgeColorPicker: '',
      // 颜色属性
      badgeColorAttribute: '',
      badgeStatus: 'default',

      // dict-text 的颜色
      textColorPicker: '',
      textColorAttribute: '',

      // 是否开启国际化
      enableI18n: enableI18n,
      // 支持的语言列表
      supportLanguage: supportLanguage,
      // 语言属性
      languagesAttribute: {}
    }
  },
  computed: {
    colorBoxStyle() {
      return {
        display: 'inline-block',
        width: '16px',
        height: '16px',
        marginTop: '12px',
        border: '1px',
        borderStyle: 'solid',
        borderColor: '#000000',
        backgroundColor: this.tagColorAttribute
      }
    }
  },
  methods: {
    presetTagColor(tagColor) {
      this.tagColorAttribute = tagColor
    },
    onTagColorPicker(tagColorPicker) {
      this.tagColorAttribute = tagColorPicker.hex
    },
    clearTagColor() {
      this.tagColorAttribute = ''
    },
    presetBadgeColor(badgeColor) {
      this.badgeColorAttribute = badgeColor
    },
    onBadgeColorPicker(badgeColorPicker) {
      this.badgeColorAttribute = badgeColorPicker.hex
    },
    clearBadgeColor() {
      this.badgeColorAttribute = ''
    },
    onTextColorPicker(textColorPicker) {
      this.textColorAttribute = textColorPicker.hex
    },
    clearTextColor() {
      this.textColorAttribute = ''
    },
    createdFormCallback(attributes) {
      this.form.setFieldsValue({ dictCode: attributes.dictCode })
      this.languagesAttribute = {}
      this.tagColorAttribute = ''
      this.textColorAttribute = ''
    },
    echoDataProcess(data) {
      let attributes = data.attributes
      if (!attributes.languages) {
        attributes.languages = {}
      }
      this.languagesAttribute = attributes.languages

      if (!attributes.tagColor) {
        attributes.tagColor = ''
      }
      this.tagColorAttribute = attributes.tagColor

      if (!attributes.textColor) {
        attributes.textColor = ''
      }
      this.textColorAttribute = attributes.textColor

      if (!attributes.badgeColor) {
        attributes.badgeColor = ''
      }
      this.badgeColorAttribute = attributes.badgeColor

      if (!attributes.badgeStatus) {
        attributes.badgeStatus = 'default'
      }
      this.badgeStatus = attributes.badgeStatus
    },
    submitDataProcess(submitData) {
      submitData.attributes = {
        tagColor: this.tagColorAttribute,
        badgeColor: this.badgeColorAttribute,
        badgeStatus: this.badgeStatus,
        textColor: this.textColorAttribute,
        languages: this.languagesAttribute
      }
      return submitData
    }
  }
}
</script>

<style scoped lang="less">
.ant-form-item {
  margin-bottom: 14px;
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
