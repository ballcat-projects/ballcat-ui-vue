<template>
  <a-spin tip="Loading..." size="large" :spinning="iframeLoading">
    <iframe
      :id="id"
      ref="iframe"
      :src="url"
      width="100%"
      height="auto"
      class="iframe"
    />
  </a-spin>
</template>

<script>
export default {
  name: 'IframePage',
  data() {
    return {
      iframeLoading: false,
      id: '',
      url: ''
    }
  },
  watch: {
    '$route' () {
      this.iframeInit()
    }
  },
  created () {
    this.iframeInit()
  },
  mounted () {
    this.iframeResize()
    window.onresize = () => {
      this.iframeResize()
    }
  },
  methods: {
    iframeInit() {
      this.iframeLoading = true
      this.id = this.$route.path
      this.url = this.$route.meta.url
    },
    iframeResize() {
      const iframe = this.$refs.iframe
      const clientHeight = document.getElementsByClassName('ant-layout-content')[0].clientHeight - 10
      iframe.style.height = `${clientHeight}px`
      if (iframe.attachEvent) {
        iframe.attachEvent('onload', () => {
          this.iframeLoading = false
        })
      } else {
        iframe.onload = () => {
          this.iframeLoading = false
        }
      }
    }
  }
}
</script>

<style scoped>
.iframe {
  width: 100%;
  height: 100%;
  border: 0;
  overflow: hidden;
  box-sizing: border-box;
}
</style>
