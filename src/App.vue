<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view />
    </div>
  </a-config-provider>
</template>

<script>
import { AppDeviceEnquire } from '@/utils/mixin'
import { mapGetters } from 'vuex'
import { enableI18n } from '@/config/projectConfig'
import themeColor from '@/components/SettingDrawer/themeColor'
import { updateColorWeak } from '@/components/SettingDrawer/settingConfig'

export default {
  mixins: [AppDeviceEnquire],
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['lang', 'primaryColor', 'colorWeak']),
    locale() {
      return enableI18n ? this.$i18n.getLocaleMessage(this.lang).antLocale : this.$defaultAntLocale
    }
  },
  created() {
    themeColor.changeColor(this.primaryColor)
  },
  mounted() {
    updateColorWeak(this.colorWeak)
  }
}
</script>
<style>
#app {
  height: 100%;
}
</style>
