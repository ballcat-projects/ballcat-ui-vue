<template>
  <div ref="editor"></div>
</template>

<script>
import WEditor from 'wangeditor'

export default {
  name: 'WangEditor',
  props: {
    // eslint-disable-next-line
    value: {
      type: String
    }
  },
  data () {
    return {
      editor: null,
      editorData: ''
    }
  },
  watch: {
    value (val) {
      this.editorData = val
      if (val !== this.editor.txt.html()) {
        this.editor.txt.html(val)
      }
    }
  },
  mounted () {
    this.initEditor()
  },
  beforeDestroy () {
    // 调用销毁 API 对当前编辑器实例进行销毁
    this.editor.destroy()
    this.editor = null
  },
  methods: {
    initEditor () {
      const editor = new WEditor(this.$refs.editor)
      // 配置 onchange 回调函数，将数据同步到 vue 中
      editor.config.onchange = (newHtml) => {
        this.editorData = newHtml
        // v-decorator 方式的表单值联动
        this.$emit('change', this.editorData)
        // v-model 方式的表单值联动
        this.$emit('input', this.editorData)
      }
      editor.config.zIndex = 500
      // 创建编辑器
      editor.create()
      this.editor = editor
    }
  }
}
</script>
