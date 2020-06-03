// const webpackCommon = require('./build/webpack.common.js')
// const wpResolveAlias = webpackCommon.resolve.alias
// const webpackAliases = {
//   models: wpResolveAlias.models,
//   views: wpResolveAlias.views,
//   conf: wpResolveAlias.conf,
//   operations: wpResolveAlias.operations,
//   components: wpResolveAlias.components,
//   common: wpResolveAlias.common,
//   images: wpResolveAlias.images,
// }
// console.log('!!!', webpackAliases)
const moduleNameMapper = {
  '^models(.*)$': '<rootDir>/app/assets/javascripts/models$1',
  '^views(.*)$': '<rootDir>/app/assets/javascripts/views$1',
  '^conf(.*)$': '<rootDir>/app/assets/javascripts/configuration$1',
  '^operations(.*)$': '<rootDir>/app/assets/javascripts/operations$1',
  '^providers(.*)$': '<rootDir>/app/assets/javascripts/providers$1',
  '^components(.*)$': '<rootDir>/app/assets/javascripts/components$1',
  '^common(.*)$': '<rootDir>/app/assets/javascripts/common$1',
  '^images(.*)$': '<rootDir>/app/assets/images$1',
  '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
    '<rootDir>/__mocks__/fileMock.js',
  '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js',
}

module.exports = {
  verbose: true,
  modulePathIgnorePatterns: [
    '/app/assets/games/',
    '/app/assets/javascripts/views/pages/test.js',
    '/app/assets/javascripts/__tests__/test.js',
    '/cypress/',
    '/app/assets/javascripts/views/components/Legacy/',
    '/build/',
    '__tests__/__mocks__/',
  ],
  // Note: jsdom is a bit slower to run than `node`
  testEnvironment: 'jsdom',
  moduleNameMapper,
  collectCoverageFrom: ['<rootDir>/app/assets/javascripts/**/*.js'],
  coverageThreshold: {
    global: {
      statements: 0,
      branches: 0,
      functions: 0,
      lines: 0,
    },
  },
  setupFiles: ['./jest.setup.js'],
  testResultsProcessor: 'jest-sonar-reporter',
}
