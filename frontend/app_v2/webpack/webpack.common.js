const webpack = require('webpack')
const alias = require('./webpack.alias')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackSkipAssetsPlugin = require('html-webpack-skip-assets-plugin').HtmlWebpackSkipAssetsPlugin
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const { ModuleFederationPlugin } = require('webpack').container
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const gitRevisionPlugin = new GitRevisionPlugin({
  lightweightTags: true,
  branch: true,
})

module.exports = (env) => {
  return {
    entry: './src/index',
    resolve: {
      alias,
      extensions: ['.jsx', '.js', '.json'],
    },
    // https://webpack.js.org/configuration/performance/
    performance: {
      maxAssetSize: 250000,
      maxEntrypointSize: 250000,
      hints: 'warning',
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
                        /* See https://github.com/tailwindlabs/tailwindcss/discussions/2462 */
                        stage: 1,
                        features: {
                          'focus-within-pseudo-class': false,
                        },
                      },
                    ],
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
      new MiniCssExtractPlugin({
        filename: 'assets/styles/[name].[contenthash].css',
        chunkFilename: 'assets/styles/[id].[contenthash].css',
      }),
      new webpack.DefinePlugin({
        ENV_NUXEO_URL: env && env.NUXEO_URL ? JSON.stringify(env.NUXEO_URL) : null,
        ENV_WEB_URL: env && env.WEB_URL ? JSON.stringify(env.WEB_URL) : null,
        ENV_CONTEXT_PATH: env && env.CONTEXT_PATH ? JSON.stringify(env.CONTEXT_PATH) : null,
      }),
      new ModuleFederationPlugin({
        name: 'app_v2',
        library: { type: 'var', name: 'app_v2' },
        filename: 'assets/js/remoteEntry.' + gitRevisionPlugin.commithash() + '.js',
        exposes: {
          './HeaderContainer': 'components/Header/HeaderContainer',
        },
        remotes: {
          app_v1: 'app_v1',
        },
        shared: {
          react: { eager: true, singleton: true, requiredVersion: '^17.0.1' },
          'react-dom': { eager: true, singleton: true, requiredVersion: '^17.0.1' },
          'react-redux': { eager: true, singleton: true, requiredVersion: '^17.0.1' },
          redux: { eager: true, singleton: true, requiredVersion: '^7.2.2' },
          'redux-thunk': { eager: true, singleton: true, requiredVersion: '^2.3.0' },
        },
      }),
      new HtmlWebpackPlugin({
        template: './index.html',
        templateParameters: {
          VERSION: gitRevisionPlugin.version(),
          COMMIT: gitRevisionPlugin.commithash(),
          BRANCH: gitRevisionPlugin.branch(),
          DATE: new Date().toLocaleString('en-CA', { timeZone: 'America/Vancouver' }),
          V1_URL: env.V1_URL || '',
        },
        minify: {
          collapseWhitespace: true,
          minifyCSS: true,
        },
      }),
      new HtmlWebpackSkipAssetsPlugin({
        // Exclude reference to own remoteEntry in HTML output
        skipAssets: ['assets/js/remoteEntry.' + gitRevisionPlugin.commithash() + '.js'],
      }),
      new CopyPlugin({
        patterns: [
          { from: alias.fonts, to: alias.distFonts },
          { from: alias.images, to: alias.distImages },
          { from: alias.favicons, to: alias.dist },
        ],
      }),
    ],
  }
}
