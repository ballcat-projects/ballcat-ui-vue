<script>
import { mapActions } from 'vuex'

export default {
  name: 'GlobalWebSocketListener',
  data () {
    return {
      handlers: [
        {
          // 字典更新事件
          type: 'dict-change',
          handle: () => {
            this.checkDictStatus()
          }
        }
      ]
    }
  },
  created () {
    // 注册监听事件
    this.handlers.forEach((handler) => {
      this.$bus.$on(handler.type, handler.handle)
    })
  },
  destroyed () {
    // 取消监听事件
    this.handlers.forEach((handler) => {
      this.$bus.$off(handler.type, handler.handle)
    })
  },
  methods: {
    ...mapActions(['checkDictStatus'])
  },
  render () {
    return null
  }
}
</script>
