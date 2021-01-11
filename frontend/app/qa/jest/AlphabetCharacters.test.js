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
  withTheme: () => {},
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

// Let us begin!
// ==================================================
import React from 'react'
import { Provider } from 'react-redux'
import store from 'state/store'
import renderer from 'react-test-renderer'
import AlphabetCharactersContainer from 'components/AlphabetCharacters/AlphabetCharactersContainer'
import AlphabetCharactersData from 'components/AlphabetCharacters/AlphabetCharactersData'
import AlphabetCharactersPresentation from 'components/AlphabetCharacters/AlphabetCharactersPresentation'

describe('AlphabetCharacters', () => {
  // Container
  test('Container', () => {
    const component = renderer.create(
      <Provider store={store}>
        <AlphabetCharactersContainer />
      </Provider>
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  // Data
  test('Data', () => {
    // Updated in AlphabetCharactersData.children
    let output = {}

    renderer.create(
      <AlphabetCharactersData>
        {(dataLayerOutput) => {
          output = dataLayerOutput
          return null
        }}
      </AlphabetCharactersData>
    )
    expect(output).toMatchInlineSnapshot(`
      Object {
        "characters": Array [],
        "dialectClassName": "fontBCSans",
        "onClick": [Function],
      }
    `)
  })
  // Presentation
  test('Presentation > 1 Active & 1 Inactive', () => {
    const component = renderer.create(
      <Provider store={store}>
        <AlphabetCharactersPresentation
          characters={[
            { title: 'Active', href: '#', isActiveCharacter: true },
            { title: 'Inactive', href: '#', isActiveCharacter: false },
          ]}
        />
      </Provider>
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
  // Presentation
  test('Presentation > No Chars', () => {
    const component = renderer.create(
      <Provider store={store}>
        <AlphabetCharactersPresentation characters={[]} />
      </Provider>
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
