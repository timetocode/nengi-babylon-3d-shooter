const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
    mode: 'development',
    devServer: {
        contentBase: path.join(__dirname, './public'),
        publicPath: 'http://localhost:8080/js/',
        compress: true,
        port: 8080
    }
})
