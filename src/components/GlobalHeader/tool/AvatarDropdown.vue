<template>
  <a-dropdown class="ballcat-global-header-tool-avatar-dropdown">
    <span>
      <a-avatar class="avatar" size="small" :src="fileAbsoluteUrl(userInfo.avatar)" />
      <span class="anticon">{{ userInfo.nickname }}</span>
    </span>
    <template #overlay>
      <a-menu class="ballcat-global-header-tool-avatar-dropdown-menu">
        <a-menu-item key="1">
          <router-link :to="{ name: 'AccountSettings' }">
            <a-icon type="setting" />
            <span>账户设置</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="2" disabled>
          <a-icon type="setting" />
          <span>测试</span>
        </a-menu-item>
        <a-menu-divider />
        <a-menu-item key="3">
          <a href="javascript:;" @click="handleLogout">
            <a-icon type="logout" />
            <span>退出登录</span>
          </a>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'UserAccountDropdown',
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    ...mapActions(['Logout']),
    handleLogout () {
      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk: () => {
          return this.Logout({}).then(() => {
            setTimeout(() => {
              window.location.reload()
            }, 16)
          }).catch(err => {
            this.$message.error({
              title: '错误',
              description: err.message
            })
          })
        },
        onCancel () {
        }
      })
    }
  }
}
</script>
