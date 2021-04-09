<template>
  <a-breadcrumb :routes="routeList">
    <template #itemRender="{ route, routes }">
      <template v-if="route.path === '' || route.path === '/'">
        <router-link to="/">
          <a-icon type="home" />
        </router-link>
      </template>
      <span v-if="routes.indexOf(route) !== 0">
        {{ route.meta.title }}
      </span>
    </template>
  </a-breadcrumb>
</template>

<script>
export default {
  name: 'Breadcrumb',
  computed: {
    routeList () {
      let routes = []
      this.$route.matched.forEach(item => {
        routes.push(item)
      })
      return routes
    }
  }
}
</script>

<style scoped>

</style>
