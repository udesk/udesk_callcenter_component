"use strict";
const baseWebpackConfig = require("./webpack.base.conf");
const merge = require("webpack-merge");
const webpack = require("webpack");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

module.exports = merge(baseWebpackConfig, {
    plugins: [
        new webpack.DefinePlugin({
            __server__: "'.udesk.cn'"
        }),
        new UglifyJSPlugin()
    ]
});
