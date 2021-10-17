<template>
  <div :form="form">
    <a-card title="基础配置" class="antd-pro-pages-form-advanced-form-style-card">
      <a-form-item v-if="isUpdateForm" style="display: none">
        <a-input v-decorator="['id']" />
      </a-form-item>

      <a-row :gutter="4" class="form-row">
        <a-col :span="4">
          <a-form-item label="标题" extra="标题不能为纯空白字符">
            <a-input v-decorator="['title', decoratorOptions.title]" />
          </a-form-item>
        </a-col>
        <a-col :span="4">
          <a-form-item extra="关键字,唯一,加载lov数据时通过关键字加载" label="关键字">
            <a-input
              v-decorator="['keyword', decoratorOptions.keyword]"
              placeholder="关键字,唯一,加载lov数据时通过关键字加载"
            />
          </a-form-item>
        </a-col>
        <a-col :span="4">
          <a-form-item extra="请保证字段值是唯一" label="唯一字段">
            <a-input v-decorator="['key', decoratorOptions.key]" placeholder="数据的主键或唯一键" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-card>

    <a-card title="请求配置" class="antd-pro-pages-form-advanced-form-style-card">
      <a-row :gutter="4" class="form-row">
        <a-col :span="16">
          <a-form-item extra="获取数据时请求路径" label="请求路径">
            <a-input v-decorator="['url', decoratorOptions.url]" placeholder="获取数据时请求路径" />
          </a-form-item>
        </a-col>
        <a-col :span="4">
          <a-form-item extra="http请求方式" label="请求方式">
            <dict-select
              v-decorator="['method', decoratorOptions.method]"
              :allow-clear="false"
              dict-code="lov_http_method"
              placeholder="请求方式"
            />
          </a-form-item>
        </a-col>
        <a-col :span="4">
          <a-form-item extra="http请求参数位置" label="参数位置">
            <dict-radio-group
              v-decorator="['position', decoratorOptions.position]"
              dict-code="lov_http_params_position"
              placeholder="http请求参数位置"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item extra="固定请求参数,单击按钮以配置值" label="固定请求参数">
            <a-input-group compact>
              <a-input
                style="cursor: pointer;width: 50px;"
                type="button"
                value="配置"
                @click="showFixedParams"
              />
              <a-input
                v-decorator="['fixedParams', decoratorOptions.fixedParams]"
                disabled
                placeholder="固定请求参数"
                style="width: calc(100% - 50px)"
              />
            </a-input-group>
          </a-form-item>
        </a-col>
      </a-row>

      <a-modal
        :visible="visible"
        title="配置固定请求参数"
        @cancel="visible = false"
        @ok="configFixedParams"
      >
        <a-button style="margin-bottom: 5px;" @click="addFixedParams">新增</a-button>
        <a-input-group v-for="(item, index) in fp" :key="`${index}`" compact>
          <a-input
            v-model="item.key"
            :class="item.ke ? 'validator-error' : ''"
            addon-before="key"
            style="width: 150px"
          />
          <a-input
            v-model="item.val"
            :class="item.ve ? 'validator-error' : ''"
            addon-before="value"
            style="width: calc(100% - 200px)"
          />
          <a-button style="color: red" title="删除" @click="fp.splice(index, 1)">
            <a-icon type="minus-circle" />
          </a-button>
        </a-input-group>
      </a-modal>
    </a-card>

    <a-card title="核心设置" class="antd-pro-pages-form-advanced-form-style-card">
      <a-row :gutter="4" class="form-row">
        <a-col :span="4">
          <a-form-item extra="是否多选" label="多选">
            <dict-radio-group v-decorator="['multiple', decoratorOptions.multiple]" dict-code="yes_or_no" />
          </a-form-item>
        </a-col>

        <a-col :span="4">
          <a-form-item label="retField" extra="返回字段">
            <a-input v-decorator="['retField', decoratorOptions.retField]" />
          </a-form-item>
        </a-col>
        <a-col :span="4">
          <a-form-item label="返回数据" extra="是否需要返回数据,false则不会有确定按钮">
            <dict-radio-group v-decorator="['ret', decoratorOptions.ret]" dict-code="yes_or_no" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
export default {
  name: 'FormBasic',
  props: {
    isUpdateForm: {
      type: Boolean,
      required: true
    },
    form: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      visible: false,
      // 固定配置参数
      fp: [],
      decoratorOptions: {
        title: {
          rules: [{ required: true, whitespace: true, message: '请填写标题' }]
        },
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
        retField: {
          rules: [{ required: true, message: '返回字段不能为空' }],
          initialValue: 'id'
        },
        method: {
          rules: [{ required: true, message: '请选择请求方式' }],
          initialValue: 'GET'
        },
        position: {
          initialValue: 'PARAMS'
        },
        multiple: { initialValue: 0 },
        search: { initialValue: 1 },
        ret: { initialValue: 1 }
      }
    }
  },
  methods: {
    addFixedParams() {
      const res = this.checkFp(this.fp[this.fp.length - 1])
      if (res.ke || res.ve) {
        this.$message.warn('请正确填写数据')
      } else {
        this.fp.push({ key: '', value: '', ke: false, ve: false })
      }
    },
    showFixedParams() {
      // 获取现有参数
      const json = JSON.parse(this.form.getFieldValue('fixedParams'))
      let arr = []
      Object.keys(json).forEach(key => {
        arr.push({ key, val: json[key], ke: false, ve: false })
      })

      this.fp = [].concat(arr)
      this.visible = true
    },
    configFixedParams() {
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
      this.form.setFieldsValue({ fixedParams: JSON.stringify(json) })
      this.visible = false
    },
    checkFp(item) {
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

<style lang="less"></style>
