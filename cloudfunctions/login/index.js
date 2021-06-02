// 云函数入口文件
const mysql = require('mysql')
const cloud = require('wx-server-sdk')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const connection = mysql.createConnection({
        "host":"sh-cynosdbmysql-grp-2o1mkprk.sql.tencentcdb.com",
        "port":21270,
        "user":"root",
        "password":"xiaowei123!",
        "database":"gostudy"
    })
    connection.connect()
    return new Promise((reslove,reject)=>{
      if(event.openid == (undefined || null) || event.openid == ""){
        reject('error')
      }
      let sql = `select * from workers where wxopenid='${event.openid}'`
      console.log(sql)
      connection.query(sql,(err,res)=>{
          if(res == undefined || typeof(res)!='object'){
              reslove('nodata')
          }else{
            reslove(res[0])
          }
      })
    })
}