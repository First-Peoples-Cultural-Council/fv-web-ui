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
import {
  SEARCH_PART_OF_SPEECH_ANY,
  SEARCH_DATA_TYPE_WORD,
  SEARCHDIALECT_CHECKBOX,
  SEARCHDIALECT_SELECT,
} from 'common/Constants'

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
import SearchDialectContainer from 'components/SearchDialect/SearchDialectContainer'
import SearchDialectCheckbox from 'components/SearchDialect/SearchDialectCheckbox'
import SearchDialectSelect from 'components/SearchDialect/SearchDialectSelect'
import SearchDialectData from 'components/SearchDialect/SearchDialectData'

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
describe('SearchDialect', () => {
  // Container
  test('Container', () => {
    const component = renderer.create(
      <SearchDialectContainer
        incrementResetCount={() => {}}
        childrenUiSecondary={[
          {
            type: SEARCHDIALECT_CHECKBOX,
            defaultChecked: true, // TODO: can set checked based on url queries
            idName: 'searchByTitle',
            labelText: 'Word',
          },
          {
            type: SEARCHDIALECT_CHECKBOX,
            defaultChecked: true,
            idName: 'searchByDefinitions',
            labelText: 'Definitions',
          },
          {
            type: SEARCHDIALECT_CHECKBOX,
            idName: 'searchByTranslations',
            labelText: 'Literal translations',
          },
          {
            type: SEARCHDIALECT_SELECT,
            defaultValue: SEARCH_PART_OF_SPEECH_ANY,
            idName: 'searchPartOfSpeech',
            labelText: 'Parts of speech:',
            options: [
              {
                text: 'Any',
                value: SEARCH_PART_OF_SPEECH_ANY,
              },
              {
                value: null,
                text: '─────────────',
              },
              {
                value: 'adverb',
                text: 'Adverb',
              },
            ],
          },
        ].map(({ defaultChecked, defaultValue, idName, labelText, options, type }, index) => {
          switch (type) {
            case SEARCHDIALECT_CHECKBOX:
              return (
                <SearchDialectCheckbox
                  key={`checkbox${index}`}
                  defaultChecked={defaultChecked}
                  idName={idName}
                  labelText={labelText}
                />
              )
            case SEARCHDIALECT_SELECT: {
              return (
                <SearchDialectSelect
                  key={`select${index}`}
                  defaultValue={defaultValue}
                  idName={idName}
                  labelText={labelText}
                >
                  {options.map(({ value, text }, optionKey) => {
                    return (
                      <option key={`option${optionKey}`} value={value} disabled={value === null}>
                        {text}
                      </option>
                    )
                  })}
                </SearchDialectSelect>
              )
            }
            default:
              return null
          }
        })}
        searchDialectDataType={searchDialectDataType}
      />
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  // Data
  test('Data', () => {
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
      "formRefSearch": Object {
        "current": null,
      },
      "intl": Object {
        "trans": [Function],
      },
      "onPressEnter": [Function],
      "onReset": [Function],
      "onSearch": [Function],
      "searchStyle": "match",
      "searchTerm": undefined,
    }
  `)
  })
})
