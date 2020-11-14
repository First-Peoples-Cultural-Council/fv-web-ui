/*
url driven: separate tests?

given props...
    - text filled
    - search type set
    - checkboxes clicked
    - part of speech selected
    - reset button displayed
    - feedback message displayed: separate tests?

Reset:
    - if query in url, changes url
    - if no query in url, clears input, resets to initial
    - if no text in search, button is hidden

Search:
    - if no text in search, do?
    - updates url with appropriate url queries

Alphabet:
    - no search ui
    - message displayed

Category:
    - no search ui
    - message displayed
*/

// Mock: react-redux
// --------------------------------------------------
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}))

// Mock: @material-ui/core/styles
// --------------------------------------------------
jest.mock('@material-ui/core/styles', () => ({
  /* eslint-disable-next-line */
  withStyles: (styles) => (component) => component,
}))

// Mock: useSearchDialect
// --------------------------------------------------
import { SEARCH_BY_DEFAULT, SEARCH_DATA_TYPE_WORD } from 'common/Constants'
import * as useSearchDialect from 'dataSources/useSearchDialect'
const spyUseSearchDialect = jest.spyOn(useSearchDialect, 'default')
spyUseSearchDialect.mockReturnValue({
  computeSearchDialect: {
    searchByMode: SEARCH_BY_DEFAULT,
    searchBySettings: {},
    searchMessage: '',
    searchNxqlSort: '',
    searchNxqlQuery: '',
    searchTerm: '',
    searchType: 1,
  },
  searchDialectUpdate: () => {},
  searchDialectReset: () => {},
})

// Mock: useRoute
// --------------------------------------------------
import * as useRoute from 'dataSources/useRoute'
const spyUseRoute = jest.spyOn(useRoute, 'default')
spyUseRoute.mockReturnValue({
  routeParams: {
    letter: '',
    category: '',
    phraseBook: '',
  },
})

// Mock: useIntl
// --------------------------------------------------
import * as useIntl from 'dataSources/useIntl'
const spyUseIntl = jest.spyOn(useIntl, 'default')
spyUseIntl.mockReturnValue({
  intl: {
    trans: () => {},
  },
})

// Mock: useDirectory
// --------------------------------------------------
import * as useDirectory from 'dataSources/useDirectory'
const spyUseDirectory = jest.spyOn(useDirectory, 'default')
spyUseDirectory.mockReturnValue({
  computeDirectory: {},
  fetchDirectory: () => {},
})

// Let us begin!
// ==================================================
import React from 'react'
import renderer from 'react-test-renderer'
import SearchDialectContainer from 'components/SearchDialect2/SearchDialectContainer'
import SearchDialectData from 'components/SearchDialect2/SearchDialectData'
const searchDialectDataType = SEARCH_DATA_TYPE_WORD
const searchUi = [
  {
    defaultChecked: true,
    idName: 'searchByTitle',
    labelText: 'Word',
    urlParam: 'sTitle',
  },
  {
    defaultChecked: true,
    idName: 'searchByDefinitions',
    labelText: 'Definitions',
    urlParam: 'sDefinitions',
  },
  {
    idName: 'searchByTranslations',
    labelText: 'Literal translations',
    urlParam: 'sTranslations',
  },
  {
    type: 'select',
    idName: 'searchPartOfSpeech',
    labelText: 'Parts of speech:',
    urlParam: 'sPartSpeech',
  },
]

// Container
test('Container layer renders everything', () => {
  const component = renderer.create(
    <SearchDialectContainer
      handleSearch={() => {}}
      resetSearch={() => {}}
      searchDialectDataType={searchDialectDataType}
      searchUi={searchUi}
    />
  )
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

// Data
test('Data layer outputs the same data', () => {
  // Updated in SearchDialectData.children
  let output = {}

  renderer.create(
    <SearchDialectData
      handleSearch={() => {}}
      resetSearch={() => {}}
      searchDialectDataType={searchDialectDataType}
      searchUi={searchUi}
    >
      {(dataLayerOutput) => {
        output = dataLayerOutput
        return null
      }}
    </SearchDialectData>
  )
  expect(output).toMatchInlineSnapshot(`
    Object {
      "dialectClassName": "fontBCSans",
      "handleChangeSearchBySettings": [Function],
      "handleEnterSearch": [Function],
      "handleSearch": [Function],
      "intl": Object {
        "trans": [Function],
      },
      "partsOfSpeechOptions": null,
      "resetSearch": [Function],
      "searchByMode": 0,
      "searchBySettings": Object {},
      "searchDialectDataType": 6,
      "searchDialectUpdate": [Function],
      "searchMessage": "",
      "searchNxqlQuery": "",
      "searchTerm": "",
      "searchType": 1,
      "searchUi": Array [
        Object {
          "defaultChecked": true,
          "idName": "searchByTitle",
          "labelText": "Word",
          "urlParam": "sTitle",
        },
        Object {
          "defaultChecked": true,
          "idName": "searchByDefinitions",
          "labelText": "Definitions",
          "urlParam": "sDefinitions",
        },
        Object {
          "idName": "searchByTranslations",
          "labelText": "Literal translations",
          "urlParam": "sTranslations",
        },
        Object {
          "idName": "searchPartOfSpeech",
          "labelText": "Parts of speech:",
          "type": "select",
          "urlParam": "sPartSpeech",
        },
      ],
    }
  `)
})
