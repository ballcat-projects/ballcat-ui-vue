import DictMixin from '@/components/Dict/dictMixin'

export default {
  name: 'DictDisplayMixin',
  mixins: [DictMixin],
  props: {
    value: {
      type: [String, Number, Boolean],
      default: null
    },
    colors: {
      type: Object,
      default: function () {
        return {}
      }
    },
    uniformColor: {
      type: String,
      default: null
    }
  },
  computed: {
    dictItem() {
      return  this.dictItems.find(dictItem => dictItem.value === this.value) || {};
    },
    showText() {
      return (this.dictItem && this.dictItem.name) || this.value + '';
    }
  },
}
