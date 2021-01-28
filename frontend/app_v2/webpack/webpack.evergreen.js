const path = require('path')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
module.exports = (env) =>
  merge(common(env), {
    mode: 'production',
    devtool: 'source-map',
    output: {
      filename: 'main.evergreen.js',
      path: path.resolve(process.cwd(), 'dist'),
    },
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
    },
    module: {
      rules: [
        {
          test: /\.js?$/,
          loader: require.resolve('babel-loader'),
          options: {
            exclude: [/node_modules/],
            presets: [
              '@babel/preset-react',
              [
                '@babel/preset-env',
                {
                  modules: false,
                  useBuiltIns: 'usage',
                  corejs: '3.6.5',
                  // debug: true,
                  forceAllTransforms: true,
                  targets: {
                    browsers: ['Chrome >= 45', 'Safari >= 10', 'iOS >= 10', 'Firefox >= 22', 'Edge >= 12'],
                  },
                },
              ],
            ],
          },
        },
      ],
    },
  })
