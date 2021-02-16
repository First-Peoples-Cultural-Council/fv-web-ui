const alias = require('./webpack/webpack.alias')
module.exports = {
  require: ['dist/tailwind.css'],
  components: 'src/components/!(_TEMPLATE|AppFrame)*/!(index)+(Presentation)*.js',
  webpackConfig: require('./webpack/webpack.styleguidist.js'),
  moduleAliases: alias,
}
