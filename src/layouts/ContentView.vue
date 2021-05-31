<template>
  <div v-if="isShowRouter">
    <keep-alive v-if="shouldKeepAlive" :include="keepAliveList">
      <router-view />
    </keep-alive>
    <router-view v-else />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ContentView',
  props: {
    keepAlive: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      isShowRouter: true
    }
  },
  computed: {
    ...mapGetters(['multiTab','keepAliveList']),
    shouldKeepAlive () {
      const meta = this.$route.meta
      if(!this.multiTab && !!meta.keepAlive){
        return false
      }
      return this.keepAlive || this.multiTab || meta.keepAlive
    }
  },
  created () {
    // 注册监听事件
    this.$bus.$on('refresh-content', this.reload)
  },
  destroyed () {
    // 取消监听事件
    this.$bus.$off('refresh-content', this.reload)
  },
  methods: {
    // 刷新 router-view
    reload () {
      this.isShowRouter = false
      this.$nextTick(() => {
        this.isShowRouter = true
      })
    }
  }
}
</script>
