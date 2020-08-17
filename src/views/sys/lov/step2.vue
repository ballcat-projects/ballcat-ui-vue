<template>
  <div>
    <a-button @click="visible=true" style="margin-bottom: 5px;margin-top: 5px;">新增表格列</a-button>

    <div v-for="(item,index) in value" :key="item.field" style="margin-bottom: 5px;">
      <a-input-group compact>
        <a-input read-only addonBefore="标题" style="width: 200px" :value="item.title"/>
        <a-input read-only addonBefore="字段" style="width: 200px" :value="item.field"/>
        <a-input read-only addonBefore="索引" style="width: 100px" :value="item.index"/>
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

    <a-modal title="新增表格列" :visible="visible" @cancel="visible=false" :width="800" @ok="createBody">
      <a-row class="form-row" :gutter="4">
        <a-col :span="4">
          <a-form-item label="标题" required>
            <a-input :class="json.te?'validator-error':''" v-model="json.title"/>
          </a-form-item>
        </a-col>
        <a-col :span="4">
          <a-form-item label="字段" extra="字段, 同一lov下，field不可重复`" required>
            <a-input :class="json.fe?'validator-error':''" v-model="json.field"/>
          </a-form-item>
        </a-col>
        <a-col :span="4">
          <a-form-item label="索引" extra="用来排序，索引值小的在左边" required>
            <a-input-number :class="json.ie?'validator-error':''" style="width: 100%" :min="1" v-model="json.index"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="自定义属性" extra="请确保为一个正确的json字符串">
            <a-textarea :class="json.pe?'validator-error':''" :rows="4" v-model="json.property"/>
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
        title: '',
        field: '',
        index: 1,
        property: '{}'
      }
    }
  },
  methods: {
    createBody () {
      const json = {...this.json}
      json.te = !json.title || json.title.trim().length === 0
      json.fe = !json.field || json.field.trim().length === 0
      json.ie = !json.index || json.index < 1
      json.pe = !json.property || !json.property.startsWith('{') || !json.property.endsWith('}') || json.property.trim().length === 0
      try {
        JSON.parse(json.property)
      } catch (e) {
        json.pe = true
      }

      // 如果是添加则需要校验字段
      if (typeof this.editIndex !== 'number') {
        this.value.forEach(item => {
          if (item.field === json.field) {
            json.fe = true
          }
        })
      }

      if (json.te || json.fe || json.ie || json.pe) {
        this.json = { ...json }
        this.$message.error('输入内容未通过校验，请检查并修改后重试')
        return
      }

      if (typeof this.editIndex === 'number') {

      } else {
        this.value.push({ ...this.json })
      }
      this.json = { index: 1, property: '{}' }
      this.editIndex = undefined
      this.visible = false
    }
  }
}
</script>

<style scoped lang='less'>
.validator-error {

  border-color: red;
  z-index: 1;
}
</style>