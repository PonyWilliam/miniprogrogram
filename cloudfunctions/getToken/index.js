// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request')
const url = "https://weapi.dadiqq.cn/work/wechat"
const headers = {
    'secret':'wechat666'
}
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  return new Promise((reslove,reject)=>{
    request.post({url:url, form:{'user':event.user},headers,json:true}, function(error, response, body) {
        reslove(body.token)
    })
  })
}