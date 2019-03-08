const merge = require("webpack-merge")
const commonWebpackConfig = require("./webpack.common")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const GitRevisionPlugin = require("git-revision-webpack-plugin")

var gitRevisionPlugin = new GitRevisionPlugin()

// Path
const path = require("path")

// Root Directories
const frontEndRootDirectory = path.resolve(__dirname, "..")

/**
 * Development Webpack Configuration
 */
module.exports = merge(commonWebpackConfig, {
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(frontEndRootDirectory, "index.html"),
      templateParameters: {
        VERSION: gitRevisionPlugin.version(),
        BASE_URL: "http://localhost:8080/nuxeo/",
      },
    }),
  ],
})
