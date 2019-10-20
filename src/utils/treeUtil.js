/**
 * 数组转树形结构
 * @param list 源数组
 * @param parentId 父ID
 */
export const listToTree = (list, parentId, mapping) => {
  let tree = [];
  fillTree(list, tree, parentId, mapping);
  return tree;
}

/**
 * 数组转树形结构
 * @param list 源数组
 * @param tree 树
 * @param parentId 父ID
 */
export const fillTree = (list, tree, parentId, mapping) => {
  list.forEach(item => {
    // 判断是否为父级菜单
    if (item.parentId === parentId) {
      const child = {
        ...item,
        key: item.key || item.id,
        children: []
      }
      // 映射属性
      for(let key in mapping ){
        child[key] = item[mapping[key]]
      }

      // 迭代 list， 找到当前菜单相符合的所有子菜单
      fillTree(list, child.children, item.id, mapping)
      // 删掉不存在 children 值的属性
      if (child.children.length <= 0) {
        delete child.children
      }
      // 加入到树中
      tree.push(child)
    }
  })
}

/*
option {
  parentId: num,
  mapping: {
    x : y
  }
}*/
