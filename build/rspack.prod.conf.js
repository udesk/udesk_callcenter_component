'use strict';
const baseRspackConfig = require('./rspack.base.conf');
const { merge } = require('rspack-merge');
const { rspack } = require('@rspack/core');

module.exports = merge(baseRspackConfig, {
    mode: 'production',
    plugins: [
        new rspack.DefinePlugin({
            __server__: '\'.udesk.cn\'',
            __protocol__: '\'https\'',
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
            },
            '__PRODUCTION__': JSON.stringify(true)
        })
    ]
});
