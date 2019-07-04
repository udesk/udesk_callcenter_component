'use strict';
const baseWebpackConfig = require('./webpack.base.conf');
const merge = require('webpack-merge');
const webpack = require('webpack');

module.exports = merge(baseWebpackConfig, {
    devtool: 'source-map',
    mode: 'development',
    plugins: [
        new webpack.DefinePlugin({
<<<<<<< HEAD
            __server__: '\'.udesk.cn\'',
=======
            __server__: '\'.udeskcat.com\'',
>>>>>>> CCL-2148 {前端}通话组件conversation字段补充
            __protocol__: '\'https\''
        })
    ]
});
