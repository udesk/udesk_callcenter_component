'use strict';
const { rspack } = require('@rspack/core');
const path = require('path');

module.exports = {
    entry: {
        'callcenter-component': path.resolve(__dirname, '../src/js/main.js'),
        'call-api': path.resolve(__dirname, '../src/js/CallAPI.js')
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'js/[name].js',
        cssFilename: 'css/[name].css',
        cssChunkFilename: 'css/[id].css'
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                type: 'css',
                use: [{
                    loader: 'sass-loader',
                    options: {
                        sassOptions: {
                            quietDeps: true,
                            silenceDeprecations: ['import', 'slash-div']
                        }
                    }
                }]
            },
            {test: /\.jsx?$/, exclude: [/node_modules(?!\/debug)(?!\/webrtc-adapter)/, /static/], loader: 'babel-loader'},
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                type: 'asset',
                parser: {dataUrlCondition: {maxSize: 10000}},
                generator: {filename: 'fonts/[name][ext]', publicPath: '../'}
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                type: 'asset/resource',
                generator: {filename: 'fonts/[name][ext]', publicPath: '../'}
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                type: 'asset/resource',
                generator: {filename: 'imgs/[name][ext]', publicPath: '../'}
            },
            {
                test: /\.mp3$/,
                type: 'asset/inline'
            }
        ]
    },
    plugins: [
        new rspack.CopyRspackPlugin({
            patterns: [{from: 'index.html'}]
        })
    ]
};
