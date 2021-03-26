<template>
  <div class="user-wrapper">
    <div class="antd-pro-components-global-header-index-right">
      <a href="http://www.ballcat.cn" target="_blank" style="color: inherit;">
        <span class="action">
          <a-icon type="question-circle-o" />
        </span>
      </a>
      <screenfull id="screenfull" class="action" />
      <notice-icon class="action" style="display: flex;" />
      <a-dropdown style="display: flex;">
        <span class="action ant-dropdown-link user-dropdown-menu">
          <a-avatar class="avatar" size="small" :src="fileAbsoluteUrl(userInfo.avatar)" />
          <span>{{ userInfo.nickname }}</span>
        </span>
        <template #overlay>
          <a-menu class="user-dropdown-menu-wrapper">
            <a-menu-item key="1">
              <router-link :to="{ name: 'settings' }">
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
      <lang-select />
    </div>
  </div>
</template>

<script>
import Screenfull from '@/components/Screenfull'
import NoticeIcon from '@/components/NoticeIcon'
import { mapActions, mapGetters } from 'vuex'
import LangSelect from '@/components/tools/LangSelect'

export default {
  name: 'UserMenu',
  components: {
    LangSelect,
    NoticeIcon,
    Screenfull
  },
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
<style>
.antd-pro-components-global-header-index-right {
  display: flex;
  float: right;
  height: 48px;
  margin-left: auto;
  overflow: hidden;
}
</style>
