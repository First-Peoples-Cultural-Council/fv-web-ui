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
