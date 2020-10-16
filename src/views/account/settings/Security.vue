<template>
  <a-list
    itemLayout="horizontal"
    :dataSource="data"
  >
    <template #renderItem="item, index1">
      <a-list-item :key="index1">
        <a-list-item-meta>
          <template #title>
            <a>{{ item.title }}</a>
          </template>
          <template #description>
            <span>
              <span class="security-list-description">{{ item.description }}</span>
              <span v-if="item.value"> : </span>
              <span class="security-list-value">{{ item.value }}</span>
            </span>
          </template>
        </a-list-item-meta>
        <template v-if="item.actions" #actions>
          <a @click="item.actions.callback">{{ item.actions.title }}</a>
        </template>
      </a-list-item>
    </template>
  </a-list>
</template>

<script>
export default {
  data () {
    return {
      data: [
        { title: '账户密码', description: '当前密码强度', value: '强', actions: { title: '修改', callback: () => { this.$message.info('This is a normal message') } } },
        { title: '密保手机', description: '已绑定手机', value: '138****8293', actions: { title: '修改', callback: () => { this.$message.success('This is a message of success') } } },
        { title: '密保问题', description: '未设置密保问题，密保问题可有效保护账户安全', value: '', actions: { title: '设置', callback: () => { this.$message.error('This is a message of error') } } },
        { title: '备用邮箱', description: '已绑定邮箱', value: 'ant***sign.com', actions: { title: '修改', callback: () => { this.$message.warning('This is message of warning') } } },
        { title: 'MFA 设备', description: '未绑定 MFA 设备，绑定后，可以进行二次确认', value: '', actions: { title: '绑定', callback: () => { this.$message.info('This is a normal message') } } }
      ]
    }
  }
}
</script>

<style scoped>

</style>
