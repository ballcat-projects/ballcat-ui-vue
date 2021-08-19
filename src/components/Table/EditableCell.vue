z<template>
  <div class="editable-cell">
    <div v-if="editable" class="editable-cell-input-wrapper">
      <a-input :value="value" @change="handleChange" />
      <span class="editable-cell-icon-box">
        <a-icon type="check" class="editable-cell-icon" @click="check" />
        <a-icon type="close" class="editable-cell-icon" @click="close" />
      </span>
    </div>
    <div v-else class="editable-cell-text-wrapper">
      {{ value || ' ' }}
      <span class="editable-cell-icon-box">
        <a-icon type="edit" class="editable-cell-icon" @click="edit" />
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditableCell',
  props: {
    text: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      value: this.text,
      originValue: this.text,
      editable: false
    }
  },
  watch: {
    text (val) {
      this.value = val
      this.originValue = val
    }
  },
  methods: {
    handleChange (e) {
      this.value = e.target.value
    },
    check () {
      this.editable = false
      this.originValue = this.value
      this.$emit('change', this.value)
    },
    close () {
      this.editable = false
      this.value = this.originValue
    },
    edit () {
      this.editable = true
    }
  }
}
</script>

<style scoped>
.editable-cell {
  position: relative;
}

.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
  padding: 5px 48px 5px 5px;
}

.editable-cell-text-wrapper {
  padding-right: 24px;
}

.editable-cell-icon-box {
  position: absolute;
  right: 0;
  cursor: pointer;
}

.editable-cell-icon {
  line-height: 18px;
  width: 20px;
  display: none;
}

.editable-cell-icon-box {
  line-height: 28px;
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}

.editable-cell-icon:hover {
  color: #108ee9;
}
</style>
