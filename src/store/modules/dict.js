import Vue from 'vue'
import { DICT } from '@/store/mutation-types'
import { getDictData, invalidDictHash } from '@/api/sys/sysdict'

// 字典项hash列表的Key
const DICT_HASH_KEY = 'dict-hashes'
const DICT_DATA_KEY_PREFIX = 'dict-data-'
// 失效时间
const DICT_TTL = 7 * 24 * 60 * 60 * 1000

const user = {
  state: {
    dictDataCache: {},
    // 控制请求，防止同页面渲染重复请求
    dictRequestFlag: {}
  },

  mutations: {
    [DICT.SET_DICT_CACHE] (state, { dictCode, dictItems }) {
      Vue.set(state.dictDataCache, dictCode, dictItems)
    },
    [DICT.DEL_DICT_CACHE] (state, dictCode) {
      Vue.delete(state.dictDataCache, dictCode)
    },
    [DICT.SET_DICT_REQUEST_FLAG] (state, dictCode) {
      state.dictRequestFlag[dictCode] = true
    },
    [DICT.DEL_DICT_REQUEST_FLAG] (state, dictCode) {
      state.dictRequestFlag[dictCode] = false
    }
  },

  actions: {
    // 获取字典数据
    async fillDictCache ({ commit, state }, dictCodes = []) {
      try {
        const noDataList = dictCodes.filter((dictCode) => {
          if (!state.dictDataCache[dictCode]) {
            const dictItems = Vue.ls.get(DICT_DATA_KEY_PREFIX + dictCode)
            if (dictItems) {
              commit(DICT.SET_DICT_CACHE, { dictCode, dictItems })
            } else {
              return dictCode
            }
          }
        })
        const requestFlagKey = noDataList.join(',')
        if (noDataList.length === 0 || state.dictRequestFlag[requestFlagKey]) {
          return
        }
        commit(DICT.SET_DICT_REQUEST_FLAG, requestFlagKey)
        const res = await getDictData(noDataList)
        if (res.code === 200 && res.data) {
          res.data.forEach(dict => {
            const dictCode = dict.dictCode
            const hashCode = dict.hashCode
            const dictItems = dict.dictItems

            // 存储数据类型 TODO 后端返回
            dictItems.forEach(item => {
              dictItems.valueType = dict.valueType
            })

            // ls中存储字典
            commit(DICT.SET_DICT_CACHE, { dictCode, dictItems })
            Vue.ls.set(DICT_DATA_KEY_PREFIX + dictCode, dictItems, DICT_TTL)
            // 存储字典项Hash
            let hashes = Vue.ls.get(DICT_HASH_KEY)
            let map = hashes ? JSON.parse(hashes) : {}
            map[dictCode] = hashCode
            Vue.ls.set(DICT_HASH_KEY, JSON.stringify(map))
          })
        }
        commit(DICT.DEL_DICT_REQUEST_FLAG, requestFlagKey)
      } catch (e) {
        console.log(e)

      }
    },
    async checkDictStatus ({ commit, state }) {
      // 获取ls中的Hash表
      const hashes = Vue.ls.get(DICT_HASH_KEY)
      const map = hashes ? JSON.parse(hashes) : null
      // 如果有属性，则去后台查询是否过期
      if (map && Object.getOwnPropertyNames(map).length > 0) {
        const res = await invalidDictHash(map)
        if (res.code === 200) {
          // 删除对应过期数据
          for (let dictCode of res.data) {
            Vue.ls.remove(DICT_DATA_KEY_PREFIX + dictCode)
            delete map[dictCode]
            // delete this.dictDataCache[dictCode]
            commit(DICT.DEL_DICT_CACHE, dictCode)
          }
          // 更新删除数据后的Hash表
          Vue.ls.set(DICT_HASH_KEY, JSON.stringify(map))
        }
      }
    }
  }
}

export default user
