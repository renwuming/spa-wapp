import base from './base'
import wepy from 'wepy'

const baseUrl = wepy.$instance.globalData.baseUrl

export default class goods extends base {
  /**
   * 获取商品列表
   */
  static async getGoodsList() {
    const url = `${baseUrl}/goods`
    return this.get(url)
  }

  /**
   * 更新商品
   */
  static async updateGood(id) {
    const url = `${baseUrl}/goods/addone`
    return this.put(url, id)
  }
}
