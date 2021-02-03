const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = (env) =>
  merge(common(env), {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      port: 3002,
      historyApiFallback: true,
      proxy: [
        {
          context: ['/nuxeo/**', '!/nuxeo/app/**'],
          target: 'http://127.0.0.1:8080',
        },
      ],
    },
    output: {
      publicPath: 'http://localhost:3002/',
    },
  })
