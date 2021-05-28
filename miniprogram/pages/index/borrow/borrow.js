// miniprogram/pages/index/borrow/borrow.js
import {config} from '../../../utils/util'
import {date} from '../../../utils/Date'
Page({

  /**
   * 页面的初始数据
   */
  data: {
      result:[],
      product:[],
      show:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      wx.request({
        url: `${config.url}/product`,
        method:'GET',
        success:res=>{
            let product = []
            if(res.data.data == (undefined || null)){
              return
            }
            for(let x of res.data.data){
                product[x.id] = x
            }
            this.setData({
              product
            })
            //继续寻找用户租借记录
            wx.request({
              url: `${config.url}/work/borrow/user`,
              method:'GET',
              header:{
                  "Authorization":wx.getStorageSync('token')
              },
              data:{
                  "now":"123"//不需要实时数据
              },
              success:res=>{
                  if(res.data.data == undefined || null){
                      //不用做了
                      return
                  }
                  let result = []
                  for(let x of res.data.data.logs){
                      x["Pinfo"] = this.data.product[x.PID]
                      x["StrBorrowTime"] = date.formatDate(new Date(x.BorrowTime*1000),"YYYY-MM-DD HH:ii:ss")
                      x["StrReturnTime"] = x.ReturnTime > 0?date.formatDate(new Date(x.ReturnTime*1000),"YYYY-MM-DD HH:ii:ss"):"暂未归还"
                      result.push(x)
                  }
                  //插入完毕
                  if(result!=([] || undefined || null)){
                    this.setData({
                      result,
                      show:true
                     })
                  }
              }
            })
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