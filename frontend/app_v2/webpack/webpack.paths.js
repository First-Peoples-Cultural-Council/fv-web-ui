const path = require('path')

// Sources
const appV2 = path.resolve(__dirname, '..')
const src = path.resolve(appV2, 'src')
const components = path.resolve(src, 'components')
const common = path.resolve(src, 'common')
const services = path.resolve(src, 'services')

// Build/Deploy
const pub = path.resolve(appV2, 'public')
const pubFonts = path.join(pub, 'fonts')
const pubImages = path.join(pub, 'images')

module.exports = {
  appV2,
  components,
  common,
  pub,
  pubFonts,
  pubImages,
  src,
  services,
}
