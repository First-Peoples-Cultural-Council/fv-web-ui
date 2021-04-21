// Webpack
const webpack = require('webpack')
const paths = require('./webpack.paths')
const alias = require('./webpack.alias')

// Path
const path = require('path')

// Root Directories
const frontEndRootDirectory = paths.frontEndRootDirectory

// Source Directories
const sourceDirectory = paths.sourceDirectory
const sourceImagesDirectory = paths.sourceImagesDirectory
const sourceFontsDirectory = paths.sourceFontsDirectory
const sourceFaviconsDirectory = paths.sourceFaviconsDirectory
const sourceGamesDirectory = paths.sourceGamesDirectory

// Output Directories
const outputDirectory = paths.outputDirectory
const outputDirectoryLegacy = paths.outputDirectoryLegacy
const outputScriptsDirectory = paths.outputScriptsDirectory
const outputFontsDirectory = paths.outputFontsDirectory
const outputImagesDirectory = paths.outputImagesDirectory
const outputStylesDirectory = paths.outputStylesDirectory
const outputGamesDirectory = paths.outputGamesDirectory

// Plugins
const WarningsToErrorsPlugin = require('warnings-to-errors-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackSkipAssetsPlugin = require('html-webpack-skip-assets-plugin').HtmlWebpackSkipAssetsPlugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const { ModuleFederationPlugin } = require('webpack').container

const gitRevisionPlugin = new GitRevisionPlugin({
  lightweightTags: true,
  branch: true,
})

const CircularDependencyPlugin = require('circular-dependency-plugin')

/**
 * Common Webpack Configuration
 */
module.exports = (env) => ({
  /**
   * The context is an absolute string to the directory that contains the entry files.
   **/
  context: sourceDirectory,

  /**
   * Set the mode to development mode
   **/
  mode: 'development',

  /**
   * Development Server
   **/
  devServer: {
    host: '0.0.0.0',
    port: 3001,
    historyApiFallback: {
      rewrites: [
        {
          // #context-path-issue
          // Ensure relative paths from CSS files are rewritten in local dev server
          from: /\/assets\/styles\/(.*)$/,
          to: function (context) {
            return '/' + context.match[1]
          },
        },
        {
          from: /\/assets\/(.*)$/,
          to: function (context) {
            return '/assets/' + context.match[1]
          },
        },
      ],
      disableDotRule: true,
      // verbose: true
    },
    // Ensure locally /nuxeo requests are rewritten to localhost:8080, unless rendering app
    proxy: [
      {
        context: ['/nuxeo/**', '!/nuxeo/app/**'],
        target: 'http://127.0.0.1:8080',
      },
    ],
  },

  /**
   * Entry
   */
  entry: {
    app: path.resolve(sourceDirectory, 'app.js'),
  },

  // These options change how modules are resolved
  resolve: {
    alias: alias,
    // Automatically resolve certain extensions.
    extensions: ['.js', '.less'],
    fallback: {
      stream: require.resolve('stream-browserify'),
      crypto: require.resolve('crypto-browserify'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      path: require.resolve('path-browserify'),
      zlib: require.resolve('browserify-zlib'),
    },
  },

  /**
   * The top-level output key contains set of options instructing
   * webpack on how and where it should output your bundles,
   * assets and anything else you bundle or load with webpack.
   **/
  output: {
    filename: path.join(outputScriptsDirectory, '[name].[contenthash].js'),
    chunkFilename: path.join(outputScriptsDirectory, '[name].[contenthash].js'),
    path: env && env.legacy ? outputDirectoryLegacy : outputDirectory,
    publicPath: 'auto',
  },

  /**
   * Plugins
   */
  plugins: [
    new CircularDependencyPlugin({
      // exclude detection of files based on a RegExp
      exclude: /a\.js|node_modules/,
      // include specific files based on a RegExp
      include: /dir/,
      // add errors to webpack instead of warnings
      failOnError: true,
      // allow import cycles that include an asyncronous import,
      // e.g. via import(/* webpackMode: "weak" */ './file.js')
      allowAsyncCycles: false,
      // set the current working directory for displaying module paths
      cwd: process.cwd(),
    }),
    new WarningsToErrorsPlugin(),
    new CleanWebpackPlugin(),
    // new CleanWebpackPlugin([env && env.legacy ? outputDirectoryLegacy : outputDirectory], { root: paths.rootDirectory }),
    new HtmlWebpackPlugin({
      template: path.resolve(frontEndRootDirectory, 'index.html'),
      templateParameters: {
        VERSION: gitRevisionPlugin.version(),
        COMMIT: gitRevisionPlugin.commithash(),
        BRANCH: gitRevisionPlugin.branch(),
        DATE: new Date().toLocaleString('en-CA', { timeZone: 'America/Vancouver' }),
        V2_URL: env.V2_URL || '/v2',
        IS_LEGACY: env && env.legacy ? true : false,
      },
      minify: {
        collapseWhitespace: true,
        minifyCSS: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: path.join(outputStylesDirectory, '[name].[contenthash].css'),
      chunkFilename: path.join(outputStylesDirectory, '[id].[contenthash].css'),
    }),
    new CopyPlugin({
      patterns: [
        { from: sourceFontsDirectory, to: outputFontsDirectory },
        { from: sourceImagesDirectory, to: outputImagesDirectory },
        { from: sourceFaviconsDirectory, to: env && env.legacy ? outputDirectoryLegacy : outputDirectory },
        { from: sourceGamesDirectory, to: outputGamesDirectory },
      ],
    }),
    new webpack.DefinePlugin({
      GIT_VERSION: JSON.stringify(gitRevisionPlugin.version()),
      ENV_NUXEO_URL: env && env.NUXEO_URL ? JSON.stringify(env.NUXEO_URL) : null,
      ENV_WEB_URL: env && env.WEB_URL ? JSON.stringify(env.WEB_URL) : null,
      ENV_CONTEXT_PATH: env && env.CONTEXT_PATH ? JSON.stringify(env.CONTEXT_PATH) : null,
    }),
    new ModuleFederationPlugin({
      name: 'app_v1',
      library: { type: 'var', name: 'app_v1' },
      filename: path.join(outputScriptsDirectory, 'remoteEntry.' + gitRevisionPlugin.commithash() + '.js'),
      exposes: {
        './useRoute': 'dataSources/useRoute',
        './FVProvider': 'components/FVProvider',
      },
      remotes: {
        'app_v2': 'app_v2',
      },
      shared: {
        react: { eager: true, singleton: true, requiredVersion: '^17.0.1' },
        'react-dom': { eager: true, singleton: true, requiredVersion: '^17.0.1' },
        'react-redux': { eager: true, singleton: true, requiredVersion: '^17.0.1' },
        'redux': { eager: true, singleton: true, requiredVersion: '^7.2.2' },
        'redux-thunk': { eager: true, singleton: true, requiredVersion: '^2.3.0' },
      },
    }),
    new HtmlWebpackSkipAssetsPlugin({
      // Exclude reference to own remoteEntry in HTML output
      skipAssets: [path.join(outputScriptsDirectory, 'remoteEntry.' + gitRevisionPlugin.commithash() + '.js')],
    }),
  ],

  /**
   * Module loader configuration
   */
  module: {
    rules: [
      /**
       * Script Loaders
       */
      {
        test: /\.js$/,
        use: [
          {

            loader: 'babel-loader',
            options: {
              exclude: env && env.legacy ? /node_modules\/(?!@fpcc|nuxeo)/ : /node_modules\/(?!@fpcc)/,
              cacheDirectory: true,
              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: {
                      node: 'current',
                    },
                  },
                ],
                '@babel/preset-react',
              ],
              plugins: [
                '@babel/plugin-syntax-jsx',
                '@babel/plugin-syntax-dynamic-import',
                ['@babel/plugin-proposal-decorators', { legacy: true }],
                ['@babel/plugin-proposal-class-properties', { loose: true }],
                '@babel/plugin-transform-runtime',
              ],
            },
          },
        ],
      },
      /**
       * Style Loaders
       */
      {
        test: /\.css$/i,
        use: ['style-loader', {
          loader: 'css-loader',
          options: {
            import: true,
          },
        }],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              // #context-path-issue
              // Disable resolving URLs because of context path - /nuxeo/app/
              // Absolute path /assets/image.jpg won't work on dev/uat, relative paths will throw compilation error otherwise.
              url: false,
            },
          },
          {
            loader: 'less-loader',
          },
        ],
      },
      /**
       * Font loaders
       */
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'url-loader?limit=10000&minetype=application/font-woff',
            options: {
              limit: 10000,
              mimetype: 'application/font-woff',
              name: path.join(outputFontsDirectory, '[name].[contenthash].[ext]'),
            },
          },
        ],
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/octet-stream',
              name: path.join(outputFontsDirectory, '[name].[contenthash].[ext]'),
            },
          },
        ],
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: path.join(outputFontsDirectory, '[name].[contenthash].[ext]'),
          },
        }],
      },
      /**
       * Image Loaders
       */
      {
        test: /\.(jpg|jpeg|png|gif)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: path.join(outputImagesDirectory, '[name].[contenthash].[ext]'),
          },
        }],
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            name: path.join(outputImagesDirectory, '[name].[contenthash].[ext]'),
            limit: 10000,
            mimetype: 'image/svg+xml',
          },
        }],
      },
    ],
  },

  // https://webpack.js.org/configuration/performance/
  performance: {
    maxAssetSize: 250000,
    maxEntrypointSize: 250000,
    hints: 'warning',
  },
})
