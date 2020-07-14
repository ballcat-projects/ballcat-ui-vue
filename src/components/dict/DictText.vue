<template>
  <span>{{dictObj[value]? dictObj[value]: value}}</span>
</template>
<script>
  export default {
    name: 'DictText',
    props: {
      value: [Number, String],
      dictCode: String,
      color: String
    },
    data() {
      return {
        dictObj: {}
      }
    },
    mounted() {
      let dictList = this.DictPool.dictDataCache[this.dictCode]
      dictList && (this.dictObj = this.DictPool.listToObj(dictList))
    },
    methods: {}
  }
</script>
