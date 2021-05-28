// components/footer/footer.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      now: {
          type:Number,
          value:1,
      }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
      go1:function(){
          wx.redirectTo({
              url:'/pages/index/index'
          })
      },
      go2:function(){
        wx.redirectTo({
            url:'/pages/message/message'
        })
      },
      go3:function(){
        wx.redirectTo({
            url:'/pages/mine/mine'
        })
       },
       nothing:function(){
          //留着做个动画
       },
       
  },
})
