const webpack = require("webpack")
const merge = require("webpack-merge")
const common = require("./webpack.common")

const TerserPlugin = require("terser-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const GitRevisionPlugin = require("git-revision-webpack-plugin")

var gitRevisionPlugin = new GitRevisionPlugin()

// Path
const path = require("path")

// Root Directories
const frontEndRootDirectory = path.resolve(__dirname, "..")

/**
 * Production Webpack Configuration
 */
module.exports = merge(common, {
  mode: "production",
  devtool: "",
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(frontEndRootDirectory, "index.html"),
      templateParameters: {
        VERSION: gitRevisionPlugin.version(),
        BASE_URL: "https://www.firstvoices.com/nuxeo/",
      },
    }),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
})
