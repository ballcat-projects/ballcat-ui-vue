import { getLoginUserMenu } from '@/api/system/menu'
import { listToTree } from '@/utils/treeUtil'
import { firstUpperCase } from '@/utils/strUtil'

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '*', redirect: '/404', hidden: true
}

// 根路由
const homeRouter = {
  path: '/', name: '/', hidden: true,
  children: [],
  component: () => import(`@/layouts/BasicLayout`),
  meta: {
    title: '首页'
  }
}

/**
 * 动态生成菜单
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = () => {
  return new Promise((resolve, reject) => {
    getLoginUserMenu().then(res => {
      const { data } = res

      // 后端数据, 根级树数组,  根级 PID
      const menuNav = listToTree(data, 0, (treeNode, item) => {
        treeNode.key = item.routerName
      })
      homeRouter.children = generator(menuNav)
      fillRedirect(homeRouter)

      const routers = []
      routers.push(homeRouter)
      routers.push(notFoundRouter)

      resolve(routers)
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  return routerMap.map(item => {
    // 内容打开方式
    const targetType = item.targetType
    const path = `${parent && parent.path || ''}/${item.path}`

    // 路由名称，由路由地址生成，大驼峰形式
    const name = path.replace('-', '/')
      .split('/')
      .filter(x => x && x !== '')
      .map(x => firstUpperCase(x))
      .join('')

    const currentRouter = {
      // 如果路由设置了 path，则作为默认 path，否则 路由地址 动态拼接生成如 /dashboard/workplace
      path: path,
      // 路由名称，建议唯一
      name: name,
      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: { title: item.title, icon: item.icon || undefined, targetType: targetType }
    }

    // 目录类型组件固定使用 ContentView
    if (item.type === 0) {
      currentRouter.component = () => import(`@/layouts/ContentView`)
    }

    // 菜单类型需要拼接组件地址
    if (item.type === 1) {
      if (targetType === 1) {
        // 内置组件
        item.uri && (currentRouter.component = () => import(`@/views/${item.uri}`))
        item.uri && (currentRouter.meta['componentName'] = item.uri.split("/").pop())
      } else if (targetType === 2) {
        // 内嵌iframe
        currentRouter.meta.url = item.uri
        currentRouter.component = () => import(`@/views/iframe`)
      } else if (targetType === 3) {
        // 外链 TODO 外链跳转地址问题
        currentRouter.meta.target = '_blank'
        currentRouter.meta.herf = item.uri
      }
    }

    // 是否设置了隐藏菜单
    if (item.hidden === 1) {
      currentRouter.hidden = true
    }

    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter)
      fillRedirect(currentRouter)
    }
    return currentRouter
  })
}

/**
 * 设置当前路由的默认跳转地址为其子路由的path
 * @param currentRouter
 */
function fillRedirect (currentRouter) {
  const children = currentRouter.children
  const redirectRouter = children.find(x => !x.hidden)
  redirectRouter && (currentRouter.redirect = redirectRouter.path)
}
