module.exports = function babelConfig(api) {
  api.cache(true)
  // TODO: FW-2056
  // const presets = [
  //   [
  //     '@babel/preset-env',
  //     {
  //       targets: {
  //         node: 'current',
  //       },
  //     },
  //   ],
  //   '@babel/preset-react',
  // ]
  // const plugins = [
  //   // NOTE: Adding 'transform-class-properties' will break Cypress testing
  //   'syntax-dynamic-import',
  //   ['@babel/plugin-proposal-decorators', { legacy: true }],
  //   'dynamic-import-node',
  //   '@babel/plugin-transform-runtime',
  // ]

  return {
    // TODO: FW-2056
    // presets,
    // plugins,
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
