<template>
  <a-modal
    :title="title"
    :visible="visible"
    :mask-closable="false"
    :centered="true"
    :body-style="{padding: '24px 40px 8px 40px'}"
    :confirm-loading="submitLoading"
    :width="600"
    @ok="handleSubmit"
    @cancel="handleClose"
  >
    <a-form
      :form="form"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >

      <a-form-item label="上级菜单">
        <a-tree-select
          v-decorator="['parentId', decoratorOptions.parentId]"
          placeholder="父菜单"
          :dropdown-style="{ maxHeight: '350px', overflow: 'auto' }"
          :tree-data="nonButtonMenuTree"
          :tree-default-expanded-keys="[0]"
          :replace-fields="{
            key: 'id',
            value: 'id'
          }"
        />
      </a-form-item>

      <a-form-item label="菜单类型">
        <dict-radio-group
          v-decorator="['type', decoratorOptions.type]"
          class="menu-type"
          dict-code="menu_type"
          @change="onTypeChange"
        />
      </a-form-item>

      <a-form-item>
        <span slot="label">
          菜单ID&nbsp;
          <a-tooltip title="菜单ID的长度固定为 6，由三部分构成。前两位是目录序号，中间两位是菜单序号，最后两位是按钮序号。例如目录的ID结构应为：XX0000，菜单结构为 XXXX00，按钮ID结构为 XXXXXX">
            <a-icon type="question-circle-o" />
          </a-tooltip>
        </span>
        <a-input v-decorator="['id', decoratorOptions.id]" :disable="isUpdateForm" />
      </a-form-item>

      <a-row :gutter="16">
        <a-col :xs="24" :sm="24" :md="12">
          <a-form-item label="菜单名称" :label-col="rowLabelCol" :wrapper-col="rowWrapperCol">
            <a-input v-decorator="['title', decoratorOptions.title]" placeholder="菜单名称" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="24" :md="12">
          <a-form-item label="显示排序" :label-col="rowLabelCol" :wrapper-col="rowWrapperCol">
            <a-input-number v-decorator="['sort', decoratorOptions.sort]" placeholder="排序值(升序)" style="width: 100%" />
          </a-form-item>
        </a-col>
      </a-row>

      <template v-if="menuType !== 2">
        <a-row :gutter="16">
          <a-col :xs="24" :sm="24" :md="12">
            <a-form-item label="菜单图标" :label-col="rowLabelCol" :wrapper-col="rowWrapperCol">
              <a-input v-decorator="['icon']" placeholder="请选择">
                <template #prefix>
                  <a-icon v-if="icon" :type="icon" />
                </template>
                <template #addonAfter>
                  <a-icon type="setting" @click="selectIcons" />
                </template>
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="12">
            <a-form-item label="路由地址" :label-col="rowLabelCol" :wrapper-col="rowWrapperCol">
              <a-input v-decorator="['path', decoratorOptions.path]" placeholder="路由地址" />
            </a-form-item>
          </a-col>
        </a-row>
      </template>

      <template v-if="menuType === 1">
        <a-row :gutter="16">
          <a-col :xs="24" :sm="24" :md="12">
            <a-form-item label="打开方式" :label-col="rowLabelCol" :wrapper-col="rowWrapperCol">
              <a-select v-decorator="['targetType', decoratorOptions.targetType]">
                <a-select-option :value="1">
                  内部组件
                </a-select-option>
                <a-select-option :value="2">
                  内嵌页面
                </a-select-option>
                <a-select-option :value="3">
                  外部链接
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="12">
            <a-form-item label="组件缓存" :label-col="rowLabelCol" :wrapper-col="rowWrapperCol">
              <a-radio-group v-decorator="['keepAlive', decoratorOptions.keepAlive]">
                <a-radio :value="1">
                  开启
                </a-radio>
                <a-radio :value="0">
                  关闭
                </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="资源路径">
          <a-input v-decorator="['uri', decoratorOptions.uri]" placeholder="资源路径" />
        </a-form-item>
      </template>


      <!-- 按钮没有显示隐藏一说 -->
      <template v-if="menuType !== 2">
        <a-form-item label="是否可见">
          <a-radio-group v-decorator="['hidden', decoratorOptions.hidden]">
            <a-radio :value="0">
              显示
            </a-radio>
            <a-radio :value="1">
              隐藏
            </a-radio>
          </a-radio-group>
        </a-form-item>
      </template>

      <!-- 按钮才有授权标识 -->
      <template v-if="menuType === 2">
        <a-form-item label="授权标识">
          <a-input v-decorator="['permission', decoratorOptions.permission]" placeholder="授权标识" />
        </a-form-item>
      </template>

      <a-form-item label="备注信息">
        <a-textarea v-decorator="['remarks']" placeholder="最多输入 50 个字符" :auto-size="{minRows: 3, maxRows: 6}" />
      </a-form-item>

    </a-form>

    <icon-selector-modal ref="iconSelectModal" @choose="chooseIcon" />
  </a-modal>
