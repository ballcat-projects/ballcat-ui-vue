import Vue from 'vue'
import { LOV } from '@/store/mutation-types'
import { check, getData } from '@/api/system/lov'
import { checkRequestSuccess } from '@/utils/request'

// 缓存过期时间
const TTL = 7 * 24 * 60 * 60 * 1000
// 本地缓存前缀
const LS_PREFIX = 'lov_cache_'
// 预览缓存key
const LS_PREVIEW_KEY = 'local_preview'
// 更新时间
const LS_CHECK_PARAMS_KEY = 'lov_check_params_key'

const lov = {
  state: {
    lovCache: {},
    lovRequest: {}
  },
  mutations: {
    [LOV.SET_CACHE](state, { keyword, lovInfo }) {
      Vue.set(state.lovCache, keyword, lovInfo)
    },
    [LOV.DEL_CACHE](state, keyword) {
      Vue.delete(state.lovCache, keyword)
    },
    [LOV.SET_REQUEST](state, keyword) {
      state.lovRequest[keyword] = true
    },
    [LOV.DEL_REQUEST](state, keyword) {
      state.lovRequest[keyword] = false
    }
  },

  actions: {
    async getLovInfoByKeyword({ commit, state }, keyword = '') {
      try {
        let info = state.lovCache[keyword]
        // state 没有缓存
        if (!info) {
          // 获取 ls 缓存
          info = Vue.ls.get(getKey(keyword))
          // 存在缓存
          if (info) {
            info = JSON.parse(info)
            commit(LOV.SET_CACHE, { keyword, lovInfo: info })
            return info
          }
        } else {
          return info
        }

        // 检查锁.
        if (state.lovRequest[keyword]) {
          return
        }
        // 获取锁
        commit(LOV.SET_REQUEST, keyword)

        // 从服务器获取数据
        const res = await getData(keyword)

        // 解析
        if (checkRequestSuccess(res) && res.data) {
          Vue.ls.set(getKey(keyword), JSON.stringify(res.data), TTL)
          commit(LOV.SET_CACHE, { keyword, lovInfo: res.data })
          cacheUpdateTime(res.data)
          return res.data
        }

      } catch (e) {
        console.error(e)
      } finally {
        commit(LOV.DEL_REQUEST, keyword)
      }
    },
    async setLovPreview({ commit, state }, info = {}) {
      commit(LOV.SET_CACHE, { LS_PREVIEW_KEY, lovInfo: info })
      Vue.ls.set(getKey(LS_PREVIEW_KEY), JSON.stringify(info))
    },
    async delLovPreview({ commit, state }) {
      commit(LOV.DEL_CACHE, LS_PREVIEW_KEY)
      Vue.ls.remove(getKey(LS_PREVIEW_KEY))
    },
    async delLovInfo({ commit, state }, keyword = '') {
      commit(LOV.DEL_CACHE, keyword)
      Vue.ls.remove(getKey(keyword))
      deleteCacheUpdate(keyword)
    },
    async checkLov({ commit, state }) {
      const cache = getCache()
      if (cache && Object.getOwnPropertyNames(cache).length > 0) {
        const res = await check(cache)
        if (checkRequestSuccess(res) && res.data) {
          return res.data
        }
      }
      return []
    }
  }
}

/**
 * 获取缓存key
 * @param keyword lov的keyword
 * @returns {string}
 */
function getKey(keyword) {
  return LS_PREFIX + keyword
}

/**
 * 获取更新时间缓存
 */
function getCache() {
  const mapStr = Vue.ls.get(LS_CHECK_PARAMS_KEY)
  return mapStr ? JSON.parse(mapStr) : {}
}

/**
 * 缓存一个新lov的时间
 * @param lov
 */
function cacheUpdateTime(lov) {
  const map = getCache()
  map[lov.keyword] = lov.updateTime
  Vue.ls.set(LS_CHECK_PARAMS_KEY, JSON.stringify(map))
}

/**
 * 删除时间缓存
 */
function deleteCacheUpdate(keyword) {
  const map = getCache()
  delete map[keyword]
  Vue.ls.set(LS_CHECK_PARAMS_KEY, JSON.stringify(map))
}

export default lov
