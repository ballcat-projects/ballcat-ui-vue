/**
 * 数组转树形结构
 * @param list 源数组
 * @param parentId 父ID
 * @param attributeFill 数据处理函数
 */
export const listToTree = (list, parentId, attributeFill) => {
  let tree = []
  fillTree(list, tree, parentId, attributeFill)
  return tree
}

/**
 * 数组转树形结构
 * @param list 源数组
 * @param tree 树
 * @param parentId 父ID
 * @param attributeFill 属性填充函数
 */
export const fillTree = (list, tree, parentId) => {
  list.forEach(item => {
    // 判断是否为父级菜单
    if (item.parentId === parentId) {
      const treeNode = {
        ...item,
        key: item.key || item.id,
        children: []
      }

      // 迭代 list， 找到当前菜单相符合的所有子菜单
      fillTree(list, treeNode.children, item.id)
      // 删掉不存在 children 值的属性
      if (treeNode.children.length <= 0) {
        delete treeNode.children
      }
      // 加入到树中
      tree.push(treeNode)
    }
  })
}

/**
 * 根据指定规则进行剪枝
 * @param treeList
 * @param matcher
 * @returns {*[]}
 */
export function pruneTree (treeList, matcher) {
  const result = []
  if (treeList) {
    for (let treeNode of treeList) {
      const children = pruneTree(treeNode.children, matcher)
      if (children && children.length > 0) {
        treeNode.children = children
        result.push(treeNode)
      } else if (matcher(treeNode)) {
        treeNode.children = []
        result.push(treeNode)
      }
    }
  }
  return result
}

/**
 * 获取匹配节点的所有祖先节点 id
 * @param treeList 树节点集合
 * @param matcher 匹配器
 * @returns 祖先节点 id 集合
 */
export function matchedParentKeys (treeList, matcher) {
  const result = []
  fillMatchedParentKeys(treeList, matcher, result)
  return result
}

/**
 * 获取匹配节点的所有祖先节点 id
 * @param treeList 树节点集合
 * @param matcher 匹配器
 * @param result 返回值
 * @returns {boolean}
 */
export function fillMatchedParentKeys (treeList, matcher, result) {
  if (!treeList || treeList.length === 0) {
    return false
  }
  let matched = false
  for (let node of treeList) {
    // 如果孩子节点有匹配，则把自己的 id 加入返回值
    if (fillMatchedParentKeys(node.children, matcher, result)) {
      matched = true
      result.push(node.id)
    }
    // 如果当前节点匹配了，matched 修改为 true
    if (matcher(node)) {
      matched = true
    }
  }
  return matched
}
