const merge = require('webpack-merge')
const common = require('./webpack.common')

/**
 * Development Webpack Configuration
 */
module.exports = env => merge(common(env), {
  mode: 'development',
  output: {
    publicPath: '/',
  },
})
