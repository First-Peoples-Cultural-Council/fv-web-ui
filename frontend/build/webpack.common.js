// Path
const path = require("path")

// Root Directories
const frontEndRootDirectory = path.resolve(__dirname, "..")
const rootDirectory = path.resolve(frontEndRootDirectory, "..")

// Source Directories
const sourceDirectory = path.resolve(frontEndRootDirectory, "app")
const sourceAssetsDirectory = path.resolve(sourceDirectory, "assets")
const sourceScriptsDirectory = path.resolve(sourceAssetsDirectory, "javascripts")
const sourceStylesDirectory = path.resolve(sourceAssetsDirectory, "stylesheets")
const sourceImagesDirectory = path.resolve(sourceAssetsDirectory, "images")
const sourceFontsDirectory = path.resolve(sourceAssetsDirectory, "fonts")
const sourceLibrariesDirectory = path.resolve(sourceAssetsDirectory, "libraries")
const sourceFaviconsDirectory = path.resolve(sourceAssetsDirectory, "favicons")
const sourceGamesDirectory = path.resolve(sourceAssetsDirectory, "games")

// Output Directories
const outputAssetsDirectory = "assets"
const outputDirectory = path.resolve(rootDirectory, "public")
const outputScriptsDirectory = path.join(outputAssetsDirectory, "javascripts")
const outputFontsDirectory = path.join(outputAssetsDirectory, "fonts")
const outputImagesDirectory = path.join(outputAssetsDirectory, "images")
const outputStylesDirectory = path.join(outputAssetsDirectory, "styles")
const outputLibrariesDirectory = path.join(outputAssetsDirectory, "libraries")
const outputGamesDirectory = path.join(outputAssetsDirectory, "games")

// Plugins
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CopyPlugin = require("copy-webpack-plugin")
const CleanWebpackPlugin = require("clean-webpack-plugin")
const GitRevisionPlugin = require("git-revision-webpack-plugin")

var gitRevisionPlugin = new GitRevisionPlugin()

// Phaser webpack config , requried by fv-games
// TODO : Move this as a peer dependency of games and have games to import them
const phaserModule = path.resolve("./node_modules/phaser-ce/")
const phaser = path.join(phaserModule, "build/custom/phaser-split.js")
const pixi = path.join(phaserModule, "build/custom/pixi.js")
const p2 = path.join(phaserModule, "build/custom/p2.js")

/**
 * Common Webpack Configuration
 */
module.exports = {
  /**
   * The context is an absolute string to the directory that contains the entry files.
   **/
  context: sourceDirectory,

  /**
   * Set the mode to development mode
   **/
  mode: "development",

  /**
   * Source Mapping
   * enhance debugging by adding meta info for the browser devtools
   * source-map most detailed at the expense of build speed.
   **/
  devtool: "#source-map",

  /**
   * Development Server
   **/
  devServer: {
    host: "0.0.0.0",
    port: 3001,
    historyApiFallback: true,
  },

  /**
   * Entry
   */
  entry: {
    app: path.resolve(sourceScriptsDirectory, "app.js"),
    game_libs: ["pixi", "p2", "phaser"],
  },

  // These options change how modules are resolved
  resolve: {
    alias: {
      styles: sourceStylesDirectory,
      models: path.resolve(sourceScriptsDirectory, "models"),
      views: path.resolve(sourceScriptsDirectory, "views"),
      conf: path.resolve(sourceScriptsDirectory, "configuration"),
      operations: path.resolve(sourceScriptsDirectory, "operations"),
      components: path.resolve(sourceScriptsDirectory, "components"),
      common: path.resolve(sourceScriptsDirectory, "common"),
      games: path.resolve(sourceAssetsDirectory, "games"),
      images: path.resolve(sourceAssetsDirectory, "images"),
      phaser: phaser,
      pixi: pixi,
      p2: p2,
    },

    // Automatically resolve certain extensions.
    extensions: [".js", ".less"],
  },

  /**
   * Optimizations
   */
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      chunks: "all",
    },
  },

  /**
   * The top-level output key contains set of options instructing
   * webpack on how and where it should output your bundles,
   * assets and anything else you bundle or load with webpack.
   **/
  output: {
    filename: path.join(outputScriptsDirectory, "[name].[hash].js"),
    chunkFilename: path.join(outputScriptsDirectory, "[name].[hash].js"),
    path: outputDirectory,
    publicPath: "/",
  },

  /**
   * Plugins
   */
  plugins: [
    new CleanWebpackPlugin([outputDirectory], { root: rootDirectory }),
    new MiniCssExtractPlugin({
      filename: path.join(outputStylesDirectory, "[name].[hash].css"),
      chunkFilename: path.join(outputStylesDirectory, "[id].[hash].css"),
    }),
    new CopyPlugin([
      { from: sourceFontsDirectory, to: outputFontsDirectory },
      { from: sourceImagesDirectory, to: outputImagesDirectory },
      { from: sourceLibrariesDirectory, to: outputLibrariesDirectory },
      { from: sourceFaviconsDirectory, to: outputDirectory },
      { from: sourceGamesDirectory, to: outputGamesDirectory },
    ]),
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
        loader: "babel-loader",
        exclude: /node_modules\/(?!@fpcc)/,
        options: {
          cacheDirectory: true,
          presets: ["@babel/preset-env", "@babel/preset-react"],
          plugins: [
            ["transform-react-jsx-component-data-ids"],
            ["@babel/plugin-syntax-dynamic-import"],
            ["@babel/plugin-proposal-decorators", { legacy: true }],
            ["@babel/plugin-proposal-class-properties", { loose: true }],
          ],
        },
      },
      {
        test: require.resolve("react"),
        use: "expose-loader?React",
      },
      /**
       * Look at removing this and just having peer dependencies
       **/
      {
        test: /pixi\.js/,
        use: {
          loader: "expose-loader",
          query: "PIXI",
        },
      },
      {
        test: /phaser-split\.js$/,
        use: {
          loader: "expose-loader",
          query: "Phaser",
        },
      },
      {
        test: /p2\.js/,
        use: {
          loader: "expose-loader",
          query: "p2",
        },
      },
      /**
       * Style Loaders
       */
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
      },
      /**
       * Font loaders
       */
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&minetype=application/font-woff",
        options: {
          limit: 10000,
          mimetype: "application/font-woff",
          name: path.join(outputFontsDirectory, "[name].[hash].[ext]"),
        },
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          mimetype: "application/octet-stream",
          name: path.join(outputFontsDirectory, "[name].[hash].[ext]"),
        },
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader",
        options: {
          name: path.join(outputFontsDirectory, "[name].[hash].[ext]"),
        },
      },
      /**
       * Image Loaders
       */
      {
        test: /\.(jpg|jpeg|png|gif)$/,
        loader: "file-loader",
        options: {
          name: path.join(outputImagesDirectory, "[name].[hash].[ext]"),
        },
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader",
        options: {
          name: path.join(outputImagesDirectory, "[name].[hash].[ext]"),
          limit: 10000,
          mimetype: "image/svg+xml",
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
    fs: "empty",
    net: "empty",
    tls: "empty",
    console: true,
  },
}
