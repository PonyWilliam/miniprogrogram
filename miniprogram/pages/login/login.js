// miniprogram/pages/login/login.js
import {config} from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
      username:'',
      password:'',
      oneButton: [{text: '确定'}],
      show1:false,
      show2:false,
      errmsg:''
  },
  login: function(){
    if(this.data.username == '' || this.data.password == ''){
        this.setData({
            show1:true
        })
        return
    }
    wx.showLoading({
      title: '登 录 中',
    })
    console.log(this.data.username,this.data.password)
    wx.request({
        url: `${config.url}/work/login`,
        method:'POST',
        data:{
            'username':this.data.username,
            'password':this.data.password
        },
        header:{
            "content-type":"application/x-www-form-urlencoded"
        },
        success:res=>{
            console.log(res)
            wx.hideLoading()
            let data = res.data
            if(data.code == 500){
                //密码验证错误
                this.setData({
                    errmsg:data.msg,
                    show2:true
                })
                return
            }
            //密码正确，保存token和持续时间并跳转界面
            wx.setStorageSync('token', data.token)
            let timestamp = Date.parse(new Date()) / 1000;
            wx.setStorageSync('exp', timestamp + 3600 * 12 - 600)//有效期12个小时,预留10分钟防止掉线
            wx.setStorageSync('user', this.data.username)//保存用户名，用来查找用户
            wx.request({
              url: `${config.url}/work/workerusername/${this.data.username}`,
              header:{
                "Authorization":data.token
              },
              success:res=>{
                  wx.setStorageSync('worker', res.data.data.worker)
              }
            })
            wx.setStorageSync('worker', data)
            wx.redirectTo({
              url: '/pages/index/index',
            })
        }
    })
    //fetch数据库
    console.log(config.url)
  },
  close1: function(){
      this.setData({
        show1:false
      })
  },
  close2: function(){
      this.setData({
          show2:false,
      })
  },
  empty: function(){

  },
  onLoad: function (options) {
      let exptime = wx.getStorageSync('exp')
      if(exptime == undefined){
        return
      }
      let now = Date.parse(new Date()) / 1000
      if(now < exptime){
          wx.redirectTo({
            url: '/pages/index/index',
          })
          return
      }
      wx.clearStorageSync('exp')
      wx.clearStorageSync('token')
      wx.clearStorageSync('user')
      wx.clearStorageSync('worker')
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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