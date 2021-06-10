// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    return `
    测试账号与密码均为test1。本小程序、后端、门禁等物理硬件均在2021年开始制作，由于一个微信号只能注册5个小程序，团队队长微信截至参赛前已注册5个小程序账号，因此使用了之前注册的小程序进行重做。
    `
}