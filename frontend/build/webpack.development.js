const { merge } = require('webpack-merge')
const common = require('./webpack.common')

/**
 * Development Webpack Configuration
 */
module.exports = env => merge(common(env), {
  mode: 'development',
  output: {
    publicPath: '/',
  },
  // See https://webpack.js.org/configuration/devtool/
  // Slow initial build, but gives ability to debug source code
  devtool: 'eval-source-map',
})
