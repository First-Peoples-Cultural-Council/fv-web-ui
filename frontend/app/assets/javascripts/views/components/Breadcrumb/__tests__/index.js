
jest.mock('providers/redux/reducers/rest')
jest.mock('common/NavigationHelpers')

// To test:
import { Breadcrumb } from '..'
import routesDefault from 'conf/routes'

// Setup:
import React from 'react'
import ReactDOM from 'react-dom'
import ReactDOMServer from 'react-dom/server'
import Immutable from 'immutable'

const { axe, toHaveNoViolations } = require('jest-axe')
expect.extend(toHaveNoViolations)

const matchedPageHome = {'id': 'page_explore_dialect', 'path': ['nuxeo', 'app', {'id': 'theme', 'matcher': {}}, 'FV', {'id': 'area', 'matcher': {}}, 'Data', {}, {}, {}], 'title': '{$dialect_name} Home | {$theme}', 'page': {'key': null, 'ref': null, 'props': {}, '_owner': null, '_store': {}}, 'extractPaths': true, 'redirects': [{}], 'warnings': ['multiple_dialects']}
const findReplaceHome = undefined
const routeParamsHome = {'siteTheme': 'explore', 'area': 'sections', 'dialect_name': 'SENĆOŦEN', 'dialect_path': '/FV/sections/Data/SENĆOŦEN/SENĆOŦEN/SENĆOŦEN', 'language_name': 'SENĆOŦEN', 'language_path': '/FV/sections/Data/SENĆOŦEN/SENĆOŦEN', 'language_family_name': 'SENĆOŦEN', 'language_family_path': '/FV/sections/Data/SENĆOŦEN'}
const splitWindowPathHome = ['nuxeo', 'app', 'explore', 'FV', 'sections', 'Data', 'SEN%C4%86O%C5%A6EN', 'SEN%C4%86O%C5%A6EN', 'SEN%C4%86O%C5%A6EN']

const matchedPageLearn = {'path': ['nuxeo', 'app', {'id': 'theme', 'matcher': {}}, 'FV', {'id': 'area', 'matcher': {}}, 'Data', {}, {}, {}, 'learn'], 'title': 'Learn {$dialect_name}', 'page': {'key': null, 'ref': null, 'props': {}, '_owner': null, '_store': {}}, 'extractPaths': true, 'redirects': [{}]}
const findReplaceLearn = undefined
const routeParamsLearn = {'siteTheme': 'explore', 'area': 'sections', 'dialect_name': 'SENĆOŦEN', 'dialect_path': '/FV/sections/Data/SENĆOŦEN/SENĆOŦEN/SENĆOŦEN', 'language_name': 'SENĆOŦEN', 'language_path': '/FV/sections/Data/SENĆOŦEN/SENĆOŦEN', 'language_family_name': 'SENĆOŦEN', 'language_family_path': '/FV/sections/Data/SENĆOŦEN'}
const splitWindowPathLearn = ['nuxeo', 'app', 'explore', 'FV', 'sections', 'Data', 'SEN%C4%86O%C5%A6EN', 'SEN%C4%86O%C5%A6EN', 'SEN%C4%86O%C5%A6EN', 'learn']

const matchedPageWords = {'path': ['nuxeo', 'app', {'id': 'theme', 'matcher': {}}, 'FV', {'id': 'area', 'matcher': {}}, 'Data', {}, {}, {}, 'learn', 'words'], 'title': 'Words | {$dialect_name}', 'page': {'key': null, 'ref': null, 'props': {}, '_owner': null, '_store': {}}, 'extractPaths': true, 'redirects': [{}]}
const findReplaceWords = undefined
const routeParamsWords = {'siteTheme': 'explore', 'area': 'sections', 'dialect_name': 'SENĆOŦEN', 'dialect_path': '/FV/sections/Data/SENĆOŦEN/SENĆOŦEN/SENĆOŦEN', 'language_name': 'SENĆOŦEN', 'language_path': '/FV/sections/Data/SENĆOŦEN/SENĆOŦEN', 'language_family_name': 'SENĆOŦEN', 'language_family_path': '/FV/sections/Data/SENĆOŦEN'}
const splitWindowPathWords = ['nuxeo', 'app', 'explore', 'FV', 'sections', 'Data', 'SEN%C4%86O%C5%A6EN', 'SEN%C4%86O%C5%A6EN', 'SEN%C4%86O%C5%A6EN', 'learn', 'words']

