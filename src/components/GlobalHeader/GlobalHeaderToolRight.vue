<template>
  <div class="ballcat-global-header-tool-right">

    <a href="http://www.ballcat.cn" target="_blank" style="color: inherit;">
      <span class="ballcat-global-header-tool-action">
        <a-icon type="question-circle-o" />
      </span>
    </a>

    <screenfull id="screenfull" class="ballcat-global-header-tool-action" />

    <notice-icon class="ballcat-global-header-tool-action" />

    <user-account-dropdown class="ballcat-global-header-tool-action" />

    <lang-select class="ballcat-global-header-tool-action" />
  </div>
</template>

<script>
import Screenfull from '@/components/Screenfull'
import NoticeIcon from '@/components/GlobalHeader/tool/NoticeIcon'
import LangSelect from '@/components/GlobalHeader/tool/LangSelect'
import UserAccountDropdown from '@/components/GlobalHeader/tool/AvatarDropdown'

export default {
  name: 'GlobalHeaderToolRight',
  components: {
    LangSelect,
    NoticeIcon,
    Screenfull,
    UserAccountDropdown
  },

  methods: {}
}
</script>
