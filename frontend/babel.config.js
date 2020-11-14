module.exports = function babelConfig(api) {
  api.cache(true)
  const presets = ['@babel/preset-env', '@babel/preset-react']
  const plugins = [
    // NOTE: Adding 'transform-class-properties' will break Cypress testing
    'syntax-dynamic-import',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    'dynamic-import-node',
  ]

  return {
    presets,
    plugins,
    env: {
      test: {
        plugins: [
          'transform-class-properties',
          'syntax-dynamic-import',
          ['@babel/plugin-proposal-decorators', { legacy: true }],
          'dynamic-import-node',
        ],
      },
    },
  }
}
