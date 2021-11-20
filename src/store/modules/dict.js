import Vue from 'vue'
import { DICT } from '@/store/mutation-types'
import { getDictData, invalidDictHash } from '@/api/system/dict'
import { checkRequestSuccess } from '@/utils/request'

// 字典项hash列表的Key
const DICT_HASH_KEY = 'dict-hashes'
const DICT_DATA_KEY_PREFIX = 'dict-data:'
// 失效时间
const DICT_TTL = 7 * 24 * 60 * 60 * 1000


/**
 * 服务端返回的都是 String 类型，需转换为真实类型
 * @param value 值
 * @param valueType 值类型
 * @returns {number | boolean | string}
 */
function convertValueType(value, valueType) {
  let res = value
  // 如果没有type， 按number 处理
  valueType = valueType || 1
  if (valueType === 1) {
    res = Number(value)         // 数字
  } else if (valueType === 2) {
    res = String(value)         // 字符串
  } else if (valueType === 3) {
    // 布尔
    // 字符串 ”false“ 也会被转换为 true，所以要额外判断下
    // 参看 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Boolean
    let b = Boolean(value)
    res = b && value.toLowerCase() === 'false' ? false : b
  }
  return res
}


export default {
  state: {
    dictDataCache: {},
    // 控制请求，防止同页面渲染重复请求
    dictRequestFlag: {}
  },

  getters: {
    dictDataCache: state => state.dictDataCache
  },

  mutations: {
    [DICT.SET_DICT_CACHE] (state, dictData) {
      Vue.set(state.dictDataCache, dictData.dictCode, dictData)
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
            const dictData = Vue.ls.get(DICT_DATA_KEY_PREFIX + dictCode)
            if (dictData) {
              commit(DICT.SET_DICT_CACHE, dictData)
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
        if (checkRequestSuccess(res) && res.data) {
          res.data.forEach(dictData => {
            const dictCode = dictData.dictCode
            const hashCode = dictData.hashCode
            const dictItems = dictData.dictItems

            // 服务端返回的都是 String 类型，需转换为真实类型
            dictItems.forEach(item => {
              item.value = convertValueType(item.value, dictData.valueType)
            })

            // ls中存储字典
            commit(DICT.SET_DICT_CACHE, dictData)
            Vue.ls.set(DICT_DATA_KEY_PREFIX + dictCode, dictData, DICT_TTL)
            // 存储字典项Hash
            let hashes = Vue.ls.get(DICT_HASH_KEY)
            let map = hashes ? JSON.parse(hashes) : {}
            map[dictCode] = hashCode
            Vue.ls.set(DICT_HASH_KEY, JSON.stringify(map))
          })
        }
        commit(DICT.DEL_DICT_REQUEST_FLAG, requestFlagKey)
      } catch (e) {
        console.error(e)
      }
    },
    async checkDictStatus ({ commit, state }) {
      // 获取ls中的Hash表
      const hashes = Vue.ls.get(DICT_HASH_KEY)
      const map = hashes ? JSON.parse(hashes) : null
      // 如果有属性，则去后台查询是否过期
      if (map && Object.getOwnPropertyNames(map).length > 0) {
        const res = await invalidDictHash(map)
        if (checkRequestSuccess(res)) {
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
