<template>
  <div style="width:65%">
    <a-menu v-model="currentNav" mode="horizontal">
      <template v-for="item in menus">
        <a-menu-item v-if="!item.hidden" :key="item.name" @click="selectItem"
          ><icon-font :type="item.meta.icon" />{{ item.meta.title }}</a-menu-item
        >
      </template>
    </a-menu>
  </div>
</template>
<script>
export default {
  name: 'TopMenus',
  props: {
    menus: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      currentNav: []
    }
  },
  watch: {
    $route(to) {
      this.firstToUpper(to)
    }
  },
  created() {
    this.firstToUpper(this.$route)
  },
  methods: {
    firstToUpper(path) {
      return (this.currentNav = [path.matched[1].name])
    },
    selectItem(item) {
      this.$router.push({ name: item.key })
    }
  }
}
</script>
