import Vue from 'vue'
import { getDictDataAndHash, invalidDictHash } from '@/api/sys/sysdict'

// 字典项hash列表的Key
const DICT_HASH_KEY = 'dict-hashes'
const DICT_DATA_KEY_PREFIX = 'dict-list-'
// 失效时间
const DICT_TTL = 7 * 24 * 60 * 60 * 1000


function DictPool() {
  // 字典数据缓存
  this.dictDataCache = {}

  /**
   * 初始化字典
   * @param dictCodes Array
   */
  this.initDictList = (dictCodes) => {
    dictCodes.forEach(dictCode => {
      if (!this.dictDataCache[dictCode] && !this.getDictDataFromLS(dictCode)){
        this.getDictDataFromServer(dictCode).finally()
      }
    })
  }

  // 获取list
  this.getDictList = (dictCode) => {
    if (!dictCode) {
      return Promise.resolve()
    }
    let dictList = this.dictDataCache[dictCode] || this.getDictDataFromLS(dictCode)
    return dictList ? Promise.resolve(dictList) : this.getDictDataFromServer(dictCode)
  }

  // 获取一个对象
  this.getDictObj = (dictCode) => {
    return this.getDictList(dictCode).then(dictList => {
      if (dictList) {
        return this.listToObj(dictList)
      }
    })
  }

  this.listToObj = (dictList) => {
    let dictObj = {}
    for (let dict of dictList) {
      dictObj[dict.value] = dict.name
    }
    return dictObj
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

  /**
   * 从LocalStroge里面获取数据
   * @param dictCode
   * @returns {*}
   */
  this.getDictDataFromLS = (dictCode) => {
    let dictList = Vue.ls.get(DICT_DATA_KEY_PREFIX + dictCode)
    if (dictList){
      this.dictDataCache[dictCode] = dictList
      return dictList
    }
  }

  /**
   * 从服务端获取字典数据缓存
   * @param dictCode
   * @returns {Promise<AxiosResponse<any>>}
   */
  this.getDictDataFromServer = (dictCode) => {
    return getDictDataAndHash(dictCode).then(res => {
      if (res.code === 200 && res.data) {
        let dictDataAndHash = res.data
        let hashCode = dictDataAndHash.hashCode
        let dictList = dictDataAndHash.dictList
        // 存储字典数据
        this.dictDataCache[dictCode] = dictList
        Vue.ls.set(DICT_DATA_KEY_PREFIX + dictCode, dictList, DICT_TTL)
        // 存储字典项Hash
        let hashes = Vue.ls.get(DICT_HASH_KEY)
        let map = hashes ? JSON.parse(hashes) : {}
        map[dictCode] = hashCode
        Vue.ls.set(DICT_HASH_KEY, JSON.stringify(map))
        return dictList
      }
    })
  }

}

export default new DictPool()














