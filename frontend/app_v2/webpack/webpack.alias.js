const path = require('path')

// Sources
const appV2 = path.resolve(__dirname, '..')
const src = path.resolve(appV2, 'src')
const components = path.resolve(src, 'components')
const common = path.resolve(src, 'common')
const services = path.resolve(src, 'services')
const assets = path.resolve(src, 'assets')
const assetsServer = path.resolve(assets, 'server.js')
const fonts = path.join(assets, 'fonts')
const images = path.join(assets, 'images')
const favicons = path.join(assets, 'favicons')

// Build/Deploy
const dist = path.resolve(appV2, 'dist')
const distAssets = path.resolve(dist, 'assets')
const distServer = path.resolve(dist, 'server.js')
const distFonts = path.join(distAssets, 'fonts')
const distScripts = path.join(distAssets, 'js')
const distImages = path.join(distAssets, 'images')
const distFavicons = path.join(distAssets, 'favicons')

module.exports = {
  assetsServer,
  distServer,
  assets,
  common,
  components,
  dist,
  distFavicons,
  distFonts,
  distImages,
  distScripts,
  favicons,
  fonts,
  images,
  services,
  src,
}
