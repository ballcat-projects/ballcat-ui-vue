<template>
  <a-breadcrumb :routes="routes">
    <template slot="itemRender" slot-scope="{ route, params, routes, paths }">
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
    routes () {
      let routes = []
      this.$route.matched.forEach(item => {
        routes.push(item)
      })
      console.log(routes)
      return routes
    }
  }
}
</script>

<style scoped>

</style>
