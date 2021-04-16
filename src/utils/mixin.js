// import Vue from 'vue'
import { deviceEnquire, DEVICE_TYPE } from '@/utils/device'
import { mapMutations, mapState, mapGetters } from 'vuex'
import { APP_MUTATIONS } from '@/store/mutation-types'

// const mixinsComputed = Vue.config.optionMergeStrategies.computed
// const mixinsMethods = Vue.config.optionMergeStrategies.methods

const mixin = {
  computed: {
    ...mapGetters([
      'navTheme',
      'layout',
      'contentWidth',
      'fixedHeader',
      'fixSiderbar',
      'primaryColor',
      'colorWeak',
      'multiTab'
    ])
  },
}

const mixinDevice = {
  computed: {
    ...mapGetters(['device']),
    isMobile () {
      return this.device === DEVICE_TYPE.MOBILE
    },
    isDesktop () {
      return this.device === DEVICE_TYPE.DESKTOP
    },
    isTablet () {
      return this.device === DEVICE_TYPE.TABLET
    }
  }
}

const AppDeviceEnquire = {
  mounted () {
    deviceEnquire(deviceType => {
      // 切换设备类型
      this[APP_MUTATIONS.TOGGLE_DEVICE](deviceType)
    })
  },
  methods: {
    ...mapMutations([
      APP_MUTATIONS.TOGGLE_DEVICE,
      APP_MUTATIONS.TOGGLE_SIDE_BAR_COLLAPSED
    ])
  }
}

export { mixin, AppDeviceEnquire, mixinDevice }
