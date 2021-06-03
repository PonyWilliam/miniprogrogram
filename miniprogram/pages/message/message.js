//index.js
import {date} from "../../utils/Date"
const app = getApp()
const db = wx.cloud.database()
Page({
  data:{
      messages:[],
      worker:{},
      success:"",
      error:"",
      title:"",
      content:"",
      name:"",
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
  onLoad:function(){
    this.setData({
        worker:wx.getStorageSync('worker')
    })
    this.getMessage()
  },
  getMessage:function(){
      //通过云数据库获取消息
      wx.showLoading({
        title: '加载中',
      })
      let that = this
      db.collection('message').orderBy('time','desc').get({
        success: function(res) {
        that.setData({
            messages:res.data
        })
        wx.hideLoading()
       },fail:res=>{
          wx.hideLoading()
          this.setData({
              error:"获取数据库信息失败，请检查网络"
          })
       }
      })
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
      },
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
  closefull:function(data = 1){
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
            rgba:"rgba(255,255,255,.01)",
            title:"",
            content:"",
            name:"",
        }
    })
    if(data == 2){
        //刷新标志
        this.getMessage()
    }
    },1000)
  },
  submit:async function(){
      if(this.data.worker.ID != 1){
          //没全县
          this.setData({
              error:"您没有权限发布通知哦",
          })
          return
      }
      if(this.data.name == "" || this.data.content == "" || this.data.title == ""){
          this.setData({
              error:"信息不全，请输入全部信息后提交"
          })
          return
      }
      let time = date.formatDate(new Date(),"YYYY-MM-DD HH:ii:ss")
      const res = await wx.cloud.callFunction({
          "name":"pushmessage",
          data:{
              title:this.data.title
          }
      })
      console.log(res)
      db.collection('message').add({
          data: {
              title:this.data.title,
              content:this.data.content,
              name:this.data.name,
              time:time
          },
          success:res=>{
              this.closefull(2)//关闭,加个参数，用来做刷新标志
              this.setData({
                  success:"已成功发布通知啦！"
              })
          }
      })
  },
  cancel:function(){
      wx.showModal({
          title:"确认取消吗",
          content:"取消后将删除已填入数据哦",
          success:res=>{
              if(res.confirm){
                  //取消
                  this.closefull()
              }
          }
      })
  }
})