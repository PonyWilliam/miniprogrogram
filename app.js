const ci = require('miniprogram-ci')
;(async () => {
  const project = new ci.Project({
    appid: 'wx3e580f596fb2a3d3',
    type: 'miniProgram',
    projectPath: './miniprogram',
    privateKeyPath: './private.wx3e580f596fb2a3d3.key',
    ignores: ['node_modules/**/*'],
    
  })

  // const result = await ci.cloud.uploadFunction({
  //   project,
  //   env: 'dasai-8gg0xegvdb3b7671',
  //   name: 'gonggao',
  //   path: './cloudfunctions/gonggao',
  //   remoteNpmInstall: true, // 是否云端安装依赖
  // })
  // console.warn(result)
    const uploadResult = await ci.upload({
      project,
      version: '2.3.0',
      desc: 'fix some bugs',
      setting: {
        es6: false,
      },
      onProgressUpdate: console.log,
    })
    console.log(uploadResult)
})()