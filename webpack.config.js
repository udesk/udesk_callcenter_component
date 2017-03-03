const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

module.exports = [{
    entry: './js/main.js',
    output: {
        path: './dist/',
        filename: 'callcenter-component.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/, exclude: /node_modules/, loader: ['style-loader', 'css-loader']
            },
            {
                test: /\.scss$/,
                loaders: ExtractTextPlugin.extract({
                    fallback: 'style-loader', use: ['css-loader?minimize', 'sass-loader']
                })
            },
            { test: /\.js|jsx$/, exclude: /node_modules/, loader: 'babel-loader' },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?name=fonts/[name].[ext]&limit=10000&mimetype=application/font-woff&publicPath=/"
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader?name=fonts/[name].[ext]&publicPath=/"
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new ExtractTextPlugin("css/callcenter-component.css"),
        //new UglifyJSPlugin()
    ]
}
];
