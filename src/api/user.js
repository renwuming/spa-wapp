import base from './base'
import wepy from 'wepy'

const baseUrl = wepy.$instance.globalData.baseUrl

export default class goods extends base {
  /**
   * 获取用户信息
   */
  static async getUserInfo () {
    const url = `${baseUrl}/users`
    return this.get(url)
  }

  /**
   * 把用户信息存入数据库
   * @param {用户信息} userinfo
   */
  static async addUser (userinfo) {
    const url = `${baseUrl}/users`
    return this.post(url, userinfo)
  }

  /**
   * 更新用户数据
   * @param {更新数据} newdata
   */
  static async updataUser (newdata) {
    // console.log('123')
    const url = `${baseUrl}/users`
    return this.put(url, newdata)
  }
}
