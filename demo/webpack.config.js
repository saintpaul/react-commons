const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const buildPath = path.join(__dirname, './build');
const sourcePath = './';
const context = path.join(__dirname, sourcePath);


var port = 8111;



module.exports = {
    devtool: 'eval-source-map',
    context,
    entry: {
        app: './index.jsx'
    },
    output: {
        path: buildPath,
        filename: 'js/[name]-[hash].js',
    },
    module: {
        rules : [{
            enforce: "pre",
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: [{
                loader  : "eslint-loader",
                options : {
                    failOnWarning: false,
                    failOnError: false,
                    formatter: require("eslint-friendly-formatter"),
                },
            }],
        },{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: [{
                loader: 'babel-loader'
            }],
        }, {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            enforce: "pre",
            loader:  "source-map-loader"
        },{
            test: /\.s?css$/,
            use: [{
                loader : "style-loader"
            }, {
                loader : "css-loader",
                options : {
                    sourceMap : true
                }
            }, {
                loader : "postcss-loader",
                options : {
                    sourceMap : true,
                    sourceComments : true,
                }
            }, {
                loader  : "sass-loader",
                options : {
                    sourceMap : true,
                    outputStyle : "nested"
                }
            }]
        }],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        modules: [
            'node_modules',
            sourcePath,
        ]
    },
    plugins : [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: process.env.NODE_ENV === 'production' ? JSON.stringify('production') : JSON.stringify('development'),
            },
        }),
        new HtmlWebpackPlugin({
            template: './index.html',
            path: buildPath,
            appMountId: 'app',
            mobile: true,
            filename: 'index.html',
            title: "React-commons Demo"
        }),
        new ProgressBarPlugin({
            summary: true
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        contentBase: sourcePath,
        port : port,
        compress: false,
        inline: true,
        hot: true,
        host: '0.0.0.0',
        stats: {
            assets: true,
            children: false,
            chunks: false,
            hash: false,
            modules: false,
            publicPath: false,
            timings: true,
            version: false,
            warnings: true,
            colors: {
                green: '\u001b[32m',
            },
        },
    },
};
