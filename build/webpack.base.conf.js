'use strict';
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: {
        'callcenter-component': path.resolve(__dirname, '../src/js/main.js'),
        'call-api': path.resolve(__dirname, '../src/js/CallAPI.js')
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'js/[name].js'
    },
    module: {
        loaders: [
            { test: /\.json$/, exclude: /node_modules/, loader: 'json'},
            {
                test: /\.css$/, exclude: /node_modules/, loader: 'style-loader!css-loader'
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract(['css-loader?minimize', 'sass-loader'])
                //loader: ExtractTextPlugin.extract({
                //    //fallback: 'style-loader', use: ['css-loader?minimize', 'sass-loader']
                //    notExtractLoader: 'style-loader', loader: 'css-loader?minimize!sass-loader'
                //})
            },
            {test: /\.js|jsx$/, exclude: [/node_modules/, /static/], loader: 'es3ify-loader!babel-loader'},
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader?name=fonts/[name].[ext]&limit=10000&mimetype=application/font-woff&publicPath=../'
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader?name=fonts/[name].[ext]&publicPath=../'
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                loader: 'file-loader?name=imgs/[name].[ext]&publicPath=../'
            },
            {
                test: /\.mp3$/,
                loader: 'file-loader?name=sounds/[name].[ext]&publicPath=../'
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([{from: 'index.html'}, {from: 'static'}]),
        new ExtractTextPlugin('css/callcenter-component.css')
    ]
};
