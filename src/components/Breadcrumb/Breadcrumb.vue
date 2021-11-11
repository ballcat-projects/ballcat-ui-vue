<template>
  <a-breadcrumb :routes="routeList" style="white-space:nowrap">
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
    routeList() {
      return this.buildRoutes(this.$route)
    }
  },
  watch: {
    router() {
      this.buildRoutes(this.$route)
    }
  },
  methods: {
    buildRoutes: function(route) {
      let routes = []
      route.matched.forEach(item => {
        routes.push(item)
      })
      return routes
    }
  }
}
</script>

<style scoped></style>
