import base from './base'
import wepy from 'wepy'

const baseUrl = wepy.$instance.globalData.baseUrl

export default class order extends base {
  /**
   * 增加订单
   */
  static async createOrder (obj) {
    const url = `${baseUrl}/orders`
    return this.post(url, obj)
  }

  /**
   * 查询订单
   */
  static async findOrder() {
    const url = `${baseUrl}/orders/find`
    return this.get(url)
  }
}
