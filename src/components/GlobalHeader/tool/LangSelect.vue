<template>
  <a-dropdown>
    <span style="font-size: 16px">
      <a-icon :component="i18nIcon" />
    </span>
    <template #overlay>
      <a-menu
        style="width: 150px;"
        :selected-keys="selectedKeys"
        @click="switchLang"
      >
        <a-menu-item key="zh-CN">
          <span role="img" aria-label="简体中文">🇨🇳</span> 简体中文
        </a-menu-item>
        <a-menu-item key="en-US">
          <span role="img" aria-label="English">🇺🇸</span> English
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script>
import { i18nIcon } from '@/core/icons'
import { switchLanguage } from '@/locales'
import { mapActions, mapGetters } from 'vuex'
import router, { resetRouter } from '@/router'

export default {
  name: 'LangSelect',
  data () {
    return {
      i18nIcon
    }
  },
  computed: {
    ...mapGetters(['lang', 'userRouters']),
    selectedKeys() {
      return [this.lang]
    }
  },
  methods: {
    ...mapActions(['GenerateRoutes']),
    switchLang (row) {
      const newLang = row.key
      if (this.lang !== newLang) {
        // 切换国际化配置
        switchLanguage(newLang)
        // 切换菜单/路由的国际化
        this.GenerateRoutes().then(() => {
          // 重置路由
          resetRouter()
          router.addRoutes(this.userRouters)
          // 发送切换语言事件，多页签会接收此事件，进行多语言切换
          this.$bus.$emit('switch-language', newLang)
        })
      }
    }
  }
}
</script>