const matchedPageWord = {'path': ['nuxeo', 'app', {'id': 'theme', 'matcher': {}}, 'FV', {'id': 'area', 'matcher': {}}, 'Data', {}, {}, {}, 'learn', 'words', {'id': 'word', 'matcher': {}}], 'title': '{$word} | Words | {$dialect_name}', 'page': {'key': null, 'ref': null, 'props': {}, '_owner': null, '_store': {}}, 'redirects': [{}], 'extractPaths': true}
const findReplaceWord = {'find': '3110f4c7-69d5-459d-bcc1-78314e2e6474', 'replace': 'animal word'}
const routeParamsWord = {'siteTheme': 'explore', 'area': 'sections', 'word': '3110f4c7-69d5-459d-bcc1-78314e2e6474', 'dialect_name': 'SENĆOŦEN', 'dialect_path': '/FV/sections/Data/SENĆOŦEN/SENĆOŦEN/SENĆOŦEN', 'language_name': 'SENĆOŦEN', 'language_path': '/FV/sections/Data/SENĆOŦEN/SENĆOŦEN', 'language_family_name': 'SENĆOŦEN', 'language_family_path': '/FV/sections/Data/SENĆOŦEN'}
const splitWindowPathWord = ['nuxeo', 'app', 'explore', 'FV', 'sections', 'Data', 'SEN%C4%86O%C5%A6EN', 'SEN%C4%86O%C5%A6EN', 'SEN%C4%86O%C5%A6EN', 'learn', 'words', '3110f4c7-69d5-459d-bcc1-78314e2e6474']


const getComponent = (props = {}) => {
  const {
    splitWindowPath = splitWindowPathHome,
    routeParams = routeParamsHome,
    matchedPage = matchedPageHome,
    findReplace = findReplaceHome,
    routes = routesDefault,
  } = props
  return (
    <Breadcrumb
      splitWindowPath={splitWindowPath}
      routeParams={routeParams}
      findReplace={findReplace}
      matchedPage={Immutable.fromJS(matchedPage)}
      routes={Immutable.fromJS(routes)}
    />
  )
}
const regexWs = /\s/g
describe('Breadcrumb', () => {
  test('Renders correctly: Dialect Home', () => {
    // Arrange
    const container = document.createElement('div')
    ReactDOM.render(getComponent({
      splitWindowPath: splitWindowPathHome,
      routeParams: routeParamsHome,
      matchedPage: matchedPageHome,
      findReplace: findReplaceHome,
      routes: routesDefault,
    }), container)

    // Act

    // Assert
    expect(container.querySelector('ul').textContent.replace(regexWs, '').toLowerCase()).toMatch(/^senćoŧenhomepage$/)
  })

  test('Renders correctly: Dialect Learn', () => {
    // Arrange
    const container = document.createElement('div')
    ReactDOM.render(getComponent({
      splitWindowPath: splitWindowPathLearn,
      routeParams: routeParamsLearn,
      matchedPage: matchedPageLearn,
      findReplace: findReplaceLearn,
      routes: routesDefault,
    }), container)

    // Act

    // Assert
    expect(container.querySelector('ul').textContent.replace(regexWs, '').toLowerCase()).toMatch(/^senćoŧenhomepagelearn$/)
  })

  test('Renders correctly: Dialect Words', () => {
    // Arrange
    const container = document.createElement('div')
    ReactDOM.render(getComponent({
      splitWindowPath: splitWindowPathWords,
      routeParams: routeParamsWords,
      matchedPage: matchedPageWords,
      findReplace: findReplaceWords,
      routes: routesDefault,
    }), container)

    // Act

    // Assert
    expect(container.querySelector('ul').textContent.replace(regexWs, '').toLowerCase()).toMatch(/^senćoŧenhomepagelearnwords$/)
  })

  test('Renders correctly: Dialect Word', () => {
    // Arrange
    const container = document.createElement('div')
    ReactDOM.render(getComponent({
      splitWindowPath: splitWindowPathWord,
      routeParams: routeParamsWord,
      matchedPage: matchedPageWord,
      findReplace: findReplaceWord,
      routes: routesDefault,
    }), container)

    // Act

    // Assert
    expect(container.querySelector('ul').textContent.replace(regexWs, '').toLowerCase()).toMatch(/^senćoŧenhomepagelearnwordsanimalword$/)
  })

  test('Is accessibile', async() => {
    // Arrange
    const html = ReactDOMServer.renderToString(getComponent())
    const results = await axe(html)

    // console.log(`--- html ---
    // ${html}
    // `)

    // Act

    // Assert
    expect(results).toHaveNoViolations()
  })
})
