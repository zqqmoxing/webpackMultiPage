const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin({
    filename: "css/[name].[chunkhash:8].css"//打包的路径+文件名称
});// css打包成一个文件


// 合并数组
let plugins = [
    extractSass,
    new HtmlWebpackPlugin({
        favicon:path.resolve(__dirname,'./favicon.ico'), //favicon路径
        template: __dirname + "/src/index.html",//new 一个这个插件的实例，并传入相关的参数
    }),
    /* 抽取出所有通用的部分 */
    //  new webpack.optimize.CommonsChunkPlugin({
    //     name: 'commons',      // 需要注意的是，chunk的name不能相同！！！
    //     filename: 'js/[name].js',
    //     chunks:_chunkArr,
    //     minChunks: htmlArr.length-1,//数量等于入口文件数量时，打包公用包
    // }),
];
let pluginsAll = plugins;

let modulesObj = {
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',

                query:{
                    presets:["env",'es2015']
                },
                //打包除这个文件之外的文件
                exclude: path.resolve(__dirname,"./node_modules"),
            },
            {
                test: /\.(scss|css)$/,
                use: extractSass.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "sass-loader"
                    }],
                })
            },
            {
                test: /\.art$/,
                loader: "art-template-loader"
            },
            {
                test: /\.(png|jpg|jpeg|gif|woff|svg|eot|ttf|woff2|mp4)$/,
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    name: 'img/[name].[hash:8].[ext]'
                }
            },
            {
                test: /\.(htm|html)$/i,
                loader: 'html-withimg-loader'
            },{
                test: require.resolve('jquery'),
                use: [{
                    loader: 'expose-loader',
                    options: '$'
                },{
                    loader: 'expose-loader',
                    options: 'jQuery'
                }]
            }
        ]
    },
    node: {
        fs: "empty"
    },
    resolve: {
        // 创建 import 或 require 的别名
        alias:{
            'scss':path.resolve(__dirname,'./src/common/scss'),
            'plugins':path.resolve(__dirname,'./src/plugins'),
            'tpl':path.resolve(__dirname,'./src/common/tpl'),
        }
    }
};

module.exports = {pluginsAll,modulesObj};