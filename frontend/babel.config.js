module.exports = function babelConfig(api) {
  api.cache(true)
  const presets = [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    '@babel/preset-react',
  ]
  const plugins = [
    // NOTE: Adding 'transform-class-properties' will break Cypress testing
    '@babel/plugin-syntax-jsx',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    'dynamic-import-node',
    '@babel/plugin-transform-runtime',
  ]
  return {
    presets,
    plugins,
    // TODO: FW-2056 - Are we using the env.test config?
    env: {
      test: {
        plugins: ['transform-class-properties', ['@babel/plugin-proposal-decorators', { legacy: true }]],
      },
    },
  }
}
