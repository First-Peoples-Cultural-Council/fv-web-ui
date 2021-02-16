const alias = require('./webpack.alias')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = {
  entry: './src/index',
  resolve: {
    alias,
    extensions: ['.jsx', '.js', '.json'],
  },
  output: {
    filename: 'assets/js/[name].[contenthash].js',
    chunkFilename: 'assets/js/[name].[contenthash].js',
    publicPath: 'auto',
    path: alias.dist,
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
      // {
      //   test: /\.css$/i,
      //   use: [
      //     MiniCssExtractPlugin.loader,
      //     'css-loader',
      //     {
      //       loader: 'postcss-loader',
      //       options: {
      //         postcssOptions: {
      //           plugins: [
      //             [
      //               'postcss-preset-env',
      //               {
      //                 /* See https://github.com/tailwindlabs/tailwindcss/discussions/2462 */
      //                 stage: 1,
      //                 features: {
      //                   'focus-within-pseudo-class': false,
      //                 },
      //               },
      //             ],
      //           ],
      //         },
      //       },
      //     },
      //   ],
      // },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
}
