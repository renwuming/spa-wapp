function wxR(url, method, data, resolve, reject) {
  wx.request({
    url: url,
    data: data,
    method: method,
    success: (data) => resolve(data),
    fail: (err) => reject(err)
  })
}

export default wxR
