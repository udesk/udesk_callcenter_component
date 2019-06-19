'use strict';
const baseWebpackConfig = require('./webpack.base.conf');
const merge = require('webpack-merge');
const webpack = require('webpack');

module.exports = merge(baseWebpackConfig, {
    devtool: 'source-map',
    mode: 'development',
    plugins: [
        new webpack.DefinePlugin({
            __server__: '\'.udeskt3.com\'',
            __protocol__: '\'https\''
        })
    ]
});
