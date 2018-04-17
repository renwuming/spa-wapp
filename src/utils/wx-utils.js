import domTool from './domTool'

export default class WxUtils {
  /**
   * 兼容性判断
   */
  static canIUse(str) {
    if (wx.canIUse) {
      return wx.canIUse(str)
    } else {
      return false
    }
  }
  /**
   * 检查SDK版本
   */
  static isSDKExipred() {
    const {SDKVersion} = wx.getSystemInfoSync()
    console.info(`[version]sdk ${SDKVersion}`)
    return SDKVersion == null || SDKVersion < '1.2.0'
  }
  /**
   * 检查SDK版本
   */
  static checkSDK() {
    if (this.isSDKExipred()) {
      domTool.modal('您的微信版本太低，为确保正常使用，请尽快升级')
    }
  }
}
