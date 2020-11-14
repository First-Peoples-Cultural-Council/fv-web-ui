
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
module.exports = {
  frontEndRootDirectory,
  rootDirectory,
  sourceDirectory,
  sourceAssetsDirectory,
  sourceStateDirectory,
  sourceStylesDirectory,
  sourceImagesDirectory,
  sourceFontsDirectory,
  sourceFaviconsDirectory,
  sourceGamesDirectory,
  outputAssetsDirectory,
  outputDirectory,
  outputDirectoryLegacy,
  outputScriptsDirectory,
  outputFontsDirectory,
  outputImagesDirectory,
  outputStylesDirectory,
  outputGamesDirectory,
}
