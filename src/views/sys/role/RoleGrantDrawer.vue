<template>
  <a-drawer
    title="角色授权"
    placement="right"
    @close="closeDrawer"
    :visible="visible"
    width="600"
  >
    <a-tree
      checkable
      :treeData="treeData"
      :checkedKeys="checkedKeys"
      :expandedKeys="expandedKeys"
      :halfCheckedKeys="halfCheckedKeys"
      @check="onCheck"
      @expand="onExpand"
    >
    </a-tree>

    <div
      :style="{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e8e8e8',
          padding: '10px 16px',
          textAlign: 'right',
          left: 0,
          background: '#fff',
          borderRadius: '0 0 4px 4px',
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
import { getPermissionCode, putPermissionIds } from '@/api/sys/role'
import { listToTree } from '@/utils/treeUtil'

export default {
  name: 'RoleGrantDrawer',
  data () {
    return {
      visible: false,
      roleCode: '',
      treeData: [],
      checkedKeys: [],
      halfCheckedKeys: [],
      expandedKeys: [],
      submitLoading: false
    }
  },
  methods: {
    showDrawer (record) {
      this.visible = true
      this.roleCode = record.code
    },
    closeDrawer () {
      this.visible = false
    },
    onSubmit () {
      // 权限ID 求并集
      let checkedKeySet = new Set(this.checkedKeys)
      let halfCheckedKeySet = new Set(this.halfCheckedKeys)
      let permissionIds = [...new Set([...checkedKeySet, ...halfCheckedKeySet])]

      this.submitLoading = true
      putPermissionIds(this.roleCode, permissionIds).then((res) => {
        this.$message.success(res.message)
        this.closeDrawer()
      })
        .finally(() => {
          this.submitLoading = false
        })
    },
    onCheck (checkedKeys, e) {
      this.checkedKeys = checkedKeys
      this.halfCheckedKeys = e.halfCheckedKeys
    },
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
    },
    /**
     * 解析出所有的太监节点id
     * @param treeData 待解析的treeData
     * @param keyArr 原始节点数组
     * @param resArr 临时存放节点id的数组
     * @return 太监节点id数组
     */
    resolveAllEunuchNodeId (treeData, keyArr, resArr) {
      for (let i = 0; i < treeData.length; i++) {
        const item = treeData[i]
        // 存在子节点，递归遍历;不存在子节点，将json的id添加到临时数组中
        if (item.children && item.children.length !== 0) {
          this.resolveAllEunuchNodeId(item.children, keyArr, resArr)
        } else if (keyArr.indexOf(item.key) !== -1) {
          resArr.push(item.key)
        }
      }
      return resArr
    }
  },
  watch: {
    visible () {
      if (this.visible) {
        getList().then((res) => {
          // 根据 id 作为 key, 将后台返回的 list 转换为 Tree
          let treeData = listToTree(res.data, 0)
          getPermissionCode(this.roleCode).then((res) => {
            this.treeData = treeData
            // 由于 AntDesign 的默认父子关联，直接选中所有权限，会导致半选节点变为全选
            // 所以这里筛选出所有太监节点，进行勾选
            this.checkedKeys = this.resolveAllEunuchNodeId(treeData, res.data, [])
            // 默认的半选节点为全部权限，防止未作修改直接保存导致的权限丢失
            this.halfCheckedKeys = res.data
            this.expandedKeys = res.data
          })
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
