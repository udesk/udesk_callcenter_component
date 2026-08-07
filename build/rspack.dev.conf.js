'use strict';
const baseRspackConfig = require('./rspack.base.conf');
const { merge } = require('rspack-merge');
const { rspack } = require('@rspack/core');

module.exports = merge(baseRspackConfig, {
    devtool: 'source-map',
    mode: 'development',
    devServer: {
        port: 8080
    },
    plugins: [
        new rspack.DefinePlugin({
            __server__: '\'.udeskt1.com\'',
            __protocol__: '\'https\'',
            '__PRODUCTION__': JSON.stringify(false)
        })
    ]
});
