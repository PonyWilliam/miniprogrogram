const mysql = require('mysql')
const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async(event,context)=>{
    const connection = mysql.createConnection({
      "host":"sh-cynosdbmysql-grp-2o1mkprk.sql.tencentcdb.com",
      "port":21270,
      "user":"root",
      "password":"xiaowei123!",
      "database":"gostudy"
  })
    connection.connect()
    let sql = `UPDATE workers SET wxopenid="${event.openid}" WHERE id = ${event.id}`
    return new Promise((reslove,reject)=>{
        connection.query(sql,(err,res)=>{
            if(res!=undefined){
              reslove(res)
            }else{
              reslove('nodata')
            }
        })
    })
}