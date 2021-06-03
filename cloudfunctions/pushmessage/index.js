const cloud = require('wx-server-sdk')
const mysql = require('mysql')
function addZero(v, size) {
  for (var i = 0, len = size - (v + "").length; i < len; i++) {
      v = "0" + v;
  };
  return v + "";
}
var date = {
  /**
   * [getTimeInterval 获取两个时间的间隔]
   * @author William
   * @DateTime 2021-04-16
   * @version  [version]
   * @param    {[type]}   st [开始时间]
   * @param    {[type]}   et [结束时间]
   * @return   {[type]}      [返回间隔的天、小时、分钟和秒]
   */
  getTimeInterval: function (st, et) {
      var dateLeft = 0,
          hourLeft = 0,
          minuteLeft = 0,
          secondLeft = 0,
          timeLeft = [0, 0, 0, 0],
          timeStr = "";
      var ts = (et > st) ? parseInt((et - st) / 1000) : 0;
      timeLeft[0] = (ts > 86400) ? parseInt(ts / 86400) : 0;
      ts = ts - timeLeft[0] * 86400;
      timeLeft[1] = (ts > 3600) ? parseInt(ts / 3600) : 0;
      ts = ts - timeLeft[1] * 3600;
      timeLeft[2] = (ts > 60) ? parseInt(ts / 60) : 0;
      timeLeft[3] = ts - timeLeft[2] * 60;
      timeStr = (timeLeft[0] > 0) ? timeLeft[0] + "天" : "";
      timeStr += (timeLeft[0] <= 0 && timeLeft[1] <= 0) ? "" : (timeLeft[1] + "小时");
      timeStr += (timeLeft[0] <= 0 && timeLeft[1] <= 0 && timeLeft[2] <= 0) ? "" : (timeLeft[2] + "分钟");
      timeStr += (timeLeft[0] <= 0 && timeLeft[1] <= 0 && timeLeft[2] <= 0 && timeLeft[3] <= 0) ? "" : timeLeft[3] + "秒";
      return timeStr;
  },
  /**
   * js 时间戳的转换（自定义格式）
   * @param  date [创建 Date 对象]
   * @param  formatStr [日期格式]
   * @return (string) 日期时间
   */
  formatDate: function (date, formatStr) {
      var arrWeek = ['日', '一', '二', '三', '四', '五', '六'],
          str = formatStr.replace(/yyyy|YYYY/, date.getFullYear()).replace(/yy|YY/, addZero(date.getFullYear() % 100, 2)).replace(/mm|MM/, addZero(date.getMonth() + 1, 2)).replace(/m|M/g, date.getMonth() + 1).replace(/dd|DD/, addZero(date.getDate(), 2)).replace(/d|D/g, date.getDate()).replace(/hh|HH/, addZero(date.getHours(), 2)).replace(/h|H/g, date.getHours()).replace(/ii|II/, addZero(date.getMinutes(), 2)).replace(/i|I/g, date.getMinutes()).replace(/ss|SS/, addZero(date.getSeconds(), 2)).replace(/s|S/g, date.getSeconds()).replace(/w/g, date.getDay()).replace(/W/g, arrWeek[date.getDay()]);
      return str;
  },
}
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})
exports.main = async (event, context) => {
    const wechat = cloud.getWXContext()
    let time = date.formatDate(new Date(),"YYYY-MM-DD HH:ii:ss")
    const connection = mysql.createConnection({
      "host":"sh-cynosdbmysql-grp-2o1mkprk.sql.tencentcdb.com",
      "port":21270,
      "user":"root",
      "password":"xiaowei123!",
      "database":"gostudy"
    })
    connection.connect()
    const res = await new Promise((reslove,reject)=>{
      let sql = `select * from workers where wxopenid!=''`
      connection.query(sql,(err,res)=>{
          if(res == undefined || typeof(res)!='object'){
              reslove('nodata')
          }else{
            reslove(res)
          }
        })
      })
      for(let x of res){
        try {
          const result = await cloud.openapi.subscribeMessage.send({
              "touser": x.wxopenid,
              "page": 'pages/message/message',
              "lang": 'zh_CN',
              "data": {
                "thing1": {
                  "value": `${event.title}`
                },
                "time2": {
                  "value": time
                }
              },
              "templateId": 'hHJ6oZvcFrTHermtIeVxVep_H4Il3-B00ZOTPNxa96Q',
              "miniprogramState": 'trial'
            })
        } catch (err) {
            continue
        }
      }
  return 1
}