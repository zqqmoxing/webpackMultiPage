const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require("clean-webpack-plugin");

const extractSass = new ExtractTextPlugin({
    filename: "css/style.css"//打包的路径+文件名称
});// css打包成一个文件
// 引入多页面文件列表
const { HTMLDirs } = require("./src/common/js/config");
// 通过 html-webpack-plugin 生成的 HTML 集合
let HTMLPlugins = [];
// // 入口文件集合
let Entries = {};
// console.log(HTMLDirs)
//
// 生成多页面的集合，自动生成 HTML 文件，并自动引用打包后的 JavaScript 文件
HTMLDirs.forEach((page) => {
    const htmlPlugin = new HtmlWebpackPlugin({
        filename: `${page}.html`,
        template: path.resolve(__dirname, `src/view/${page}.html`),
        chunks: [page, 'commons'],//引入的js
    });
    HTMLPlugins.push(htmlPlugin);
    Entries[page] = path.resolve(__dirname, `src/common/js/${page}.js`);
});
// 合并数组
let plugins = [
    extractSass,
    new HtmlWebpackPlugin({
        template: __dirname + "/src/index.html"//new 一个这个插件的实例，并传入相关的参数
    }),
    new CleanWebpackPlugin(['dist/*.*'], {
        root: __dirname,
        verbose: true,
        dry: false
    }),//去除打包后的build文件中的残余文件
    /* 抽取出所有通用的部分 */
    new webpack.optimize.CommonsChunkPlugin({
        name: 'commons',      // 需要注意的是，chunk的name不能相同！！！
        filename: 'js/[name].js',
        minChunks: 4,
    }),
    new webpack.optimize.UglifyJsPlugin(),//压缩
];
let pluginsAll = plugins.concat(HTMLPlugins);
module.exports = {
    entry:Entries,
    output: {
        path: __dirname + "/dist", //打包后的文件存放的地方
        filename: "js/[name].bundle.js",//打包后输出文件的文件名
        publicPath: "./"
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
            // },{
            //     test: /\.(ttf)$/,
            //     loader: 'url-loader',
            //     options: {
            //         limit: 100000,
            //         publicPath:'../',
            //         name: 'css/[name].[ext]',
            //     }
            },{
                test: /\.(png|jpg|jpeg|gif|woff|svg|eot|woff2|ttf|mp4)$/,
                loader: 'url-loader',
                options: {
                    limit: 100000,
                    name: 'img/[name].[ext]',
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
    plugins: pluginsAll,
    // 配置模块如何解析。
    resolve: {
        // 创建 import 或 require 的别名
        alias:{
            'scss':path.resolve(__dirname,'./src/common/scss'),
            'plugins':path.resolve(__dirname,'./src/plugins'),
            'tpl':path.resolve(__dirname,'./src/common/tpl'),
        }
    }
}