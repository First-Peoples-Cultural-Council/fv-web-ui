module.exports = function babelConfig(api) {
  api.cache(true)
  return {
    // Note: env.test is used with Jest tests
    // If presets/plugins is moved outside of env.test the website breaks
    // ie: `extends.js?2998:3 Uncaught ReferenceError: exports is not defined`
    // We configured presets/plugins for the website over in webpack.common
    env: {
      test: {
        presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-react'],
        plugins: [
          '@babel/plugin-syntax-jsx',
          '@babel/plugin-syntax-dynamic-import',
          ['@babel/plugin-proposal-decorators', { legacy: true }],
          ['@babel/plugin-proposal-class-properties', { loose: true }],
          '@babel/plugin-transform-runtime',
        ],
      },
    },
  }
}
