'use strict';
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: {
        'callcenter-component': path.resolve(__dirname, '../src/js/main.js'),
        'call-api': path.resolve(__dirname, '../src/js/CallAPI.js'),
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'js/[name].js',
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
            {test: /\.js|jsx$/, exclude: [/node_modules(?!\/debug)/, /static/], loader: 'babel-loader'},
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader?name=fonts/[name].[ext]&limit=10000&mimetype=application/font-woff&publicPath=../',
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader?name=fonts/[name].[ext]&publicPath=../',
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                loader: 'file-loader?name=imgs/[name].[ext]&publicPath=../',
            },
            {
                test: /\.mp3$/,
                loader: 'file-loader?name=sounds/[name].[ext]&publicPath=../',
            },
        ],
    },
    plugins: [
        new CopyWebpackPlugin([{from: 'index.html'}]),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
            chunkFilename: 'css/[id].css',
        }),
    ],
};
