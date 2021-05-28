import {config} from '../../../utils/util'
Page({
  data: {
      inputShowed: false,
      inputVal: "",
      worker:{},
      showsearch:true,
      error:'',
      success:'',
      is:true,
      product:null,
      product_id:null,
      product_log:null,
      reason:'',
  },
  onLoad() {
      this.setData({
          search: this.search.bind(this)
      })
      let url = `${config.url}/product/worker/${wx.getStorageSync('worker').ID}`
      wx.request({
        url: url,
        method:'GET',
        header:{
            "Authorization":wx.getStorageSync('token')
        },
        success:res=>{
            if(res.data.code!=200){
                this.setData({
                    error:`错误:${res.data.msg}`
                })
                this.reconfirm()
                return
            }
            if(res.data.data == null || res.data.data == undefined){
                this.setData({
                    error:'你没有可转借的物品',
                    is:false,
                })
                this.reconfirm()
                return
            }
            this.setData({
                product:res.data.data
            })
            wx.request({
              url: `${config.url}/work/borrow/user`,
              method:'GET',
              header:{
                  "Authorization":wx.getStorageSync('token'),
              },
              data:{
                  "now":"now",
              },
              success:res=>{
                  let product_log = []
                  for(let x of res.data){
                      product_log[x.PID] = x
                  }
                  this.setData({
                      product_log:product_log
                  })
              }
            })
        }
      })
  },
  search: function (value) {
        this.setData({
          inputShowed:true
      })
      return new Promise((resolve, reject) => {
          wx.request({
            method:'GET',
            url: `${config.url}/work/workernum/${value}`,
            header:{
                "Authorization":wx.getStorageSync('token')
            },
            success:res=>{
                console.log(res.data.data.worker)
                if(res.data.data.worker == undefined){
                    return
                }
                //获取信息
                let arr = []
                arr.push({
                  'text':`${res.data.data.worker.Nums}（${res.data.data.worker.Name}）`,
                  'value':res.data.data.worker.ID,
                })
                resolve(arr)
            }
          })
      })
  },
  selectResult: function (e) {
      console.log(e.detail.item)
      this.setData({
        showsearch:false,
        worker:e.detail.item
      })
      let worker = wx.getStorageSync('worker')
      if(worker.ID == e.detail.item.value){
          this.setData({
            'error':'不能转借给自己'
          })
          this.reconfirm()
          return
      }
      
  },
  clear:function(e){
      this.setData({
        inputShowed:false
      })
  },
  reconfirm:function(){
      this.setData({
          showsearch:true,
          inputShowed:false,
      })
  },
  radioChange:function(e){
      this.setData({
        product_id:e.detail.value
      })
      
  },
  getreason:function(e){
      this.setData({
          reason:e.detail.value
      })
  },
  submit:function(){
      if(this.data.product_id == undefined || this.data.product_id == null){
          this.setData({
              error:'请先选择要转借的物品',
          })
          return
      }
      if(this.data.worker == null || this.data.worker == undefined){
          this.setData({
              error:'请选择要被转借的人'
          })
          return
      }
      //发送请求，返回结果
      if(this.data.product_log[this.data.product_id] == (null || undefined)){
          this.setData({
              error:'数据库未同步，请联系管理员',
          })
          return
      }
      if(this.data.reason.length < 5){
          this.setData({
              "error":"理由至少需要写5个字符",
          })
          return
      }
      //发送请求
      wx.request({
        url: `${config.url}/work/other`,
        header:{
            "Authorization":wx.getStorageSync('token'),
            "content-type":"application/x-www-form-urlencoded"
        },
        method:"POST",
        data:{
            "id":this.data.product_log[this.data.product_id].ID,
            "wid":this.data.worker.value,
            "reason":this.data.reason
        },
        success:res=>{
            console.log(res)
            if(res.data.code == undefined){
                this.setData({
                    error:'服务器出现未知错误'
                })
                return
            }
            if(res.data.code!=200){
                this.setData({
                    error:res.data.msg || "未知错误"
                })
                return
            }
            //成功
            this.setData({
                success:"已申请转借，请等待对方确认"
            })
            this.reconfirm()
        }
      })
  }
});
