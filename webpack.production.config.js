const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require("clean-webpack-plugin");
const extractSass = new ExtractTextPlugin({
    filename: "css/style.css"
});
module.exports = {
    entry: __dirname + "/src/main.js", //已多次提及的唯一入口文件
    output: {
        path: __dirname + "/dist", //打包后的文件存放的地方
        filename: "js/bundle-[hash].min.js", //打包后输出文件的文件名
        publicPath: "/static/"
    },
    devtool: "null",
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader"
                },
                exclude: path.resolve(__dirname,"./node_modules"),
            },
            {
                test: /\.(scss|css)$/,
                use: extractSass.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: "css-loader",
                        // options: {
                        //     modules: true,
                        //     localIdentName:'[path][name]-[local]-[hash:base64:5]'
                        // }
                    }, {
                        loader: "sass-loader"
                    }],
                })
            },
            {
                test: /\.art$/,
                loader: "art-template-loader",
                options: {
                    // art-template options (if necessary)
                    // @see https://github.com/aui/art-template
                }
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    name: 'img/[name].[ext]',
                }
            },
            {
                test: /\.(htm|html)$/i,
                loader: 'html-withimg-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: __dirname + "/src/index.html" //new 一个这个插件的实例，并传入相关的参数
        }),
        new webpack.optimize.UglifyJsPlugin(),//压缩
        extractSass,
        new CleanWebpackPlugin('dist/*.*', {
            root: __dirname,
            verbose: true,
            dry: false
        })
    ],
    // 配置模块如何解析。
    resolve: {
        // 创建 import 或 require 的别名
        alias:{
            'scss':path.resolve(__dirname,'./src/common/scss')
        }
    }
}