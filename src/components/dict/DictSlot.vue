<template>
  <a-tag :color="colors[value] || uniformColor">{{dictObj[value]? dictObj[value]: value}}</a-tag>
</template>
<script>
  export default {
    name: 'DictSlot',
    props: {
      value: [Number, String],
      dictCode: String,
      colors: {
        type: Object,
        default: function () {
          return {}
        }
      },
      uniformColor: String
    },
    data() {
      return {
        dictObj: {},
      }
    },
    mounted() {
      let dictList = this.DictPool.dictDataCache[this.dictCode]
      dictList && (this.dictObj = this.DictPool.listToObj(dictList))
    },
    methods: {}
    // watch: {
    //   'DictPool.dictDataCache': {
    //     handler(dictDataCache) {
    //       // 当有属性，且不是当前所需的属性被改变时，才进行改变
    //       let dictList = dictDataCache[this.dictCode]
    //       if (dictList && dictList !== this.dictList) {
    //         this.dictList = dictList
    //         this.dictObj = this.DictPool.listToObj(dictList)
    //       }
    //     },
    //     immediate: true,
    //     deep: true
    //   }
    // },
  }
</script>
