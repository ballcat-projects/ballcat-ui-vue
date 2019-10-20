<template>
  <iframe :id="id" :src="url" frameborder="0" width="100%" height="800px" scrolling="auto"></iframe>
</template>

<script>
export default {
  name: 'IframeView',
  data () {
    return {
      url: '',
      id: ''
    }
  },
  mounted () {
    this.goUrl()
  },
  methods: {
    goUrl () {
      this.url = this.$route.meta.url
      this.id = this.$route.path
    }
  }
}
</script>

<style scoped>

</style>