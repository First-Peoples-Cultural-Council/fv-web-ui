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
      filename: 'main.legacy.js',
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
                  corejs: { version: '3.6.5', proposals: true },
                  // debug: true,
                  targets: {
                    browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'ie >= 11'],
                  },
                },
              ],
            ],
          },
        },
      ],
    },
  })