</template>

<script>
import { PopUpFormMixin } from '@/mixins'
import { addObj, putObj } from '@/api/system/menu'
import { IconSelectorModal } from '@/components/IconSelector'

export default {
  name: 'SysMenuModalForm',
  components: { IconSelectorModal },
  mixins: [PopUpFormMixin],
  props: {
    nonButtonMenuTree: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
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
        md: { span: 20 }
      },

      rowLabelCol: {
        sm: { span: 24 },
        md: { span: 8 }
      },
      rowWrapperCol: {
        sm: { span: 24 },
        md: { span: 16 }
      },

      icon: '',
      menuType: 0,

      // 校验配置
      decoratorOptions: {
        id: {
          rules: [
            { required: true, message: '请输入菜单ID!' },
            { validator: this.checkMenuId}
          ]
        },
        parentId: {
          initialValue: 0
        },
        type: {
          initialValue: 0
        },
        title: {
          rules: [{ required: true, message: '请输入菜单名称!' }]
        },
        sort: {
          rules: [{ required: true, message: '请输入一个排序值!' }],
          initialValue: 1
        },
        hidden: {
          initialValue: 0
        },
        path: {
          rules: [
            { required: true, message: '请输入路由地址!' },
            {pattern: /^[a-z0-9-]+$/, message: '仅小写字母、中划线、数字'}
            ],
        },
        targetType: {
          initialValue: 1
        },
        keepAlive: {
          initialValue: 1
        },
        uri: {
          rules: [{ required: true, message: '请输入资源路径!' }],
        },
        permission: {
          rules: [{ required: true, message: '请输入授权标识!' }],
        }
      }
    }
  },
  methods: {
    /**
     * 菜单ID 的规则校验
     */
    checkMenuId(rule, value, callback) {
      let errorMsg = null;

      const idStr = String(value)
      if(idStr.length !== 6){
        callback("菜单长度必须为 6 位！")
        return
      }

      if(this.menuType === 0){
        if(!idStr.endsWith('0000')){
          errorMsg = '目录类型 ID 格式为 XX0000，xx 为目录编号'
        }
      }else if(this.menuType === 1){
        if(!idStr.endsWith('00')){
          errorMsg = '菜单类型 ID 格式为 XXXX00，前两位 XX 为所属目录编号，后两位 XX 为菜单编号'
        }
      }
      errorMsg? callback(errorMsg): callback();
    },
    /**
     * 新建表单的回调
     */
    createdFormCallback (attributes) {
      if(attributes && attributes.formData){
        this.menuType = attributes.formData.type
        this.$nextTick(function () {
          this.form.setFieldsValue(attributes.formData)
        })
      }
    },
    echoDataProcess (record) {
      this.icon = record.icon
      this.menuType = record.type
    },
    onTypeChange(menuType){
      this.menuType = menuType
    },
    selectIcons () {
      this.$refs.iconSelectModal.show()
    },
    chooseIcon (icon) {
      this.icon = icon
      this.form.setFieldsValue({ 'icon': icon })
    }
  }
}
</script>

<style scoped>
.menu-type >>> .ant-radio-wrapper {
  margin-right: 40px;
}
</style>
