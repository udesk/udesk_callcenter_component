'use strict';
const baseRspackConfig = require('./rspack.base.conf');
const { merge } = require('rspack-merge');
const { rspack } = require('@rspack/core');

module.exports = merge(baseRspackConfig, {
    devtool: 'source-map',
    mode: 'development',
    devServer: {
        port: 8080,
        // 代理前端 open_api 请求，规避浏览器跨域限制；
        // 前端通过 x-udesk-host header 传入目标 host(subDomain+后缀)，router 据此动态转发
        proxy: [
            {
                context: ['/udesk-api'],
                target: 'https://placeholder.udesk.cn', // 占位，实际 target 由 router 决定
                changeOrigin: true,
                secure: false,
                pathRewrite: {'^/udesk-api': ''},
                router: function(req) {
                    var host = req.headers['x-udesk-host'];
                    return host ? 'https://' + host : 'https://placeholder.udesk.cn';
                },
                on: {
                    proxyReq: function(proxyReq) {
                        proxyReq.removeHeader('x-udesk-host');
                    }
                }
            }
        ]
    },
    plugins: [
        new rspack.DefinePlugin({
            __server__: '\'.udeskt1.com\'',
            __protocol__: '\'https\'',
            '__PRODUCTION__': JSON.stringify(false)
        })
    ]
});
