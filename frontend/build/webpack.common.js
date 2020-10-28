// Webpack
const webpack = require('webpack')

// Path
const path = require('path')

// Root Directories
const frontEndRootDirectory = path.resolve(__dirname, '..')
const rootDirectory = path.resolve(frontEndRootDirectory, '..')

// Source Directories
const sourceDirectory = path.resolve(frontEndRootDirectory, 'app')
const sourceAssetsDirectory = path.resolve(sourceDirectory, 'assets')
const sourceStateDirectory = path.resolve(sourceDirectory, 'state')
const sourceStylesDirectory = path.resolve(sourceAssetsDirectory, 'stylesheets')
const sourceImagesDirectory = path.resolve(sourceAssetsDirectory, 'images')
const sourceFontsDirectory = path.resolve(sourceAssetsDirectory, 'fonts')
const sourceFaviconsDirectory = path.resolve(sourceAssetsDirectory, 'favicons')
const sourceGamesDirectory = path.resolve(sourceAssetsDirectory, 'games')

// Output Directories
const outputAssetsDirectory = 'assets'
const outputDirectory = path.resolve(frontEndRootDirectory, 'public', 'evergreen')
const outputDirectoryLegacy = path.resolve(frontEndRootDirectory, 'public', 'legacy')
const outputScriptsDirectory = path.join(outputAssetsDirectory, 'javascripts')
const outputFontsDirectory = path.join(outputAssetsDirectory, 'fonts')
const outputImagesDirectory = path.join(outputAssetsDirectory, 'images')
const outputStylesDirectory = path.join(outputAssetsDirectory, 'styles')
const outputGamesDirectory = path.join(outputAssetsDirectory, 'games')

