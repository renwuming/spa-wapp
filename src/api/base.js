// import wepy from 'wepy'
import http from '../utils/http'

export default class base {
  static get = http.get.bind(http)
  static put = http.put.bind(http)
  static post = http.post.bind(http)
  static delete = http.delete.bind(http)
}
