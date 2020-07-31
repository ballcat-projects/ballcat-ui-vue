<template>
  <a-tag :color="colors[value] || uniformColor">{{dictItem? dictItem.name: value}}</a-tag>
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
        dictItem: null,
      }
    },
    created() {
      let dictData = this.DictPool.dictDataCache[this.dictCode]
      if(dictData){
        this.dictItem = dictData.find(dictItem => dictItem.value === this.value.toString())
      }
    },
    methods: {}
  }
</script>
