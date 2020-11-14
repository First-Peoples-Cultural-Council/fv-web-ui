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
// Link.react.test.js
import React from 'react'
import renderer from 'react-test-renderer'
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}))

// jest.mock('dataSources/useSearchDialect', () => ({
//   ...jest.requireActual('dataSources/useSearchDialect'),
//   computeSearchDialect: jest.fn(),
//   searchDialectUpdate: jest.fn(),
//   searchDialectReset: jest.fn(),
// }))

// import * as useCustomHook from 'dataSources/useSearchDialect'
import * as useSearchDialect from 'dataSources/useSearchDialect'
const spyUseSearchDialect = jest.spyOn(useSearchDialect, 'default')
spyUseSearchDialect.mockReturnValue({
  computeSearchDialect: {
    searchByMode: 1,
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

import * as useRoute from 'dataSources/useRoute'
const spyUseRoute = jest.spyOn(useRoute, 'default')
spyUseRoute.mockReturnValue({
  routeParams: {
    letter: '',
    category: '',
    phraseBook: '',
  },
})
jest.mock('@material-ui/core/styles', () => ({
  /* eslint-disable-next-line */
  withStyles: (styles) => (component) => component,
}))

import SearchDialectContainer from 'components/SearchDialect2/SearchDialectContainer'

test('SearchDialect renders', () => {
  //   const fakeComputeSearchDialect = {
  //     searchByMode: 1,
  //     searchBySettings: {},
  //     searchMessage: '',
  //     searchNxqlSort: '',
  //     searchNxqlQuery: '',
  //     searchTerm: '',
  //     searchType: 1,
  //   }
  //   computeSearchDialect.mockResolvedValue(fakeComputeSearchDialect)
  const component = renderer.create(<SearchDialectContainer />)
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
  /*
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()

  // manually trigger the callback
  tree.props.onMouseEnter()
  // re-rendering
  tree = component.toJSON()
  expect(tree).toMatchSnapshot()

  // manually trigger the callback
  tree.props.onMouseLeave()
  // re-rendering
  tree = component.toJSON()
  expect(tree).toMatchSnapshot()
  */
})
