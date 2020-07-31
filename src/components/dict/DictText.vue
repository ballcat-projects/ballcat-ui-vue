<template>
  <span>{{dictItem? dictItem.name: value}}</span>
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
        dictItem: null,
      }
    },
    mounted() {
      let dictData = this.DictPool.dictDataCache[this.dictCode]
      if(dictData){
        this.dictItem = dictData.find(dictItem => dictItem.value === this.value.toString())
      }
    },
    methods: {}
  }
</script>
