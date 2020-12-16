const { merge } = require('webpack-merge')
const common = require('./webpack.common')

const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

/**
 * Development Webpack Configuration
 */
module.exports = env => merge(common(env), {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    // emitOnErrors: false,
    minimize: true,
    minimizer: [
      new OptimizeCSSAssetsPlugin({}),
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
    ],
  },
})
