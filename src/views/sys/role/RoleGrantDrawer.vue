<template>
  <a-drawer
    title="角色授权"
    placement="right"
    @close="closeDrawer"
    :visible="visible"
    width="600"
  >


    <v-tree ref='tree' :data='treeData' :multiple="true" :halfcheck='true'/>

    <div
      :style="{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          zIndex:'999',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }"
    >
      <a-popconfirm title="确定放弃编辑？" @confirm="closeDrawer" okText="确定" cancelText="取消">
        <a-button style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button @click="onSubmit" type="primary" :loading="submitLoading">保存</a-button>
    </div>

  </a-drawer>
</template>
<script>
import { getList } from '@/api/sys/permission'
import { putPermissionIds, getPermissionIds } from '@/api/sys/role'
import { listToTree } from '@/utils/treeUtil'

export default {
  name: 'RoleGrantDrawer',
  data () {
    return {
      visible: false,
      roleId: '',
      treeData: [],
      checkedKeys: {
        checked: []
      },
      expandedKeys: [],
      submitLoading: false
    }
  },
  methods: {
    showDrawer (record) {
      this.visible = true
      this.roleId = record.id
    },
    closeDrawer () {
      this.visible = false
    },
    onSubmit () {
      let checkedNodes = this.$refs.tree.getCheckedNodes()
      let permissionIds = checkedNodes.map((node) => {
        return node.id
      })
      this.submitLoading = true
      putPermissionIds(this.roleId, permissionIds).then((res) => {
          this.$message.success(res.msg)
          this.closeDrawer()
      })
      .finally(() => {
        this.submitLoading = false
      });
    },
    onCheck (o) {
      console.log('on check!')
    },
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
    }
  },
  watch: {
    visible () {
      if (this.visible) {
        getList().then((res) => {
          let treeData = res.data
          getPermissionIds(this.roleId).then((res) => {
            for (let index in treeData) {
              let node = treeData[index]
              const checked = res.data.indexOf(node.id) > -1
              node.checked = checked
              node.expanded = checked
            }
            this.treeData = listToTree(treeData, 0)
          })
        })
      }
    }
  }
}
</script>

<style scoped>

</style>