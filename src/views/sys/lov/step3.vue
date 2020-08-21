<template>
  <div>
    <a-button @click="visible=true" style="margin-bottom: 5px;margin-top: 5px;">新增搜索组件</a-button>

    <div v-for="(item,index) in value" :key="item.field" style="margin-bottom: 5px;">
      <a-input-group compact>
        <a-input read-only addonBefore="标签" style="width: 150px" :value="item.label"/>
        <a-input read-only addonBefore="字段" style="width: 200px" :value="item.field"/>
        <a-input read-only addonBefore="标签" style="width: 200px" :value="item.tag"/>
        <a-input read-only v-if="item.tag==='INPUT_NUMBER'" addonBefore="min" style="width: 100px" :value="item.min"/>
        <a-input read-only v-if="item.tag==='INPUT_NUMBER'" addonBefore="max" style="width: 100px" :value="item.max"/>
        <a-input read-only v-if="item.tag==='DICT_SELECT'" addonBefore="dictCode" style="width: 200px" :value="item.dictCode"/>
        <a-button style="color: blue;margin-top: -1px;" @click="json=item;editIndex=index;visible=true" title="编辑">
          <a-icon type="edit"/>
        </a-button>
        <a-button style="color: red;margin-top: -1px;" @click="value.splice(index,1)" title="删除">
          <a-icon type="minus-circle"/>
        </a-button>
      </a-input-group>
    </div>

    <!-- 不知道为什么，如果删除下面这个，就有问题 -->
    <a-divider style="display: none"/>

    <a-modal title="新增搜索组件" :visible="visible" @cancel="visible=false" :width="800" @ok="createSearch">
      <a-row class="form-row" :gutter="4">
        <a-col :span="4">
          <a-form-item label="标签" required>
            <a-input :class="json.le?'validator-error':''" v-model="json.label"/>
          </a-form-item>
        </a-col>
        <a-col :span="4">
          <a-form-item label="字段" extra="字段" required>
            <a-input :class="json.fe?'validator-error':''" v-model="json.field"/>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="html 标签" extra="html 标签" required>
            <dict-select :class="json.te?'validator-error':''" dict-code="lov_search_tag" v-model="json.tag"/>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row class="form-row" :gutter="4" v-if="json.tag!=='INPUT_TEXT'">
        <a-col :span="8" v-if="json.tag==='INPUT_NUMBER'">
          <a-form-item label="最小值" extra="最小值">
            <a-input v-model="json.min"/>
          </a-form-item>
        </a-col>
        <a-col :span="8" v-if="json.tag==='INPUT_NUMBER'">
          <a-form-item label="最大值" extra="最大值">
            <a-input v-model="json.max"/>
          </a-form-item>
        </a-col>
        <a-col :span="12" v-if="json.tag==='DICT_SELECT'">
          <a-form-item label="dictCode" extra="dictCode" required>
            <a-input :class="json.de?'validator-error':''" v-model="json.dictCode"/>
          </a-form-item>
        </a-col>
        <a-col :span="24" v-if="json.tag==='SELECT'">
          <a-form-item label="options" extra="select所有选项" required>
            <a-button @click="optionsCheck(json.options)&&json.options.push({key:`${json.options.length+1}`,value:undefined, label: undefined})">新增选项
            </a-button>
            <a-input-group compact v-for="(option,index) in json.options" :key="option.key">
              <a-input addonBefore="key" style="width: 150px" v-model="option.key"/>
              <a-input addonBefore="label" style="width: 150px" v-model="option.label"/>
              <a-input addonBefore="value" style="width: 150px" v-model="option.value"/>
              <a-button style="color: red;" @click="json.options.splice(index,1)" title="删除">
                <a-icon type="minus-circle"/>
              </a-button>
            </a-input-group>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row class="form-row" :gutter="4">
        <a-col :span="8">
          <a-form-item label="placeholder" extra="placeholder">
            <a-input v-model="json.placeholder"/>
          </a-form-item>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script>

export default {
  name: 'step2',
  props: {
    value: {
      type: Array,
      default: []
    },
    formAction: String,
    getForm: Function
  },
  data () {
    return {
      visible: false,
      editIndex: undefined,
      json: {
        label: null,
        field: null,
        tag: 'INPUT_TEXT',
        options: [],
        placeholder: null,
        min: null,
        max: null,
        dictCode: null
      }
    }
  },
  methods: {
    optionsCheck (options) {
      for (let i = 0; i < options.length; i++) {
        let item = options[i]
        console.log(item)
        if (!item.key || item.key.trim().length === 0) {
          this.$message.error('选项key不能为空')
          return false
        }
        if (!item.value || item.value.trim().length === 0) {
          this.$message.error('选项value不能为空')
          return false
        }
        if (!item.label || item.label.trim().length === 0) {
          this.$message.error('选项label不能为空')
          return false
        }
      }
      console.log('success')
      return true
    },
    createSearch () {
      const json = { ...this.json }
      json.le = !json.label || json.label.trim().length === 0
      json.fe = !json.field || json.field.trim().length === 0
      json.te = !json.tag || json.tag.trim().length === 0
      json.de = json.tag === 'DICT_SELECT' && (!json.dictCode || json.dictCode.trim().length === 0)
      if (json.le || json.fe || json.pe || json.de) {
        this.json = { ...json }
        this.$message.error('输入内容未通过校验，请检查并修改后重试')
        return
      }
      if (json.te) {
        this.$message.error('请选择html标签')
        return
      }

      if (json.tag === 'SELECT') {
        if (json.options.length === 0) {
          this.$message.error('select标签至少需要一个选项')
          return
        }

        if (!this.optionsCheck(json.options)) {
          // option 校验未通过
          return
        }
      }

      if (typeof this.editIndex === 'number') {

      } else {
        this.value.push({ ...this.json })
      }
      this.json = { tag: 'INPUT_TEXT', options: [] }
      this.editIndex = undefined
      this.visible = false
    }
  }
}
</script>

<style scoped lang='less'>
.validator-error {
  border-color: red;
}
</style>