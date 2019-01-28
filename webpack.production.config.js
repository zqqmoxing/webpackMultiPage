const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
let baseConfig = require('./webpack.base.config.js');
let productVendor = require('./productVendor.js');
const { fileObj } = require("./src/common/js/config");// 引入多页面文件列表
const webpack = require('webpack');
const CleanWebpackPlugin = require("clean-webpack-plugin");

// 通过 html-webpack-plugin 生成的 HTML 集合
let HTMLPlugins = [];
// 入口文件集合
let Entries = {
    vendor:productVendor.vendor
};
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
                chunks: [_chunk,'vendor'],//引入的js
                hash:true
            });

            HTMLPlugins.push(htmlPlugin);
            Entries[`${_path}/${item.fileName.slice(0,-3)}`] = item.file;
        }
    });
});

// 合并数组
let plugins = [
    // new CleanWebpackPlugin(['dist/*'], {
    //     root: __dirname,
    //     verbose: true,
    //     dry: false
    // }),//去除打包后的build文件中的残余文件
    new webpack.optimize.UglifyJsPlugin(),//压缩
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        //chunks: [_chunkArr],
        filename: 'vendor.bundle.js',
        minChunks: Infinity,
    }),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
    }),
];
let plugins_All = plugins.concat(baseConfig.pluginsAll,HTMLPlugins);

let proExports = {
    entry:Entries,
    output: {
        path: __dirname + "/drone/", //打包后的文件存放的地方
        filename: "js/[name].bundle.js",//打包后输出文件的文件名
        //publicPath: "./",
        // publicPath: "/police/adjoint/"
        publicPath: "/drone/"
    },
    devtool: "null",
    plugins: plugins_All,
};
module.exports = Object.assign(proExports,baseConfig.modulesObj);