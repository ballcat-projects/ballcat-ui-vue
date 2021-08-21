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

export default {
  mixins: [AppDeviceEnquire],
  data () {
    return {}
  },
  computed: {
    ...mapGetters(['lang']),
    locale () {
      return enableI18n ? this.$i18n.getLocaleMessage(this.lang).antLocale : null
    }
  },
  mounted () {

  }
}
</script>
<style>
#app {
  height: 100%;
}
</style>
