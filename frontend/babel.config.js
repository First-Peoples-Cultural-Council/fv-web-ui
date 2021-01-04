module.exports = function babelConfig(api) {
  api.cache(true)
  return {
    // TODO: FW-2056 - Are we using the env.test config?
    env: {
      test: {
        plugins: ['transform-class-properties', ['@babel/plugin-proposal-decorators', { legacy: true }]],
      },
    },
  }
}
