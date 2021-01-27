const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = (env) =>
  merge(common(env), {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      port: 3002,
      historyApiFallback: true,
    },
    output: {
      publicPath: 'http://localhost:3002/',
    },
  })
