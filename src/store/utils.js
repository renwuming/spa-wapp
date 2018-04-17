import { getStore } from 'wepy-redux'
import goods from '../api/goods'
import userinfo from '../api/user.js'

const SAVE = 'SAVE'

const store = getStore()
// 元数据
const meta = {}
// 是否调试
const IS_DEBUG = false
// 超时时间
const CACHE_TIMEOUT = 5 * 60 * 1000

// 初始化需要加载的字段
const INIT_KEY = ['userinfo', 'goods']

// 加载状态
let isLoading = false

// 等待队列
let loadingQueue = []

const get = key => {
  return (state) => {
    return state.cache[key]
  }
}

/**
 * 保存数据
 */
const save = (key, data) => {
  if (IS_DEBUG) {
    console.info(`[store] save key=${key}, data=`, data)
  }
  store.dispatch({
    type: SAVE,
    payload: {
      key: key,
      value: data
    }
  })
}

/**
 * 初始化
 */
const init = async () => {
  // 判读是否正在加载，正在加载则等待
  if (isLoading) {
    console.info('[store] store is loading, wait completed')
    return new Promise(resolve => {
      const callback = () => {
        resolve()
      }
      loadingQueue.push(callback)
    })
  } else {
    // 开始初始化
    console.info('[store] start init store')
    isLoading = true
    await use(...INIT_KEY)
    // 清空等待队列
    console.info('[store] store init completed')
    isLoading = false
    loadingQueue.forEach(callback => callback())
    loadingQueue = []
  }
}

/**
 * 加载指定字段的数据，并发加载，一次性返回，已经加载的数据不会再次加载
 */
const use = async (...fields) => {
  // 过滤已加载完毕的字段
  const fetchFileds = fields.filter(field => !exists(field))
  if (fetchFileds.length > 0) {
    console.info(`[store] use store: fields=${fetchFileds}`)
    // 加载未加载的数据
    await load(fetchFileds)
  } else {
    console.info(`[store] use store: all fields cached`)
  }
}

/**
 * 加载指定字段的数据
 */
const load = async (fields) => {
  // 将字段构造Promise
  const fetchPromises = fields.map(field => fetch(field))
  // 获取所有数据，等待最后一个返回
  const data = await Promise.all(fetchPromises)
  // 保存结果
  fields.forEach((field, index) => {
    const filedData = data[index]
    save(field, filedData)
  })
  // 保存元数据
  save('meta', meta)
}

/**
 * 刷新数据
 */
const reflesh = async (...fields) => {
  console.info(`[store] reflesh store: fields=${fields}`)
  await load(fields)
}

/**
 * 加载数据， 返回Promise
 */
const fetch = (field) => {
  // 先更新元数据
  updateMeta(field)
  // 再获取Promise对象
  switch (field) {
    case 'userinfo':
      return userinfo.getUserInfo()
    case 'goods':
      return goods.getGoodsList()
  }
}

/**
 * 更新元数据
 */
const updateMeta = (field) => {
  if (meta[field] == null) {
    meta[field] = {}
    meta[field].init = true
  }
  meta[field].updateTime = new Date().getTime()
}

/**
 * 判断是否存在
 */
const exists = key => {
  // 判断是否初始化过
  if (meta[key] == null || meta[key].init != true) {
    return false
  }
  // 判断是否过期
  const updateTime = meta[key].updateTime
  const interval = new Date().getTime() - updateTime
  return interval < CACHE_TIMEOUT
}

export default {
  get,
  save,
  use,
  reflesh,
  init
}
