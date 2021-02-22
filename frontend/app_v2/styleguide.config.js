const path = require('path')
const alias = require('./webpack/webpack.alias')

module.exports = {
  require: ['dist/styleguide/tailwind.css'],
  components: 'src/components/!(_TEMPLATE|AppFrame)*/!(index)+(Presentation)*.js',
  webpackConfig: require('./webpack/webpack.styleguidist.js'),
  moduleAliases: alias,
  styleguideComponents: {
    Wrapper: path.join(__dirname, 'src/qa/Styleguide/StyleguideWrapper'),
  },
  serverPort: 3003,
}
