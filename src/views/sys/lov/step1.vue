<template>
  <div>
    <a-form-item v-if="formAction === this.FORM_ACTION.UPDATE" style="display: none">
      <a-input v-decorator="['id']"/>
    </a-form-item>

    <a-row class="form-row" :gutter="4">
      <a-col :span="4">
        <a-form-item label="关键字" extra="关键字,唯一,加载lov数据时通过关键字加载">
          <a-input placeholder="关键字,唯一,加载lov数据时通过关键字加载"
                   v-decorator="['keyword',decoratorOptions.keyword]"/>
        </a-form-item>
      </a-col>
      <a-col :span="4">
        <a-form-item label="请求路径" extra="获取数据时请求路径">
          <a-input placeholder="获取数据时请求路径" v-decorator="['url',decoratorOptions.url]"/>
        </a-form-item>
      </a-col>
      <a-col :span="4">
        <a-form-item label="key" extra="数据的主键或唯一键">
          <a-input placeholder="数据的主键或唯一键" v-decorator="['key',decoratorOptions.key]"/>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="固定请求参数" extra="固定请求参数,单击按钮以配置值">
          <a-input-group compact>
            <a-input type="button" style="cursor: pointer;width: 50px;" value="配置" @click="showFixedParams"/>
            <a-input disabled style="width: calc(100% - 50px)" placeholder="固定请求参数" v-decorator="['fixedParams',decoratorOptions.fixedParams]"/>
          </a-input-group>
        </a-form-item>
      </a-col>
    </a-row>

    <a-row class="form-row" :gutter="4">
      <a-col :span="4">
        <a-form-item label="retField" extra="返回数据的字段">
          <a-input v-decorator="['retField',decoratorOptions.retField]"/>
        </a-form-item>
      </a-col>
      <a-col :span="6">
        <a-form-item label="数据类型" extra="返回字段数据类型">
          <dict-radio-group
            v-decorator="['retFieldDataType',decoratorOptions.retFieldDataType]"
            dict-code="lov_ret_data_type"
          />
        </a-form-item>
      </a-col>
      <a-col :span="4">
        <a-form-item label="返回数据" extra="是否需要返回数据,false则不会有确定按钮">
          <dict-radio-group
            v-decorator="['ret',decoratorOptions.ret]"
            dict-code="tf"
          />
        </a-form-item>
      </a-col>
      <a-col :span="4">
        <a-form-item label="多选" extra="是否需要多选">
          <dict-radio-group
            v-decorator="['multiple',decoratorOptions.multiple]"
            dict-code="tf"
          />
        </a-form-item>
      </a-col>
      <a-col :span="4">
        <a-form-item label="搜索" extra="是否需要搜索">
          <dict-radio-group
            v-decorator="['search',decoratorOptions.search]"
            dict-code="tf"
          />
        </a-form-item>
      </a-col>
    </a-row>

    <a-row class="form-row" :gutter="4">
      <a-col :span="6">
        <a-form-item label="请求方式" extra="http请求方式">
          <dict-select
            placeholder="请求方式"
            v-decorator="['method',decoratorOptions.method]"
            dict-code="lov_http_method"
          />
        </a-form-item>
      </a-col>
      <a-col :span="6">
        <a-form-item label="参数位置" extra="http请求参数位置">
          <dict-radio-group
            placeholder="http请求参数位置"
            v-decorator="['position',decoratorOptions.position]"
            dict-code="lov_http_params_position"
          />
        </a-form-item>
      </a-col>
    </a-row>

    <a-modal :visible="visible" @cancel="visible=false" @ok="configFixedParams" title="配置固定请求参数">
      <a-button style="margin-bottom: 5px;" @click="addFixedParams">新增</a-button>
      <a-input-group compact v-for="(item,index) in fp" :key="`${index}`">
        <a-input :class="item.ke?'validator-error':''" addonBefore="key" style="width: 150px" v-model="item.key"/>
        <a-input :class="item.ve?'validator-error':''" addonBefore="value" style="width: calc(100% - 200px)" v-model="item.val"/>
        <a-button style="color: red" @click="fp.splice(index,1)" title="删除">
          <a-icon type="minus-circle"/>
        </a-button>
      </a-input-group>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: 'step1',
  props: {
    formAction: String,
    getForm: Function
  },
  data () {
    return {
      visible: false,
      // 固定配置参数
      fp: [],
      decoratorOptions: {
        keyword: {
          rules: [{ required: true, message: '请填写关键字' }]
        },
        url: {
          rules: [{ required: true, message: '请填写url' }]
        },
        fixedParams: {
          initialValue: '{}'
        },
        key: {
          rules: [{ required: true, message: '请填写key' }],
          initialValue: 'id'
        },
        method: {
          rules: [{ required: true, message: '请选择请求方式' }],
          initialValue: 'GET'
        },
        position: {
          initialValue: 'PARAMS'
        },
        retFieldDataType: {
          initialValue: 1
        },
        multiple: { initialValue: 0 },
        search: { initialValue: 1 },
        ret: { initialValue: 1 }
      }
    }
  },
  methods: {
    addFixedParams () {
      const res = this.checkFp(this.fp[this.fp.length - 1])
      if (res.ke || res.ve) {
        this.$message.warn('请正确填写数据')
      } else {
        this.fp.push({ key: '', value: '', ke: false, ve: false })
      }
    },
    showFixedParams () {
      // 获取现有参数
      const json = JSON.parse(this.getForm().getFieldValue('fixedParams'))
      let arr = []
      Object.keys(json).forEach(key => {
        arr.push({ key, val: json[key], ke: false, ve: false })
      })

      this.fp = [].concat(arr)
      this.visible = true
    },
    configFixedParams () {
      const json = {}

      for (let i = 0; i < this.fp.length; i++) {
        let item = this.checkFp(this.fp[i])
        // 校验未通过
        if (item.ke || item.ve) {
          this.$message.error('您填写的数据未通过校验')
          return
        }
        // 存储通过校验数据
        json[item.key] = item.val
      }
      this.getForm().setFieldsValue({ fixedParams: JSON.stringify(json) })
      this.visible = false
    },
    checkFp (item) {
      if (!item) {
        return {}
      }
      item.ke = !item.key || item.key.trim().length === 0
      item.ve = !item.val || item.val.trim().length === 0
      return item
    }
  }
}
</script>

<style lang="less">
</style>
