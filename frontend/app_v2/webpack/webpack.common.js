const webpack = require('webpack')
const alias = require('./webpack.alias')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const { ModuleFederationPlugin } = require('webpack').container
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const postcssNormalize = require('postcss-normalize')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const gitRevisionPlugin = new GitRevisionPlugin({
  lightweightTags: true,
  branch: true,
})

module.exports = (env) => {
  return {
    entry: './src/index',
    resolve: {
      alias: alias,
      extensions: ['.jsx', '.js', '.json'],
    },
    output: {
      publicPath: 'auto',
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
      new webpack.DefinePlugin({
        ENV_NUXEO_URL: env && env.NUXEO_URL ? JSON.stringify(env.NUXEO_URL) : null,
        ENV_WEB_URL: env && env.WEB_URL ? JSON.stringify(env.WEB_URL) : null,
        ENV_CONTEXT_PATH: env && env.CONTEXT_PATH ? JSON.stringify(env.CONTEXT_PATH) : null,
      }),
      new ModuleFederationPlugin({
        name: 'app_v2',
        library: { type: 'var', name: 'app_v2' },
        filename: 'remoteEntry.' + gitRevisionPlugin.commithash() + '.js',
        exposes: {
          './HeaderContainer': 'components/Header/HeaderContainer',
        },
        remotes: {
          app_v1: 'app_v1',
        },
        // shared: { react: { singleton: true }, "react-dom": { singleton: true } },
      }),
      new HtmlWebpackPlugin({
        template: './index.html',
        //inject: false,
        templateParameters: {
          VERSION: gitRevisionPlugin.version(),
          COMMIT: gitRevisionPlugin.commithash(),
          BRANCH: gitRevisionPlugin.branch(),
          DATE: new Date().toLocaleString('en-CA', { timeZone: 'America/Vancouver' }),
          V1_URL: env.V1_URL || 'http://0.0.0.0:3001',
        },
        minify: {
          collapseWhitespace: true,
          minifyCSS: true,
        },
      }),
    ],
  }
}
