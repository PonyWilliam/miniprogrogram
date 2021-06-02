import {date} from '../../../utils/Date'
import {config} from '../../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
      has:true,
      info:[],
      success:'',
      error:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.getData()
  },
  getData:function(){
    wx.showLoading({
      title: '加载数据中···',
    })
    let worker = []
    let product = []
    wx.request({
      url: `${config.url}/work/rsp`,
      method:'GET',
      header:{
          "Authorization":wx.getStorageSync('token')
      },
      success:res=>{
          if(res.data == (null || undefined) || res.data.data == (undefined || null)){
              //不需要做下面的操作了，没数据
              this.setData({
                has:false
              })
              wx.hideLoading()
              return
          }
          wx.request({
            url: `${config.url}/work/workers`,
            header:{
              "Authorization":wx.getStorageSync('token')
            },
            success:res2=>{
                for(let x of res2.data.data.workers){
                    worker[x.ID] = x//存储全部的worker信息
                }
                //找product信息
                wx.request({
                  url: `${config.url}/product`,
                  success:res3=>{
                      if(res3.data == undefined || res3.data.data == (undefined || null)){
                          return
                      }
                      console.log(res3.data)
                      for(let x of res3.data.data){
                          product[x.id] = x
                      }
                      //归位
                      let result = []
                      for(let x of res.data.data){
                          x.Pname = product[x.PID].product_name
                          x.ReqName = worker[x.ReqWID].Name
                          x.RspName = worker[x.RspWID].Name
                          x.strTime = date.formatDate(new Date(x.Time*1000),"YYYY-MM-DD HH:ii:ss")
                          if(x.RspTime > 0){
                              x.strRspTime = date.formatDate(new Date(x.RspTime*1000),"YYYY-MM-DD HH:ii:ss")
                          }
                          result.push(x)
                      }
                      this.setData({
                          info:result,//渲染到视图层
                          has:true
                      })
                      console.log(this.data.info)
                      wx.hideLoading()
                  }
                })
            }
          })
      }
    })
  },
  accept(e){
      //先弹出确认
      
      wx.showModal({
          title:"确认同意吗",
          content:"确认同意后物品后续所有权将归您所有，不能反悔了哦",
          success:res=>{
              if(res.confirm){
                  //go
                  wx.showLoading({
                    title: '提交中...',
                  })
                  let id = e.currentTarget.dataset.id
                  let url = `${config.url}/work/confirm/${id}`
                  wx.request({
                    url,
                    method:"POST",
                    header:{
                        "Authorization":wx.getStorageSync('token')
                    },
                    success:res2=>{
                        console.log(res2)
                        wx.hideLoading()
                        if(res2.data.msg == "success update"){
                            this.setData({
                                success:"已成功同意",
                            })
                            return
                        }else{
                            this.setData({
                                error:res2.data.msg || "未知错误",
                            })
                        }
                    }
                  })
              }else{
                  return
              }
          }
      })
  },
  reject:function(id){
    wx.showModal({
      title:"确认拒绝吗",
      content:"确认拒绝后接受后不能反悔了哦！",
      success:res=>{
          if(res.confirm){
              //go
              wx.showLoading({
                title: '提交中...',
              })
              let id = e.currentTarget.dataset.id
              let url = `${config.url}/work/reject/${id}`
              wx.request({
                url,
                method:"POST",
                header:{
                    "Authorization":wx.getStorageSync('token')
                },
                success:res2=>{
                    console.log(res2)
                    wx.hideLoading()
                    if(res2.data == undefined){
                        this.setData({
                            error:'未知错误'
                        })
                    }else if(res2.data.msg == "success update"){
                        this.setData({
                            success:"已成功拒绝",
                        })
                    }else{
                        this.setData({
                            error:res2.data.msg || "未知错误",
                        })
                    }
                }
              })
          }else{
              return
          }
      }
  })
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