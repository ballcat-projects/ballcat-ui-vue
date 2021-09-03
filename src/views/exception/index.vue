<template>
  <a-result
    :status="status"
    :title="type.title"
    :sub-title="type.desc"
  >
    <template #extra>
      <a-button type="primary" @click="handleToHome">
        Back Home
      </a-button>
    </template>
  </a-result>
</template>

<script>
export default {
  data () {
    return {
      types: {
        403: {
          title: '403',
          desc: 'Sorry, you are not authorized to access this page.'
        },
        404: {
          title: '404',
          desc: 'Sorry, the page you visited does not exist.'
        },
        500: {
          title: '500',
          desc: 'Sorry, the server is wrong.'
        }
      }
    }
  },
  computed: {
    status () {
      return this.$route.meta.exceptionStatus || '404'
    },
    type () {
      let type = this.types[this.status]
      return type || this.types[404]
    }
  },
  methods: {
    handleToHome () {
      this.$router.push({ name: '/' })
    }
  }
}
</script>
