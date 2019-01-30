'use strict';
const baseWebpackConfig = require('./webpack.base.conf');
const merge = require('webpack-merge');
const webpack = require('webpack');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = merge(baseWebpackConfig, {
    mode: 'production',
    plugins: [
        new webpack.DefinePlugin({
            __server__: '\'.udesk.cn\'',
            __protocol__: '\'https\'',
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
            },
        }),
        new OptimizeCssAssetsPlugin(),
    ],
});
