const HtmlWebpackPlugin = require('html-webpack-plugin');
let baseConfig = require('./webpack.base.config.js');
const { fileObj } = require("./src/common/js/config");// 引入多页面文件列表
const path = require('path');
const webpack = require('webpack');
let Entries = {};
// 通过 html-webpack-plugin 生成的 HTML 集合
let HTMLPlugins = [];

let jsArr = fileObj.js;
let htmlArr = fileObj.html;
// 生成多页面的集合，自动生成 HTML 文件，并自动引用打包后的 JavaScript 文件
htmlArr.forEach((obj,index) => {
    let _file = obj.file;
    let _path = obj.path;
    let fileName = obj.fileName;
    jsArr.forEach(function(item,index1){
        let _path1 = item.path;
        let fileName1 = item.fileName;
        if(_path1 == _path && fileName.split('.')[0] == fileName1.split('.')[0]) {
            let htmlPlugin;
            var _chunk = `${_path}/${item.fileName.slice(0,-3)}`;
            htmlPlugin = new HtmlWebpackPlugin({
                favicon:path.resolve(__dirname,'./favicon.ico'), //favicon路径
                filename: `${_path}/${fileName}`,
                template: _file,
                chunks: [_chunk],//引入的js
                hash:true
            });
            console.log(_chunk)
            HTMLPlugins.push(htmlPlugin);
            Entries[`${_path}/${item.fileName.slice(0,-3)}`] = item.file;
        }
    });
});
// 合并数组
let plugins = [
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new webpack.HotModuleReplacementPlugin(),//热加载
    //new webpack.optimize.CommonsChunkPlugin({
    //    name: 'vendor',
    //    chunks: [baseConfig._chunkArr],
    //    filename: 'vendor.bundle.js',
    //    minChunks: Infinity,
    //})
];
let plugins_All = plugins.concat(baseConfig.pluginsAll,HTMLPlugins);

let proExports = {
    devtool: 'eval-source-map',//调试工具
    entry:Entries,
    output: {
        path: __dirname + "/build",//打包后的文件存放的地方
        filename: "js/[name].bundle.js",//打包后输出文件的文件名
        publicPath: "/"
    },
    devServer: {
        contentBase: "./build",//本地服务器所加载的页面所在的目录
        historyApiFallback: true,//不跳转
        inline: true,//实时刷新,可以监控js变化
        // hot: true,//热模块替换
        publicPath: "/",
        host: '127.0.0.1',
        port: 8083, // 默认8080
        // compress: true,
        // watchContentBase: false,
        proxy: {//代理
            // '/police/main': {
            //     target: 'http://10.1.14.50:8081',
            //     changeOrigin: true,
            //     secure: false
            // },
            '/mDrone/*': {
                // target: 'http://10.1.14.50:80',
                target: 'http://10.1.14.71:8084',
                changeOrigin: true,
                secure: false
            }
        }
    },
    plugins: plugins_All,
}
module.exports = Object.assign(proExports,baseConfig.modulesObj);