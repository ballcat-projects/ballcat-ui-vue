<template>
  <icon-dom :type="type && type.startsWith(iconPrefix) ? type : `${iconPrefix}${type}`" />
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
