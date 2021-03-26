<template>
  <a-card style="margin-top: 5px" title="搜索组件配置">
    <a-button style="margin-bottom: 5px;margin-top: 5px;" @click="visible=true">新增搜索组件</a-button>

    <div v-for="(item,index) in searchItems" :key="item.field" style="margin-bottom: 5px;">
      <a-input-group compact>
        <a-input
          :value="item.label"
          addon-before="标签"
          read-only
          style="width: 150px"
        />
        <a-input
          :value="item.field"
          addon-before="字段"
          read-only
          style="width: 200px"
        />
        <a-input
          :value="item.tag"
          addon-before="标签"
          read-only
          style="width: 200px"
        />
        <a-input
          v-if="item.tag==='INPUT_NUMBER'"
          :value="item.min"
          addon-before="min"
          read-only
          style="width: 100px"
        />
        <a-input
          v-if="item.tag==='INPUT_NUMBER'"
          :value="item.max"
          addon-before="max"
          read-only
          style="width: 100px"
        />
        <a-input
          v-if="item.tag==='DICT_SELECT'"
          :value="item.dictCode"
          addon-before="dictCode"
          read-only
          style="width: 200px"
        />
        <a-button style="color: blue;margin-top: -1px;" title="编辑" @click="json=item;editIndex=index;visible=true">
          <a-icon type="edit" />
        </a-button>
        <a-button style="color: red;margin-top: -1px;" title="删除" @click="delSearchItem(1)">
          <a-icon type="minus-circle" />
        </a-button>
      </a-input-group>
    </div>

    <!-- 不知道为什么，如果删除下面这个，就有问题 -->
    <a-divider style="display: none" />

    <a-modal
      :visible="visible"
      :width="800"
      title="新增搜索组件"
      @cancel="visible=false"
      @ok="createSearch"
    >
      <a-row :gutter="4" class="form-row">
        <a-col :span="4">
          <a-form-item label="标签" required>
            <a-input v-model="json.label" :class="json.le?'validator-error':''" />
          </a-form-item>
        </a-col>
        <a-col :span="4">
          <a-form-item extra="字段" label="字段" required>
            <a-input v-model="json.field" :class="json.fe?'validator-error':''" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item extra="html 标签" label="html 标签" required>
            <dict-select v-model="json.tag" :class="json.te?'validator-error':''" dict-code="lov_search_tag" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item extra="placeholder" label="placeholder">
            <a-input v-model="json.placeholder" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row v-if="json.tag!=='INPUT_TEXT'" :gutter="4" class="form-row">
        <a-col v-if="json.tag==='INPUT_NUMBER'" :span="8">
          <a-form-item extra="最小值" label="最小值">
            <a-input v-model="json.min" />
          </a-form-item>
        </a-col>
        <a-col v-if="json.tag==='INPUT_NUMBER'" :span="8">
          <a-form-item extra="最大值" label="最大值">
            <a-input v-model="json.max" />
          </a-form-item>
        </a-col>
        <a-col v-if="json.tag==='DICT_SELECT'" :span="12">
          <a-form-item extra="dictCode" label="dictCode" required>
            <a-input v-model="json.dictCode" :class="json.de?'validator-error':''" />
          </a-form-item>
        </a-col>
        <a-col v-if="json.tag==='SELECT'" :span="24">
          <a-form-item extra="select所有选项" label="options" required>
            <a-button
              @click="optionsCheck(json.options)&&json.options.push({key:`${json.options.length+1}`,value:undefined, label: undefined})"
            >
              新增选项
            </a-button>
            <a-input-group v-for="(option,index) in json.options" :key="option.key" compact>
              <a-input v-model="option.key" addon-before="key" style="width: 150px" />
              <a-input v-model="option.label" addon-before="label" style="width: 150px" />
              <a-input v-model="option.value" addon-before="value" style="width: 150px" />
              <a-button style="color: red;" title="删除" @click="json.options.splice(index,1)">
                <a-icon type="minus-circle" />
              </a-button>
            </a-input-group>
          </a-form-item>
        </a-col>
      </a-row>
    </a-modal>
  </a-card>
</template>

<script>

export default {
  name: 'FormSearch',
  props: {
    formAction: String,
    getForm: Function,
    form: Object
  },
  data () {
    return {
      searchItems: [],
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
    reset(value){
      this.searchItems = value
      this.$emit('input', this.searchItems)
    },
    optionsCheck (options) {
      for (let i = 0; i < options.length; i++) {
        let item = options[i]
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

      if (typeof this.editIndex !== 'number') {
        this.searchItems.push({ ...this.json })
        this.$emit('input', this.searchItems)
      }
      this.json = { tag: 'INPUT_TEXT', options: [] }
      this.editIndex = undefined
      this.visible = false
    },
    delSearchItem(index) {
      this.searchItems.splice(index,1)
      this.$emit('input', this.searchItems)
    }
  }
}
</script>

<style lang='less' scoped>
.validator-error {
  border-color: red;
}
</style>
