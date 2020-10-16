import Vue from 'vue'
import { SET_DICT_CODE, DELETE_INVALID_DICT, SET_DICT_REQUEST_CACHE, RESET_DICT_REQUEST_CACHE_ITEM } from '@/store/mutation-types'
import { getDictData, invalidDictHash } from '@/api/sys/sysdict'

// 字典项hash列表的Key
const DICT_HASH_KEY = 'dict-hashes';
const DICT_DATA_KEY_PREFIX = 'dict-data-';
// 失效时间
const DICT_TTL = 7 * 24 * 60 * 60 * 1000;

const user = {
  state: {
    dictDataCache: {},
    dictRequestCache: {}
  },

  mutations: {
    [SET_DICT_CODE](state, { dictCode, dictList }) {
      Vue.set(state.dictDataCache, dictCode, dictList)
    },
    [DELETE_INVALID_DICT](state, dictCode) {
      Vue.delete(state.dictDataCache, dictCode)
    },
    [SET_DICT_REQUEST_CACHE](state, dictCode) {
      state.dictRequestCache[dictCode] = true;
    },
    [RESET_DICT_REQUEST_CACHE_ITEM](state, dictCode) {
      state.dictRequestCache[dictCode] = false;
    },
  },

  actions: {
    // 获取字典数据
    async getDictData({ commit, state }, dictCode = []) {
      try {
        const noDataList = dictCode.filter((v) => {
          if (!state.dictDataCache[v]) {
            const lsVal = Vue.ls.get(DICT_DATA_KEY_PREFIX + v);
            if (lsVal) {
              // state.dictDataCache[v] = lsVal;
              commit(SET_DICT_CODE, {
                dictCode: v,
                dictList: lsVal
              });
            } else {
              return v;
            }
          }
        });
        if (noDataList.length === 0 || state.dictRequestCache[noDataList.join(',')]) {
          return;
        }
        commit(SET_DICT_REQUEST_CACHE, noDataList.join(','));
        const res = await getDictData(noDataList);
        if (res.code === 200 && res.data) {
          res.data.forEach(dict => {
            const dictCode = dict.dictCode;
            const hashCode = dict.hashCode;
            const dictList = [];
            dict.dictItems.forEach(item => {
              // 存储数据类型
              dictList.push({ ...item, valueType: dict.valueType });
            })
            commit(SET_DICT_CODE, {
              dictCode,
              dictList
            });
            Vue.ls.set(DICT_DATA_KEY_PREFIX + dictCode, dictList, DICT_TTL);
            // 存储字典项Hash
            let hashes = Vue.ls.get(DICT_HASH_KEY);
            let map = hashes ? JSON.parse(hashes) : {};
            map[dictCode] = hashCode;
            Vue.ls.set(DICT_HASH_KEY, JSON.stringify(map));
          })
        }
        commit(RESET_DICT_REQUEST_CACHE_ITEM, noDataList.join(','));
      } catch (e) {
        console.log(e);
      }
    },
    async checkDictStatus({ commit, state }) {
      // 获取ls中的Hash表
      const hashes = Vue.ls.get(DICT_HASH_KEY);
      const map = hashes ? JSON.parse(hashes) : null;
      // 如果有属性，则去后台查询是否过期
      if (map && Object.getOwnPropertyNames(map).length > 0) {
        const res = await invalidDictHash(map);
        if (res.code === 200) {
          // 删除对应过期数据
          for (let dictCode of res.data) {
            Vue.ls.remove(DICT_DATA_KEY_PREFIX + dictCode);
            delete map[dictCode];
            // delete this.dictDataCache[dictCode]
            commit(DELETE_INVALID_DICT, dictCode);
          }
          // 更新删除数据后的Hash表
          Vue.ls.set(DICT_HASH_KEY, JSON.stringify(map));
        }
      }
    }
  }
}

export default user
