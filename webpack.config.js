module.exports = {
    entry: './js/main.js',
    output: {
        path: './dist/',
        filename: 'callcenter-component.js'
    },
    module: {
        loaders: [
            { test: /\.css$/, exclude: /node_modules/, loader: 'style!css' },
            {
                test: /\.scss$/, exclude: /node_modules/, loaders: ['style-loader', 'css-loader?minimize', 'sass-loader'
            ]
            },
            { test: /\.js|jsx$/, exclude: /node_modules/, loader: 'babel-loader' },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff&publicPath=dist/" },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader?publicPath=dist/" }
        ]
    }
};
