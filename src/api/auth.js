import wepy from 'wepy'
import base from './base'

const baseUrl = wepy.$instance.globalData.baseUrl

export default class auth extends base {

  /**
   * 获取权限值
   */
  static getAuthValue (key) {
    return wepy.getStorageSync(key);
  }

  /**
   * 执行登陆操作
   */
  static async doLogin () {
    const { code } = await wepy.login()
    const { thirdSession } = await this.session(code)
    await this.setConfig('thirdSession', thirdSession)
  }

  /**
   * 检验是否登陆，登陆是过期
   */
  static async checkLogin (thirdSession) {
    const url = `${baseUrl}/validate?thirdSession=${thirdSession}`
    const data = await this.get(url)
    return data.success
  }

  /**
   * 获取 session
   * @param {appid} jsCode 
   */
  static async session (jsCode) {
    const url = `${baseUrl}/sessionkey?code=${jsCode}`
    const res = await this.get(url)
    return res
  }

  /**
   * 检查是否存在权限制
   */
  static hasConfig (key) {
    const value = this.getAuthValue(key)
    return JSON.stringify(value) !== '{}'
  }

  /**
   * 读取权限值
   */
  static async setConfig (key, value) {
    await wepy.setStorage({
      key: key,
      data: value
    })
    wepy.$instance.globalData[key] = value
  }

  /**
   * 删除权限值
   */
  static async removeConfig (key) {
    console.info(`[auth] clear auth config [${key}]`)
    wepy.$instance.globalData.auth[key] = null
    await wepy.removeStorage({
      key: key
    })
  }

  /**
   * 服务端解密用户信息
   */
  static async decodeUserInfo (rawUser) {
    const url = `${baseUrl}/decodeUserinfo`
    const param = {
      encryptedData: rawUser.encryptedData,
      iv: rawUser.iv,
      thirdSession: this.getAuthValue('thirdSession')
    }
    return await this.get(url, param)
  }

  /**
   * 获取用户信息
   */
  static async user () {
    try {
      // 检查
      const thirdSession = this.getAuthValue('thirdSession')
      let res = await this.checkLogin(thirdSession)
      if (res) {
        return true
      }
      // 重新登录
      await this.doLogin()
      // 获取用户信息
      const rawUser = await wepy.getUserInfo()
      await this.setConfig('UserInfo', rawUser)
      return true
    } catch (error) {
      console.error('[auth] 授权失败', error)
      return false
    }
  }
}
