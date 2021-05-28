// miniprogram/pages/login/score/score.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    worker:[],
    scaleTextStyle:{
      show:true,
      size:12,
      color:'#666'
    },
    indicatorTextStyle:{
      show:true,
      size:18,
      text:'信誉分'
    },
    indicatorValueStyle: {
      show: true,
      size: 55,
      color:'#4575e8'
    },
    indicatorCircleStyle:{
      show:true,
      boderColor:[
        {
          progress:0,
          value:"#4575e8"
       },
        {
          progress: 1,
          value: "#fff"
        }
      ]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      wx.showLoading({
        title: '加载中···',
      })
      this.setData({
          worker:wx.getStorageSync('worker')
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      wx.hideLoading()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})