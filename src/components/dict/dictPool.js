import Vue from 'vue'
import { getDictData, invalidDictHash } from '@/api/sys/sysdict'

// 字典项hash列表的Key
const DICT_HASH_KEY = 'dict-hashes'
const DICT_DATA_KEY_PREFIX = 'dict-data-'
// 失效时间
const DICT_TTL = 7 * 24 * 60 * 60 * 1000

function DictPool () {
  // 字典数据缓存
  this.dictDataCache = {}

  /**
   * 初始化字典
   * @param dictCodes Array
   */
  this.initDict = (dictCodes) => {
    // 不在缓存中且不在ls中才需要从服务端更新
    dictCodes = dictCodes.filter(
      dictCode => !this.dictDataCache[dictCode] && !this.getDictItemsFromLS(dictCode)
    )
    return dictCodes.length > 0 ? this.getDictItemsMapFromServer(dictCodes) : Promise.resolve()
  }

  // 获取list
  this.getDictItems = (dictCode) => {
    if (!dictCode) {
      return Promise.resolve()
    }
    let dictList = this.dictDataCache[dictCode] || this.getDictItemsFromLS(dictCode)
    return dictList ? Promise.resolve(dictList) : this.getDictItemsFromServer(dictCode)
  }

  /**
   * 从LocalStroge里面获取数据
   * @param dictCode
   * @returns {*}
   */
  this.getDictItemsFromLS = (dictCode) => {
    let dictList = Vue.ls.get(DICT_DATA_KEY_PREFIX + dictCode)
    if (dictList) {
      this.dictDataCache[dictCode] = dictList
      return dictList
    }
  }

  /**
   * 从服务端获取指定字典数据缓存
   * @param dictCode 字典标识
   * @returns {Promise<AxiosResponse<any>>}
   */
  this.getDictItemsFromServer = (dictCode) => {
    return this.getDictItemsMapFromServer([dictCode]).then(dictItemsMap => {
      return dictItemsMap[dictCode]
    })
  }

  /**
   * 从服务端获取字典数据
   * @param dictCodes Array 字典标识集合
   * @returns {Promise<AxiosResponse<any>>}
   */
  this.getDictItemsMapFromServer = (dictCodes) => {
    return getDictData(dictCodes).then(res => {
      if (res.code === 200 && res.data) {
        let dictItemsMap = {}
        res.data.forEach(dict => {
          let dictCode = dict.dictCode
          let dictItems = []
          dict.dictItems.forEach(item => {
            // 存储数据类型
            dictItems.push({ ...item, type: dict.type })
          })
          this.cacheDictData(dictCode, dict.hashCode, dictItems)
          dictItemsMap[dictCode] = dictItems
        })
        return dictItemsMap
      }
    })
  }

  /**
   * 缓存字典数据
   * @param dictCode 字典标识
   * @param dictList 字典列表
   * @param hashCode 哈希值
   */
  this.cacheDictData = (dictCode, hashCode, dictList) => {
    // 存储字典数据
    this.dictDataCache[dictCode] = dictList
    Vue.ls.set(DICT_DATA_KEY_PREFIX + dictCode, dictList, DICT_TTL)
    // 存储字典项Hash
    let hashes = Vue.ls.get(DICT_HASH_KEY)
    let map = hashes ? JSON.parse(hashes) : {}
    map[dictCode] = hashCode
    Vue.ls.set(DICT_HASH_KEY, JSON.stringify(map))
  }

  // 删除失效数据
  this.delInvalidDictData = () => {
    // 获取ls中的Hash表
    let hashes = Vue.ls.get(DICT_HASH_KEY)
    let map = hashes ? JSON.parse(hashes) : null
    // 如果有属性，则去后台查询是否过期
    if (map && Object.getOwnPropertyNames(map).length > 0) {
      invalidDictHash(map).then(res => {
        if (res.code === 200) {
          // 删除对应过期数据
          for (let dictCode of res.data) {
            Vue.ls.remove(DICT_DATA_KEY_PREFIX + dictCode)
            delete map[dictCode]
            delete this.dictDataCache[dictCode]
          }
          // 更新删除数据后的Hash表
          Vue.ls.set(DICT_HASH_KEY, JSON.stringify(map))
        }
      })
    }
  }

}

export default new DictPool()

