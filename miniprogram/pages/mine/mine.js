// miniprogram/pages/mine/mine.js
import {config} from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
  shows:1,
  qrimg:'',
  second:0,//验证码失效时间
  error:'',
  success:'',
  worker:{},
  otherinfo:{},
  ava:'',
  mineopacity:0.01,
  fullscreen:{
    width:"0px",
    height:"0px",
    blur:"blur(0px)",
    img:null,
    rgba:"rgba(255,255,255,.01)",
    padding:"0 0",
    opacity:"opacity:0.01"
  },//实现动画效果
  },
  reflash:function(){
    wx.redirectTo({
        url:'/pages/mine/mine'
    })
},
  /**
   * 生命周期函数--监听页面加载
   */
  logout: function(){
      wx.showModal({
          title:'退出账号',
          content:'是否确认退出账号，退出后需要重新登录',
          success(res){
              if(res.confirm){
                  wx.clearStorageSync('token')
                  wx.clearStorageSync('user')
                  wx.clearStorageSync('exp')
                  wx.clearStorageSync('worker')
                  wx.redirectTo({
                    url: '/pages/login/login',
                  })
              }
          }
      })
  },
  score:function(){
      wx.navigateTo({
        url: 'score/score',
      })
  },
  showqr:function(){
    this.setData({
        shows:1,
    })
    this.getQrcode()
    this.openfull()
  },
  closeqr:function(){
    this.closefull()
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
  onReady: function(){
    this.setData({
      worker:wx.getStorageSync('worker'),
      ava:`https://arcsoft.dadiqq.cn/face/${wx.getStorageSync('worker').ID}.png`
    })
      let now = Date.parse(new Date()) / 1000
      if(!wx.getStorageSync('exp') || wx.getStorageSync('exp') < now){
          wx.redirectTo({
            url: '/pages/login/login',
          })
          return
      }
      wx.hideLoading()
      //获取用户信息
  },
  getQrcode(e){
    if(e == undefined){
      this.setData({
        mineopacity:0.01,
      })
      wx.showLoading({
        title:'获取中···'
    })
    }else{
        wx.showLoading({
          title: '刷新中···',
        })
    }
    //能到这个页面就是已经验证了权限了，把worker信息传入即可。
    //通过request申请获取token
    wx.request({
      url: `${config.url}/work/qr`,
      method:"POST",
      header:{
        "Authorization":wx.getStorageSync('token')
      },success:res2=>{
        wx.cloud.callContainer({
          path: '/container-qrcode?url=' + res2.data.token, // 填入容器的访问路径（云托管-服务列表-路径）
          method: 'GET',
          responseType:"text",
          success:res=>{
              wx.hideLoading()
              this.setData({
                  qrimg:res.data,
                  second:30,
                  mineopacity:1,
              })
              if(e){
                if(e.currentTarget.dataset.id == 2){
                  this.setData({
                      success:"已刷新二维码",
                  })
                }
              }
          },fail:_=>{
              wx.hideLoading()
              this.setData({
                  error:'获取二维码失败，请检查网络'
              })
          }
        })
      },fail:_=>{
        wx.hideLoading()
        this.setData({
            error:"获取密钥失败，请尝试重新登录并检查网络"
        })
      }
    })
  },
  onLoad: function (options) {
      wx.showLoading({
          title:"加载中···"
      })
      setInterval(()=>{
          this.setData({
            second:this.data.second<=0?this.data.second:this.data.second - 1
          })
          if(this.data.second <=0 && this.data.fullscreen.width == "100%"){
              //100%代表是打开的，所以重新发送请求
              this.getQrcode()
          }
      },1000)
  },
  scanqr: function(){
      wx.scanCode({
          onlyFromCamera:true,
          success:res=>{
              wx.showLoading({
                title: '处理中···',
              })
              //请求
              console.log(res.result)
              wx.request({
                  url:`${config.url}/work/qr?secret=${res.result}`,
                  method:"GET",
                  success:res=>{
                      wx.hideLoading()
                      console.log(res.data)
                      if(res.data.code != 200){
                          this.setData({
                              error:'无法识别的二维码',
                          })
                          
                          return
                      }
                      //获取信息并显示
                      this.setData({
                          otherinfo:res.data.data.worker,
                          shows:2
                      })
                      this.openfull()
                  }
              })
          }
      })
  }
})