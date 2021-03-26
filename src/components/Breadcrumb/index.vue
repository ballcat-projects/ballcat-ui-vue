<template>
  <a-breadcrumb :routes="routeList">
    <template #itemRender="{ route, routes }">
      <span v-if="routes.indexOf(route) === routes.length - 1">
        {{ route.meta.title }}
      </span>
      <router-link v-else :to="route.path">
        {{ route.meta.title }}
      </router-link>
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
