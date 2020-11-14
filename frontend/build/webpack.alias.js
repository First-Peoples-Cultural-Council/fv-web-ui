const path = require('path')
const paths = require('./webpack.paths')
const sourceDirectory = paths.sourceDirectory
const sourceAssetsDirectory = paths.sourceAssetsDirectory
const sourceStateDirectory = paths.sourceStateDirectory
const sourceGamesDirectory = paths.sourceGamesDirectory
const sourceImagesDirectory = paths.sourceImagesDirectory
const sourceStylesDirectory = paths.sourceStylesDirectory

const phaserModule = path.resolve('./node_modules/phaser-ce/')
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
const pixi = path.join(phaserModule, 'build/custom/pixi.js')
const p2 = path.join(phaserModule, 'build/custom/p2.js')

module.exports = {
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
}
