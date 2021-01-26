const alias = require('./webpack.alias')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { ModuleFederationPlugin } = require('webpack').container
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const postcssNormalize = require('postcss-normalize')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry: './src/index',
  resolve: {
    alias: alias,
    extensions: ['.jsx', '.js', '.json'],
  },
  output: {
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: require.resolve('babel-loader'),
        options: {
          exclude: [/node_modules/],
          presets: ['@babel/preset-react', '@babel/preset-env'],
          plugins: [
            [
              '@babel/plugin-transform-runtime',
              {
                corejs: 3,
              },
            ],
          ],
        },
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env',
                    {
                      // Options
                    },
                  ],
                  postcssNormalize(/* pluginOptions */),
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new ModuleFederationPlugin({
      name: 'app_v2',
      library: { type: 'var', name: 'app_v2' },
      filename: 'remoteEntry.js',
      exposes: {
        './HeaderContainer': 'components/Header/HeaderContainer',
      },
      remotes: {
        app_v1: 'app_v1',
      },
      // shared: { react: { singleton: true }, "react-dom": { singleton: true } },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
}