// Plugins
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const WarningsToErrorsPlugin = require('warnings-to-errors-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const GitRevisionPlugin = require('git-revision-webpack-plugin')

const gitRevisionPlugin = new GitRevisionPlugin({
  lightweightTags: true,
  branch: true,
})

// Phaser webpack config , requried by fv-games
// TODO : Move this as a peer dependency of games and have games to import them
const phaserModule = path.resolve('./node_modules/phaser-ce/')
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
const pixi = path.join(phaserModule, 'build/custom/pixi.js')
const p2 = path.join(phaserModule, 'build/custom/p2.js')

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
   * Source Mapping
   * enhance debugging by adding meta info for the browser devtools
   * source-map most detailed at the expense of build speed.
   **/
  devtool: '#source-map',

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
    game_libs: ['pixi', 'p2', 'phaser'],
  },

  // These options change how modules are resolved
  resolve: {
    alias: {
      assets: sourceAssetsDirectory,
      components: path.resolve(sourceDirectory, 'components'),
      common: path.resolve(sourceDirectory, 'common'),
      qa: path.resolve(sourceDirectory, 'qa'),
      state: sourceStateDirectory,
      dataSources: path.resolve(sourceStateDirectory, 'dataSources'),
      operations: path.resolve(sourceStateDirectory, 'operations'),
      reducers: path.resolve(sourceStateDirectory, 'reducers'),
      games: sourceGamesDirectory,
      images: sourceImagesDirectory,
      styles: sourceStylesDirectory,
      phaser: phaser,
      pixi: pixi,
      p2: p2,
    },

    // Automatically resolve certain extensions.
    extensions: ['.js', '.less'],
  },

  /**
   * Optimizations
   */
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
    },
  },

  /**
   * The top-level output key contains set of options instructing
   * webpack on how and where it should output your bundles,
   * assets and anything else you bundle or load with webpack.
   **/
  output: {
    filename: path.join(outputScriptsDirectory, '[name].[hash].js'),
    chunkFilename: path.join(outputScriptsDirectory, '[name].[hash].js'),
    path: env && env.legacy ? outputDirectoryLegacy : outputDirectory,
    publicPath: '',
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
    new CaseSensitivePathsPlugin({ debug: true }),
    new WarningsToErrorsPlugin(),
    new CleanWebpackPlugin([env && env.legacy ? outputDirectoryLegacy : outputDirectory], { root: rootDirectory }),
    new HtmlWebpackPlugin({
      template: path.resolve(frontEndRootDirectory, 'index.html'),
      templateParameters: {
        VERSION: gitRevisionPlugin.version(),
        COMMIT: gitRevisionPlugin.commithash(),
        BRANCH: gitRevisionPlugin.branch(),
        DATE: new Date().toLocaleString('en-CA', { timeZone: 'America/Vancouver' }),
        IS_LEGACY: env && env.legacy ? true : false,
      },
    }),
    new MiniCssExtractPlugin({
      filename: path.join(outputStylesDirectory, '[name].[hash].css'),
      chunkFilename: path.join(outputStylesDirectory, '[id].[hash].css'),
    }),
    new CopyPlugin([
      { from: sourceFontsDirectory, to: outputFontsDirectory },
      { from: sourceImagesDirectory, to: outputImagesDirectory },
      { from: sourceFaviconsDirectory, to: env && env.legacy ? outputDirectoryLegacy : outputDirectory },
      { from: sourceGamesDirectory, to: outputGamesDirectory },
    ]),
    new webpack.DefinePlugin({
      ENV_NUXEO_URL: env && env.NUXEO_URL ? JSON.stringify(env.NUXEO_URL) : null,
      ENV_WEB_URL: env && env.WEB_URL ? JSON.stringify(env.WEB_URL) : null,
      ENV_CONTEXT_PATH: env && env.CONTEXT_PATH ? JSON.stringify(env.CONTEXT_PATH) : null,
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
        loader: 'babel-loader',
        exclude: env && env.legacy ? /node_modules\/(?!@fpcc|nuxeo)/ : /node_modules\/(?!@fpcc)/,
        options: {
          cacheDirectory: true,
          presets: ['@babel/preset-env', '@babel/preset-react'],
          plugins: [
            ['@babel/plugin-syntax-dynamic-import'],
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            ['@babel/plugin-proposal-class-properties', { loose: true }],
          ],
        },
      },
      {
        test: require.resolve('react'),
        use: 'expose-loader?React',
      },
      /**
       * Look at removing this and just having peer dependencies
       **/
      {
        test: /pixi\.js/,
        use: {
          loader: 'expose-loader',
          query: 'PIXI',
        },
      },
      {
        test: /phaser-split\.js$/,
        use: {
          loader: 'expose-loader',
          query: 'Phaser',
        },
      },
      {
        test: /p2\.js/,
        use: {
          loader: 'expose-loader',
          query: 'p2',
        },
      },
      /**
       * Style Loaders
       */
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
        loader: 'url-loader?limit=10000&minetype=application/font-woff',
        options: {
          limit: 10000,
          mimetype: 'application/font-woff',
          name: path.join(outputFontsDirectory, '[name].[hash].[ext]'),
        },
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'application/octet-stream',
          name: path.join(outputFontsDirectory, '[name].[hash].[ext]'),
        },
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
        options: {
          name: path.join(outputFontsDirectory, '[name].[hash].[ext]'),
        },
      },
      /**
       * Image Loaders
       */
      {
        test: /\.(jpg|jpeg|png|gif)$/,
        loader: 'file-loader',
        options: {
          name: path.join(outputImagesDirectory, '[name].[hash].[ext]'),
        },
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          name: path.join(outputImagesDirectory, '[name].[hash].[ext]'),
          limit: 10000,
          mimetype: 'image/svg+xml',
        },
      },
    ],
  },

  /**
   * These options configure whether to polyfill or mock
   * certain Node.js globals and modules.
   * This allows code originally written for the Node.js environment
   * to run in other environments like the browser.
   */
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    console: true,
  },
  // https://webpack.js.org/configuration/performance/
  performance: {
    maxAssetSize: 250000,
    maxEntrypointSize: 250000,
    hints: 'warning',
  },
})
