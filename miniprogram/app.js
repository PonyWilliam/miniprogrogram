//app.js
App({
  getCloudOpenid: async function () {
    return this.openid = this.openid || (await wx.cloud.callFunction({name: 'getcontext'})).result.OPENID
  },
  getOpenid: async function () {
    (this.openid = this.openid || wx.getStorageSync('openid')) || wx.setStorageSync('openid', await this.getCloudOpenid())
    return this.openid
  },
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
        env:'dasai-8gg0xegvdb3b7671',
      })
    }

    this.globalData = {}
  }
})
