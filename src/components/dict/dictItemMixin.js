import { mapState, mapActions } from 'vuex';

export default {
  name: 'DictItemMixin',
  computed: {
    ...mapState({
      dictDataCache: state => state.dict.dictDataCache
    }),
    dictItems() {
      if (!this.dictDataCache[this.dictCode]) {
        this.requestData();
        return [];
      }
      return this.dictDataCache[this.dictCode];
    }
  },
  created () {},
  methods: {
    requestData() {
      this.getDictData([this.dictCode]);
    },
    ...mapActions(['getDictData']),
    getValByItem (dict) {
      let res = Number(dict.value)
      if (dict.valueType) {
        if (dict.valueType === 1) {
          // 数字
          res = Number(dict.value)
        } else if (dict.valueType === 2) {
          // 字符串
          res = String(dict.value)
        } else if (dict.valueType === 3) {
          // 布尔
          res = Boolean(dict.value)
        }
      }
      // 如果没有type， 按number 处理
      return res
    }
  }
}
