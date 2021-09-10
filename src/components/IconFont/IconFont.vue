<template>
  <icon-dom
    :type="type && type.startsWith(iconPrefix) ? type : `${iconPrefix}${type}`"
    :spin="spin"
    :rotate="rotate"
    :component="component"
  />
</template>

<script>
import { Icon } from 'ant-design-vue'
import { iconFontUrl, iconPrefix } from '@/config/projectConfig'

const IconDom = Icon.createFromIconfontCN({ scriptUrl: iconFontUrl })

export default {
  name: 'IconFont',
  components: {
    IconDom
  },
  props: {
    type: {
      type: String,
      default: () => {
        return ''
      }
    },
    spin: {
      type: Boolean,
      default: () => false
    },
    rotate: {
      type: Number,
      default: () => undefined
    },
    component: {
      type: Object,
      default: () => undefined
    }
  },
  data() {
    return {
      iconPrefix
    }
  }
}
</script>

<style></style>
