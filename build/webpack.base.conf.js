"use strict";
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const path = require("path");

module.exports = {
    entry: "./src/js/main.js",
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "js/callcenter-component.js"
    },
    module: {
        rules: [
            {
                test: /\.css$/, exclude: /node_modules/, loader: ["style-loader", "css-loader"]
            },
            {
                test: /\.scss$/,
                loaders: ExtractTextPlugin.extract({
                    fallback: "style-loader", use: ["css-loader?minimize", "sass-loader"]
                })
            },
            {test: /\.js|jsx$/, exclude: [/node_modules/, /static/], loader: "babel-loader"},
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?name=fonts/[name].[ext]&limit=10000&mimetype=application/font-woff&publicPath=../"
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader?name=fonts/[name].[ext]&publicPath=../"
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                loader: "file-loader?name=imgs/[name].[ext]&publicPath=../"
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([{from: "index.html"}]),
        new ExtractTextPlugin("css/callcenter-component.css")
    ]
};
