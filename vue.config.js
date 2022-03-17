// 定义node.js请求转发配置

// proxyObj是请求转发对象，proxyObj['/']表示拦截http请求
let proxyObj = {};
proxyObj['/'] = {
  // ws表示webSocket，关闭webSocket
  ws: false,
  // target表示将请求转发去的目的地址。转发地址服务必须活跃，否则前端会显示无法跳转
  target: 'http://localhost:8090',
  changeOrigin: true,
  // pathRewrite表示请求地址是否重写
  pathRewrite: {
    // '^/'表示匹配拦截到的地址（正则匹配到/），匹配到的值是否重写。如：'^/a': 'b'源地址中含有/a的都会被替换为b。
    '^/': ''
  }
}

const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // devServer开发环境服务配置
  devServer: {
    // host指定转发来源地址
    host: 'localhost',
    // port指定转发来源端口
    port: 8080,
    // proxy指定转发目的的代理配置
    proxy: proxyObj
  }
})


