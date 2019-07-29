'use strict';
const baseWebpackConfig = require('./webpack.base.conf');
const merge = require('webpack-merge');
const webpack = require('webpack');

module.exports = merge(baseWebpackConfig, {
    devtool: 'source-map',
    mode: 'development',
    plugins: [
        new webpack.DefinePlugin({
            __server__: '\'.udeskt1.com\'',
            __protocol__: '\'https\'',
            '__PRODUCTION__': JSON.stringify(false)
        })
    ]
});
