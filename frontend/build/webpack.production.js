const merge = require('webpack-merge')
const common = require('./webpack.common')

const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

/**
 * Development Webpack Configuration
 */
module.exports = env => merge(common(env), {
  mode: 'production',
  devtool: '',
  optimization: {
    // consider enabling 'noEmitOnErrors' - see https://stackoverflow.com/questions/40080501/webpack-when-to-use-noerrorsplugin
    // noEmitOnErrors: true,
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
})
