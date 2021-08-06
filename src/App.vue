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

export default {
  mixins: [AppDeviceEnquire],
  data () {
    return {}
  },
  computed: {
    ...mapGetters(["lang"]),
    locale () {
      return this.$i18n.getLocaleMessage(this.lang).antLocale
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
