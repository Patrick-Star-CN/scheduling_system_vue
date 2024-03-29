module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'https://dev.patrickstar.net.cn/',//这里填入你要请求的接口的前缀
        //target:'http://127.0.0.1:8090',
        ws:false,//代理websocked
        changeOrigin:true,//虚拟的站点需要更管origin
        secure: true,                   //是否https接口
        pathRewrite:{
          '':''//重写路径
        }
      }
    }
  }
}
