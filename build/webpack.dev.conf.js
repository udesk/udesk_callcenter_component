'use strict';
const baseWebpackConfig = require('./webpack.base.conf');
const merge = require('webpack-merge');
const webpack = require('webpack');

module.exports = merge(baseWebpackConfig, {
    devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin({
            __server__: '".cebbank.com:8080"',
            __protocol__: '"http"'
            //__server__: "''"
        })
    ]
});
