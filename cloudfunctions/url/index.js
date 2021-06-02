const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.urllink.generate({
        "path": '/pages/index/index',
        "query": '',
        "isExpire": false,
        "expireType": 1,
        "expireInterval": 5,
      })
    return result
  } catch (err) {
    return err
  }
}