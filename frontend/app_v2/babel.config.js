// NOTE: This config is used by Jest when it's running tests
// NOTE: There is duplication between this file and settings within `webpack/*`
module.exports = {
  exclude: [/node_modules/],
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: 3,
      },
    ],
  ],
}
