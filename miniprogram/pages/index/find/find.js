import {config} from '../../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [],
    area:[],
    product_area:[],
    index:0,
    result:[],
    error:null,
    showtable:false,
    showarea:false
  },
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let now = Date.parse(new Date()) / 1000
      if(!wx.getStorageSync('exp') || wx.getStorageSync('exp') < now){
          wx.redirectTo({
            url: '/pages/login/login',
          })
          return
      }
      let that = this
      wx.request({
        url: `${config.url}/product/Area`,
        header:{
          "Authorization":wx.getStorageSync('token')
        },
        success:function(res){
            let area = res.data.data
            let array = []
            let product_area = []
            if(area == (undefined || null)){
                return
            }
            for(let x of area){
                array.push(x.name)
                product_area[x.id] = x.name
            }
            that.setData({
              area:area,
              array:array,
              product_area:product_area
            })
            console.log(that.data.array)
        }
      })
  },
  find:function(){
      if(this.data.area == [] || this.data.area == undefined || this.data.area[this.data.index] == undefined){
          this.setData({
              error:'无法读取到数据库内库房信息',
          })
          return
      }
      //读取数据库
      wx.request({
        url: `https://hyh.dadiqq.cn/product/area/${this.data.area[this.data.index].id}`,
        header:{
          "Authorization":wx.getStorageSync('token')
        },
        success:res=>{
            this.setData({
                showtable:true,
                showarea:false,
                result:res.data.data
            })
            console.log(res.data.data)
        }
      })
  },
  findall:function(){
    if(this.data.area == [] || this.data.area == undefined){
        this.setData({
            error:'无法读取到数据库内库房信息',
        })
        return
    }
    //读取数据库
    wx.request({
      url: `https://hyh.dadiqq.cn/product/`,
      header:{
        "Authorization":wx.getStorageSync('token')
      },
      success:res=>{
          this.setData({
              showtable:true,
              showarea:true,
              result:res.data.data
          })
          console.log(res.data.data)
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