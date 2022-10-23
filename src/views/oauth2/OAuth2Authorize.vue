<template>
  <div />
</template>

<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/storage-types'

export default {
  name: 'Oauth2Authorize',
  mounted () {
    debugger
    // 校验 token 是否有效，有效则直接 redirect, 如果无效则跳转到 login 页面，return_to 的参数也带过去
    // 登录页登录完成后，如果有 return_to 参数，则进行 redirect

    // 获取当前地址栏携带的 return_to 参数
    const route = this.$route
    const returnTo = route.query.return_to

    // 获取当前 token
    const accessToken = Vue.ls.get(ACCESS_TOKEN)

    if (accessToken) {
      if (returnTo) {
        // 有 return_to 则且已登录则直接重定向到授权地址
        // return_to 参数必然会有后缀
        window.location.href = returnTo + '&access_token=' + accessToken
      } else {
        this.$router.push('/')
      }
    } else {
      this.$router.push({
        path: '/user/login',
        query: returnTo ? { return_to: returnTo } : {}
      })
    }
  }
}
</script>
