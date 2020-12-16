const { merge } = require('webpack-merge')
const common = require('./webpack.common')

const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

/**
 * Production Webpack Configuration
 */
module.exports = env => merge(common(env), {
  mode: 'production',
  optimization: {
    // emitOnErrors: false,
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
})
