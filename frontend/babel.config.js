module.exports = function babelConfig(api) {
  api.cache(true)

  // Jest auto sets NODE_ENV = 'test'
  const isInTest = String(process.env.NODE_ENV) === 'test'

  const presets = [
    [
      '@babel/preset-env',
      {
        modules: isInTest ? 'commonjs' : false,
        targets: {
          node: 'current',
        },
      },
    ],
    '@babel/react',
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
