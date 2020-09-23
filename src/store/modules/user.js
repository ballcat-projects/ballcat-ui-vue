import Vue from 'vue'
import { login, logout } from '@/api/auth'
import { ACCESS_TOKEN, USER_INFO, PERMISSIONS, ROLES } from '@/store/mutation-types'

const user = {
  state: {
    token: '',
    roles: [],
    permissions: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INFO: (state, userInfo) => {
      state.info = userInfo
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    }
  },

  actions: {
    // 登录
    Login ({ commit }, loginParam) {
      return new Promise((resolve, reject) => {
        login(loginParam).then(res => {
          // TODO token刷新机制
          const ttl = res.expires_in * 1000
          const accessToken = res.access_token
          const refreshToken = res.refresh_token

          if (res.permissions.length < 0) {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }

          Vue.ls.set(USER_INFO, res.info, ttl)
          commit('SET_INFO', res.info)
          Vue.ls.set(ROLES, res.roles, ttl)
          commit('SET_ROLES', res.roles)
          Vue.ls.set(PERMISSIONS, res.permissions, ttl)
          commit('SET_PERMISSIONS', res.permissions)
          Vue.ls.set(ACCESS_TOKEN, accessToken, ttl)
          commit('SET_TOKEN', accessToken)

          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    Logout ({ dispatch, commit, state }) {
      return new Promise((resolve) => {
        logout().then(() => {
          resolve()
        }).catch(() => {
          resolve()
        }).finally(() => {
          dispatch('CLEAN_USER_INFO').then(() => {
            setTimeout(() => {
              window.location.reload()
            }, 10)
          })
        })
      })
    },

    CLEAN_USER_INFO ({ commit, state }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        Vue.ls.remove(ACCESS_TOKEN)
        Vue.ls.remove(USER_INFO)
        Vue.ls.remove(PERMISSIONS)
        Vue.ls.remove(ROLES)
        resolve()
      })
    }

  }
}

export default user
