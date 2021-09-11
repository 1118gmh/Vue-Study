let path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports={
  mode:'development',
  entry:'./src/index.js',
  output:{
    filename:'bundle.js',
    path:path.resolve(__dirname,'build')
  },
  devServer: { 
    open:true, //自动打开浏览器
    port: 3000, //设置启动时的运行端口
    progress: true, //
    contentBase: './build', //指定托管的根目录
    compress: true, //gzip 可以提升返回页面的速度
    hot:true, //启动热更新（第一步）
    // proxy:{   //proxy代理
    //     '/':{
    //         target:'http://127.0.0.1:3001', //代理服务器
    //         changeOrigin:true //允许跨域
    //     }
    // }
},
plugins:[
    new webpack.HotModuleReplacementPlugin(), //new一个热更新的模块对象，这是启动热更新的（第三步） 
    new HtmlWebpackPlugin({
      template:'./index.html', //原文件路径
      filename:'index.html', //打包后文件
      minify: {
        removeAttributeQuotes: true, //去掉双引号
        collapseWhitespace: true //压缩成一行
      },
      hash: true //给引入的js文件添加hash值
  })
]
}