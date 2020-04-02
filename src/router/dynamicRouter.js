import { getLoginUserRouter } from '@/api/sys/permission'
import { listToTree } from '@/utils/treeUtil'

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '*', redirect: '/404', hidden: true
}

// 根路由
const homeRouter = {
  path: '/', name: 'index.js', hidden: true,
  children: [],
  component: () => import(`@/layouts/BasicLayout`),
  meta: {
    title: '首页'
  }
}

/**
 * 动态生成菜单
 * @param token
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = () => {
  return new Promise((resolve, reject) => {
    getLoginUserRouter().then(res => {
      const { data } = res

      // 后端数据, 根级树数组,  根级 PID
      const menuNav = listToTree(data, 0, {key: 'routerName'});

      const menuRouters = generator(menuNav)
      homeRouter.children = menuRouters

      // 默认根路径跳转地址
      homeRouter.redirect = menuRouters[0].name

      const routers = [];
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
    const currentRouter = {
      // 如果路由设置了 path，则作为默认 path，否则 路由地址 动态拼接生成如 /dashboard/workplace
      path: item.path || `${parent && parent.path || ''}/${item.key}`,
      // 路由名称，建议唯一
      name: item.name || item.key || '',
      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: { title: item.title, icon: item.icon || undefined, target: item.target}
    }
    // 该路由对应页面的 组件 :方案1
    // component: constantRouterComponents[item.component || item.key],
    // 该路由对应页面的 组件 :方案2 (动态加载)
    const component = item.component
    if (component) {
      // import 前面第一位必须是常量
      if (component.indexOf('layouts/') !== -1) {
        currentRouter.component = () => import(`@/layouts/${component.replace('layouts/', '')}`)
      } else {
        currentRouter.component = () => import(`@/views/${component}`)
      }
    }

    // 是否设置了隐藏菜单
    if (item.hidden === 1) {
      currentRouter.hidden = true
    }
    // 是否设置了隐藏子菜单
    if (item.hideChildren) {
      currentRouter.hideChildrenInMenu = true
    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    if (!currentRouter.path.startsWith('http')) {
      currentRouter.path = currentRouter.path.replace('//', '/')
    }
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect)
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}


