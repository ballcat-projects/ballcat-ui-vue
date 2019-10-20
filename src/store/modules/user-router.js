/**
 * 向后端请求用户的菜单，动态生成路由
 */
import { constantRouters } from '@/router/constantRouter'
import { generatorDynamicRouter } from '@/router/dynamicRouter'

const userRouter = {
  state: {
    routers: constantRouters,
    userRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.userRouters = routers
      state.routers = constantRouters.concat(routers)
    }
  },
  actions: {
    GenerateRoutes ({ commit }) {
      return new Promise(resolve => {
        generatorDynamicRouter().then(routers => {
          commit('SET_ROUTERS', routers)
          resolve()
        })
      })
    }
  }
}

export default userRouter
