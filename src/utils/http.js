import wepy from 'wepy'
import wxR from '../api/wxR'

export default class http {
  static async request (method, url, data, loading = true) {
    // console.log('确认请求')
    const param = {
      url: url,
      method: method,
      data: data
    }
    let result = ''
    result = await wepy.request(param)
    return result.data
  }

  static isSuccess (res) {
    const wxCode = res.statusCode
    if (wxCode !== 200) {
      return false
    }
    const wxData = res.data
    return wxData.code === 200
  }

  static requestException (res) {
    const error = {}
    error.statusCode = res.statusCode
    const wxData = res.data
    const serverData = wxData.data
    if (serverData) {
      error.serverCode = wxData.code
      error.message = serverData.message
      error.serverData = serverData
    }
    return error
  }

  static get (url, data, loading = true) {
    console.log('getgetgteet')
    return this.request('GET', url, data, loading)
  }

  static put (url, data, loading = true) {
    return this.request('PUT', url, data, loading)
  }

  static post (url, data, loading = true) {
    return this.request('POST', url, data, loading)
  }

  static patch (url, data, loading = true) {
    return this.request('PATCH', url, data, loading)
  }

  static delete (url, data, loading = true) {
    return this.request('DELETE', url, data, loading)
  }
}
