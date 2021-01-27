const path = require('path')

// Sources
const appV2 = path.resolve(__dirname, '..')
const src = path.resolve(appV2, 'src')
const components = path.resolve(src, 'components')

// Build/Deploy
const pub = path.resolve(appV2, 'public')
const pubFonts = path.join(pub, 'fonts')
const pubImages = path.join(pub, 'images')

module.exports = {
  appV2,
  components,
  pub,
  pubFonts,
  pubImages,
  src,
}
