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
      errmsg:'',
      error:'',
      bind:false,
      success:'',
  },
  login1:function(){
    return new Promise((reslove,reject)=>{
      if(this.data.username == '' || this.data.password == ''){
        this.setData({
            show1:true
        })
        return 0
    }
      wx.showLoading({
        title: '绑 定 中',
      })
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
                reslove(0)
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
                console.log('执行完毕')
                reslove(1)
              }
            })
        }
    })
    })
  },
  login: function(){
    if(this.data.username == '' || this.data.password == ''){
        this.setData({
            show1:true
        })
        return 0
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
                wx.redirectTo({
                  url: '/pages/index/index',
                })
              }
            })
        }
    })
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
  wxlogin:async function(){
      wx.showLoading({
        title: '正在努力加载',
      })
      this.openid = await getApp().getOpenid()
      try{
        console.log(this.openid)
        const res = await wx.cloud.callFunction({name:'login',data:{openid:this.openid}})
        if(res.result != 'nodata'){
          //已绑定，获取token后直接允许登录
          console.log(res.result)
          let token = await wx.cloud.callFunction({
            'name':'getToken',
            data:{
              'username':res.result.username,
            }
          })
            token = token.result
            wx.setStorageSync('token', token)
            let timestamp = Date.parse(new Date()) / 1000;
            wx.setStorageSync('exp', timestamp + 3600 * 12 - 600)//有效期12个小时,预留10分钟防止掉线
            wx.setStorageSync('user', res.result.username)//保存用户名，用来查找用户
            let worker = {};
            worker.ID = res.result.id
            worker.Name = res.result.name
            worker.Nums = res.result.nums
            worker.Level = res.result.level
            worker.Score = res.result.score
            worker.Username = res.result.username
            wx.setStorageSync('worker', worker)
            wx.redirectTo({
              url: '/pages/index/index',
            })
          wx.hideLoading()
        }else{
          console.log('无法查询到')
          this.setData({
            error:'请先绑定一下账号哦~',
            bind:true,
          })
          wx.hideLoading()
          //要求绑定账号界面
        }
      }catch(err){
          console.log(err)
          this.setData({
            error:'请先绑定一下账号哦~',
            bind:true,
          })
          wx.hideLoading()
      }
  },
  gobind:async function(){
      const result = await this.login1()
      console.log('result start',result)
      if(result == 1){
          let worker = wx.getStorageSync('worker')
          console.log(worker)
          //登录成功，直接绑定信息
          console.log(worker.ID,this.openid)
          // {
          //   "id": 2,
          //   "openid": "oAF465KOCO1aeoHTX67DYnh5grSk"
          // }
          const res = await wx.cloud.callFunction({name:'bind',data:{id:worker.ID,openid:this.openid}})
          console.log(res)
          if(res.result=='nodata'){
              this.setData({
                error:'未知错误，绑定失败'
              })
              wx.clearStorageSync('exp')
              wx.clearStorageSync('token')
              wx.clearStorageSync('user')
              wx.clearStorageSync('worker')
              return
          }else{
              this.setData({
                success:'绑定成功'
              })
              setTimeout(()=>{
                  wx.redirectTo({
                    url: '/pages/index/index',
                  })
              },2000)
          }
      }else{
        wx.clearStorageSync('exp')
        wx.clearStorageSync('token')
        wx.clearStorageSync('user')
        wx.clearStorageSync('worker')
        console.log('登录失败')
      }
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