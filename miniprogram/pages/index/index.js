//index.js
const app = getApp()
Page({
  data:{
      worker:null,
      full:false,
      fullscreen:{
        width:"0px",
        height:"0px",
        blur:"blur(0px)",
        img:null,
        rgba:"rgba(255,255,255,.01)",
        padding:"0 0",
        opacity:"opacity:0.01"
      },//实现动画效果
      cards:[
          {
              title:'设备查询',
              content:'查询仓库内可出借的产品'
          },
          {
            title:'我的租借',
            content:'查询我正在租借的物品以及历史租借物品'
          },
          {
            title:'转借他人',
            content:'为了方便大家之间转借，在此申请即可'
          },
          {
            title:'他人转借',
            content:'其他人如果申请了转借给我，可以在这里查看'
          },
          {
            title:'如何使用',
            content:'学习本程序如何使用的视频演示'
          },
          {
            title:'关于我们',
            content:'爆米花不是花团队介绍'
          }
      ]
  },
  go1:function(){
      wx.navigateTo({
        url: 'find/find',
      })
  },
  go2:function(){
      wx.navigateTo({
        url: 'borrow/borrow',
      })
  },
  go3:function(){
      wx.navigateTo({
        url: 'toother/toother',
      })
  },
  go4:function(){
      wx.navigateTo({
        url: 'confirm/confirm',
      })
  },
  go5:function(){

  },
  go6:function(){
    this.openfull()
  },
  openfull:function(){
    this.setData({
      fullscreen:{
          width:"100%",
          height:"100%",
          blur:"blur(5px)",
          rgba:"rgba(255,255,255,.45)",
          padding:"30rpx 20rpx",
          opacity:"opacity:0.01"
      }
    })
    //动画效果，等待完全出现后再开始展示内容
    setTimeout(()=>{
        this.setData({
            fullscreen:{
              width:"100%",
              height:"100%",
              blur:"blur(5px)",
              rgba:"rgba(255,255,255,.45)",
              padding:"30rpx 20rpx",
              opacity:"opacity:1"
            }
        })
    },700)
  },
  closefull:function(){
    this.setData({
        fullscreen:{
          width:"100%",
          height:"100%",
          blur:"blur(5px)",
          rgba:"rgba(255,255,255,.45)",
          padding:"30rpx 20rpx",
          opacity:"opacity:0.01"
        }
    })
    //先让内容消失，再控制形状
    setTimeout(()=>{
      this.setData({
        fullscreen:{
            opacity:"opacity:0.01",
            width:"0px",
            height:"0px",
            blur:"blur(0px)",
            rgba:"rgba(255,255,255,.01)"
        }
    })
    },1000)
  },
  onLoad:function(){
    wx.showLoading()
    let exptime = wx.getStorageSync('exp')
    if(exptime == undefined){
      wx.redirectTo({
        url: '/pages/login/login',
      })
      wx.clearStorageSync('exp')
      wx.clearStorageSync('token')
      wx.clearStorageSync('user')
      wx.clearStorageSync('worker')
      return
    }
    let now = Date.parse(new Date()) / 1000
    if(now < exptime){
        //可以使用
        let worker = wx.getStorageSync('worker')
        this.setData({
            worker
        })
        return
    }
    wx.redirectTo({
      url: '/pages/login/login',
    })
    wx.clearStorageSync('exp')
    wx.clearStorageSync('token')
    wx.clearStorageSync('user')
    wx.clearStorageSync('worker')
},
  onReady:function(){
      wx.hideLoading()
  }
})