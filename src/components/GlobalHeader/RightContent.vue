<template>
  <div class="ballcat-global-header-tool-right">
    <a href="http://www.ballcat.cn" target="_blank" style="color: inherit;">
      <span class="ballcat-global-header-tool-action">
        <a-icon type="question-circle" />
      </span>
    </a>

    <screenfull id="screenfull" class="ballcat-global-header-tool-action" />

    <notice-icon class="ballcat-global-header-tool-action" />

    <user-account-dropdown class="ballcat-global-header-tool-action" />

    <lang-select v-if="enableI18n" class="ballcat-global-header-tool-action" />

    <!--    <lang-select class="ballcat-global-header-tool-action" />-->
    <span v-if="enableLayoutSetting" class="ballcat-global-header-tool-action" @click="showSettingDrawer">
      <a-icon type="more" style="font-size: 16px; font-weight: bolder" />
      <setting-drawer ref="settingDrawer" :show-handle="false" />
    </span>
  </div>
</template>

<script>
import Screenfull from '@/components/Screenfull'
import NoticeIcon from '@/components/GlobalHeader/NoticeIcon'
import UserAccountDropdown from '@/components/GlobalHeader/AvatarDropdown'
import LangSelect from '@/components/GlobalHeader/LangSelect'
import SettingDrawer from '@/components/SettingDrawer/SettingDrawer'
import projectConfig from '@/config/projectConfig'

export default {
  name: 'GlobalHeaderToolRight',
  components: {
    SettingDrawer,
    NoticeIcon,
    Screenfull,
    UserAccountDropdown,
    LangSelect
  },
  data() {
    return {
      enableI18n: projectConfig.enableI18n,
      enableLayoutSetting: projectConfig.enableLayoutSetting
    }
  },
  methods: {
    showSettingDrawer() {
      this.$refs.settingDrawer.showDrawer()
    }
  }
}
</script>
