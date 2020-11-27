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

// Let us begin!
// ==================================================
import React from 'react'
import renderer from 'react-test-renderer'
import FlashcardButtonContainer from 'components/FlashcardButton/FlashcardButtonContainer'
import FlashcardButtonData from 'components/FlashcardButton/FlashcardButtonData'
import FlashcardButtonPresentation from 'components/FlashcardButton/FlashcardButtonPresentation'

describe('FlashcardButton', () => {
  // Container
  test('Container', () => {
    const component = renderer.create(<FlashcardButtonContainer />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  // Data
  test('Data', () => {
    // Updated in FlashcardButtonData.children
    let output = {}

    renderer.create(
      <FlashcardButtonData>
        {(dataLayerOutput) => {
          output = dataLayerOutput
          return null
        }}
      </FlashcardButtonData>
    )
    expect(output).toMatchInlineSnapshot(`
      Object {
        "onClickDisable": [Function],
        "onClickEnable": [Function],
        "queryFlashcard": undefined,
      }
    `)
  })
  // Presentation
  test('Presentation: flashcard mode is inactive', () => {
    const component = renderer.create(<FlashcardButtonPresentation />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
  test('Presentation: flashcard mode is active', () => {
    const component = renderer.create(<FlashcardButtonPresentation queryFlashcard={1} />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
