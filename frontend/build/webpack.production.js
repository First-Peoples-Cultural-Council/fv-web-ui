const { merge } = require('webpack-merge')
const common = require('./webpack.common')

const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

/**
 * Production Webpack Configuration
 */
module.exports = env => merge(common(env), {
  mode: 'production',
  // TODO: configure server to disallow access to the Source Map file for normal users
  devtool: 'source-map',
  optimization: {
    // emitOnErrors: false,
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
})
